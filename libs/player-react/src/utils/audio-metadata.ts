export interface AudioMetadata {
  title?: string;
  format?: string;
  bitrate?: number;
  sampleRate?: number;
  duration?: number;
  channels?: number;
  fileSize?: number;
  codec?: string;
  bitsPerSample?: number;
}

// 音频格式特征
const AUDIO_FORMAT_SIGNATURES = {
  mp3: {
    signature: [0xFF, 0xFB], // MPEG-1 Layer 3
    offset: 0,
  },
  wav: {
    signature: [0x52, 0x49, 0x46, 0x46], // "RIFF"
    offset: 0,
  },
  ogg: {
    signature: [0x4F, 0x67, 0x67, 0x53], // "OggS"
    offset: 0,
  },
  flac: {
    signature: [0x66, 0x4C, 0x61, 0x43], // "fLaC"
    offset: 0,
  },
  m4a: {
    signature: [0x66, 0x74, 0x79, 0x70], // "ftyp"
    offset: 4,
  },
  wma: {
    signature: [0x30, 0x26, 0xB2, 0x75], // WMA header GUID
    offset: 0,
  },
};

// MP3 比特率表
const BITRATE_TABLE = {
  'v1l1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
  'v1l2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  'v1l3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  'v2l1': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
  'v2l2': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  'v2l3': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
} as const;

// MP3 采样率表
const SAMPLE_RATE_TABLE = {
  1: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  2.5: [11025, 12000, 8000],
} as const;

// 获取 MP3 比特率
function getBitrate(version: number, layer: number, bitrateIndex: number): number {
  const key = `v${version === 3 ? '1' : '2'}l${4 - layer}` as keyof typeof BITRATE_TABLE;
  return BITRATE_TABLE[key][bitrateIndex] || 128;
}

// 获取 MP3 采样率
function getSampleRate(version: number, sampleRateIndex: number): number {
  const ver = version === 3 ? 1 : version === 2 ? 2 : 2.5;
  return SAMPLE_RATE_TABLE[ver as keyof typeof SAMPLE_RATE_TABLE][sampleRateIndex] || 44100;
}

// 检测音频格式
function detectAudioFormat(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer);

  for (const [format, { signature, offset }] of Object.entries(AUDIO_FORMAT_SIGNATURES)) {
    if (view.length < offset + signature.length) continue;

    const matches = signature.every((byte, index) => view[offset + index] === byte);
    if (matches) return format;
  }

  return 'unknown';
}

// 解析 WAV 头部
function parseWavHeader(buffer: ArrayBuffer): Partial<AudioMetadata> {
  const view = new DataView(buffer);
  const format = {
    sampleRate: view.getUint32(24, true),
    channels: view.getUint16(22, true),
    bitsPerSample: view.getUint16(34, true),
    duration: (buffer.byteLength - 44) / (view.getUint32(24, true) * view.getUint16(22, true) * (view.getUint16(34, true) / 8)),
  };
  return format;
}

// 解析 MP3 头部
function parseMp3Header(buffer: ArrayBuffer): Partial<AudioMetadata> {
  const view = new DataView(buffer);
  let offset = 0;

  // 跳过 ID3v2 标签
  if (view.getUint8(0) === 0x49 && view.getUint8(1) === 0x44 && view.getUint8(2) === 0x33) { // "ID3"
    const id3v2Flags = view.getUint8(5);
    const footerSize = (id3v2Flags & 0x10) ? 10 : 0;
    const size = (
      ((view.getUint8(6) & 0x7F) << 21) |
      ((view.getUint8(7) & 0x7F) << 14) |
      ((view.getUint8(8) & 0x7F) << 7) |
      (view.getUint8(9) & 0x7F)
    );
    offset = 10 + size + footerSize;
  }

  // 查找第一个有效的 MP3 帧
  while (offset < buffer.byteLength - 4) {
    if (view.getUint8(offset) === 0xFF && (view.getUint8(offset + 1) & 0xE0) === 0xE0) {
      const header = (
        (view.getUint8(offset) << 24) |
        (view.getUint8(offset + 1) << 16) |
        (view.getUint8(offset + 2) << 8) |
        view.getUint8(offset + 3)
      );

      const version = (header >> 19) & 3;
      const layer = (header >> 17) & 3;
      const bitrateIndex = (header >> 12) & 0xF;
      const sampleRateIndex = (header >> 10) & 3;
      const channelMode = (header >> 6) & 3;

      const bitrate = getBitrate(version, layer, bitrateIndex);
      const sampleRate = getSampleRate(version, sampleRateIndex);
      const channels = channelMode === 3 ? 1 : 2;

      return {
        bitrate,
        sampleRate,
        channels,
        codec: `MPEG-${version === 3 ? '1' : '2'} Layer ${4 - layer}`,
      };
    }
    offset++;
  }

  return {};
}

