export interface AudioMetadata {
  title?: string;
  format?: string;
  bitrate?: number;
  sampleRate?: number;
  duration?: number;
  channels?: number;
  fileSize?: number;
}

// 估算比特率（bps）
function estimateBitrate(fileSize: number, duration: number): number {
  if (!duration || duration <= 0) {
    return 0;
  }
  // 比特率（bps）= 文件大小（bytes）* 8 / 持续时间（seconds）
  return Math.round((fileSize * 8) / duration);
}

export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  const audioElement = new Audio();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const objectUrl = URL.createObjectURL(file);
  audioElement.src = objectUrl;

  // 从文件名解析基本信息
  const fileName = file.name.replace(/\.[^./]+$/, '');

  return new Promise((resolve) => {
    let metadata: AudioMetadata = {
      fileSize: file.size,
      format: file.type,
      title: fileName,
    };

    let cleanupFn: (() => void) | undefined;

    const handleError = () => {
      console.warn('Error loading audio:', audioElement.error);
      cleanupFn?.();
      resolve(metadata);
    };

    const handleLoadedMetadata = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        metadata = {
          ...metadata,
          channels: audioBuffer.numberOfChannels,
          duration: audioBuffer.duration,
          sampleRate: audioBuffer.sampleRate,
        };
        // 只在确保有了正确的 duration 后才计算比特率
        if (metadata.duration && metadata.duration > 0) {
          metadata.bitrate = estimateBitrate(file.size, metadata.duration);
        }
        resolve(metadata);
      }
      catch (error) {
        console.warn('Cannot decode audio data:', error);
        // 使用 audio 元素的基本信息作为后备
        metadata = {
          ...metadata,
          channels: 2, // 默认值
          duration: audioElement.duration,
          sampleRate: audioContext.sampleRate,
        };
        if (metadata.duration && metadata.duration > 0) {
          metadata.bitrate = estimateBitrate(file.size, metadata.duration);
        }
        resolve(metadata);
      }
      finally {
        cleanupFn?.();
      }
    };

    cleanupFn = () => {
      URL.revokeObjectURL(objectUrl);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('error', handleError);
    };

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('error', handleError);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
