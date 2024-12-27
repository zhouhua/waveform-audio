export interface AudioMetadata {
  title?: string;
  format?: string;
  bitrate?: number;
  sampleRate?: number;
  duration?: number;
  channels?: number;
  fileSize?: number;
}

export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  const audioElement = new Audio(URL.createObjectURL(file));
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // 从文件名解析基本信息
  const fileName = file.name.replace(/\.[^./]+$/, '');
  return new Promise((resolve) => {
    audioElement.onloadedmetadata = async () => {
      let sampleRate = audioContext.sampleRate;
      let channels = 2; // 默认值

      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sampleRate = audioBuffer.sampleRate;
        channels = audioBuffer.numberOfChannels;
      }
      catch (error) {
        console.warn('Cannot get audio metadata:', error);
      }

      resolve({
        bitrate: estimateBitrate(file.size, audioElement.duration),
        channels,
        duration: audioElement.duration,
        fileSize: file.size,
        format: file.type,
        sampleRate,
        title: fileName,
      });
    };

    audioElement.onerror = () => {
      resolve({
        fileSize: file.size,
        format: file.type,
        title: fileName,
      });
    };
  });
}

// 估算比特率（kbps）
function estimateBitrate(fileSize: number, duration: number): number {
  if (!duration) {
    return 0;
  }
  // 比特率 = 文件大小（比特） / 持续时间（秒）
  return Math.round((fileSize * 8) / (duration * 1000));
}

export function downloadAudio(src: string, fileName: string = 'audio.mp3') {
  const link = document.createElement('a');
  link.href = src;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
