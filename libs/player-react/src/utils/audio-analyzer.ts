import type { WaveformData } from '../types';

export async function analyzeAudio(
  audioUrl: string,
  samplePoints: number = 200,
): Promise<WaveformData> {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);
  const samplesPerPixel = Math.floor(channelData.length / samplePoints);
  const peaks: number[] = [];
  let maxAmplitude = 0;

  // 第一遍：找出最大振幅
  for (let i = 0; i < samplePoints; i++) {
    const start = i * samplesPerPixel;
    const end = start + samplesPerPixel;
    let max = 0;

    for (let j = start; j < end; j++) {
      const amplitude = Math.abs(channelData[j]);
      if (amplitude > max) {
        max = amplitude;
      }
    }

    if (max > maxAmplitude) {
      maxAmplitude = max;
    }
  }

  // 第二遍：归一化处理
  // 如果最大振幅太小，我们进行放大处理
  const amplitudeThreshold = 0.1; // 最小期望振幅阈值
  const scaleFactor = maxAmplitude < amplitudeThreshold ? amplitudeThreshold / maxAmplitude : 1;

  for (let i = 0; i < samplePoints; i++) {
    const start = i * samplesPerPixel;
    const end = start + samplesPerPixel;
    let max = 0;

    for (let j = start; j < end; j++) {
      const amplitude = Math.abs(channelData[j]);
      if (amplitude > max) {
        max = amplitude;
      }
    }

    // 应用缩放因子，但确保不超过1
    peaks.push(Math.min(1, max * scaleFactor));
  }

  return {
    duration: audioBuffer.duration,
    maxAmplitude,
    peaks,
    samplePoints,
    samplesPerPixel,
  };
}