// 解析 Ogg 头部（完善版）
function parseOggHeader(buffer: ArrayBuffer): Partial<AudioMetadata> {
  const view = new DataView(buffer);
  if (buffer.byteLength < 58) return {}; // Ogg + Vorbis header minimum size

  let offset = 0;
  // 查找 Vorbis 头部
  while (offset < buffer.byteLength - 7) {
    if (view.getUint8(offset) === 0x01 && // header type
      view.getUint8(offset + 1) === 0x76 && // 'v'
      view.getUint8(offset + 2) === 0x6f && // 'o'
      view.getUint8(offset + 3) === 0x72 && // 'r'
      view.getUint8(offset + 4) === 0x62 && // 'b'
      view.getUint8(offset + 5) === 0x69 && // 'i'
      view.getUint8(offset + 6) === 0x73) { // 's'

      offset += 7;
      const channels = view.getUint8(offset + 4);
      const sampleRate = view.getUint32(offset + 5, true);
      const maxBitrate = view.getUint32(offset + 9, true);
      const nominalBitrate = view.getUint32(offset + 13, true);
      const minBitrate = view.getUint32(offset + 17, true);

      return {
        codec: 'Vorbis',
        channels,
        sampleRate,
        bitrate: nominalBitrate > 0 ? nominalBitrate : Math.floor((maxBitrate + minBitrate) / 2),
      };
    }
    offset++;
  }
  return {};
}

// 解析 FLAC 头部
function parseFlacHeader(buffer: ArrayBuffer): Partial<AudioMetadata> {
  const view = new DataView(buffer);
  if (buffer.byteLength < 34) return {};

  const streamInfo = {
    minBlockSize: view.getUint16(8, true),
    maxBlockSize: view.getUint16(10, true),
    minFrameSize: (view.getUint8(12) << 16) | (view.getUint8(13) << 8) | view.getUint8(14),
    maxFrameSize: (view.getUint8(15) << 16) | (view.getUint8(16) << 8) | view.getUint8(17),
    sampleRate: (view.getUint8(18) << 12) | (view.getUint8(19) << 4) | ((view.getUint8(20) & 0xF0) >> 4),
    channels: ((view.getUint8(20) & 0x0E) >> 1) + 1,
    bitsPerSample: ((view.getUint8(20) & 0x01) << 4) | ((view.getUint8(21) & 0xF0) >> 4) + 1,
  };

  return {
    codec: 'FLAC',
    sampleRate: streamInfo.sampleRate,
    channels: streamInfo.channels,
  };
}

// 解析 WMA 头部
function parseWmaHeader(buffer: ArrayBuffer): Partial<AudioMetadata> {
  const view = new DataView(buffer);
  if (buffer.byteLength < 70) return {}; // WMA header minimum size

  try {
    // 跳过头部 GUID (16 bytes) 和文件大小 (8 bytes)
    let offset = 24;

    // 查找 ASF_Stream_Properties_Object GUID
    while (offset < buffer.byteLength - 24) {
      const guidMatch =
        view.getUint32(offset, true) === 0x91 &&
        view.getUint32(offset + 4, true) === 0xF0 &&
        view.getUint32(offset + 8, true) === 0x11CF &&
        view.getUint32(offset + 12, true) === 0xD200;

      if (guidMatch) {
        // 跳过 GUID (16 bytes) 和对象大小 (8 bytes)
        offset += 24;

        // 解析音频属性
        const streamType = new Uint8Array(buffer.slice(offset, offset + 16));
        const isAudio = streamType[0] === 0x40 && streamType[1] === 0x9E;

        if (isAudio) {
          offset += 24; // 跳过 Stream Type GUID 和 Error Correction Type GUID

          // 读取 8 字节的时间偏移（替换 getUint64）
          offset += 8;

          const channels = view.getUint16(offset + 2, true);
          const samplesPerSec = view.getUint32(offset + 4, true);
          const avgBytesPerSec = view.getUint32(offset + 8, true);
          const bitsPerSample = view.getUint16(offset + 14, true);

          return {
            codec: 'WMA',
            channels,
            sampleRate: samplesPerSec,
            bitrate: avgBytesPerSec * 8,
            bitsPerSample,
          };
        }
      }
      offset++;
    }
  } catch (error) {
    console.warn('Error parsing WMA header:', error);
  }

  return {};
}

export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  const arrayBuffer = await file.arrayBuffer();
  const format = detectAudioFormat(arrayBuffer);

  // 从文件名解析基本信息
  const fileName = file.name.replace(/\.[^./]+$/, '');

  let metadata: AudioMetadata = {
    fileSize: file.size,
    format: file.type || format,
    title: fileName,
  };

  // 根据格式选择相应的解析器
  let formatMetadata: Partial<AudioMetadata> = {};
  switch (format) {
    case 'wav':
      formatMetadata = parseWavHeader(arrayBuffer);
      break;
    case 'mp3':
      formatMetadata = parseMp3Header(arrayBuffer);
      break;
    case 'ogg':
      formatMetadata = parseOggHeader(arrayBuffer);
      break;
    case 'flac':
      formatMetadata = parseFlacHeader(arrayBuffer);
      break;
    case 'wma':
      formatMetadata = parseWmaHeader(arrayBuffer);
      break;
  }

  // 如果文件头解析失败，尝试使用 AudioContext
  if (!formatMetadata.duration) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      formatMetadata = {
        ...formatMetadata,
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
      };
    } catch (error) {
      console.warn('Cannot decode audio data:', error);
    }
  }

  metadata = {
    ...metadata,
    ...formatMetadata,
  };

  // 计算比特率
  if (metadata.duration && metadata.duration > 0) {
    metadata.bitrate = Math.round((file.size * 8) / metadata.duration);
  }

  return metadata;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}
