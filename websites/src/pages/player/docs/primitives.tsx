import { CodePreview } from '@/components/code-preview';
import { DownloadTrigger as AudioDownloadButton, Metadata as AudioMetadata, PlaybackRateControl as AudioPlaybackRateControl, PlayTrigger as AudioPlayButton, RootProvider as AudioRoot, StopTrigger as AudioStopButton, Timeline as AudioTimeline, VolumeControl as AudioVolumeControl, Waveform as AudioWaveform } from '@waveform-audio/player';
import demoMusic from '../../../assets/music.mp3';

const rootExample = `import { RootProvider } from '@waveform-audio/player';

function AudioPlayer() {
  return (
    <RootProvider src="your-audio-file.mp3">
      {/* 其他组件 */}
    </RootProvider>
  );
}`;

const metadataExample = `import { RootProvider, Metadata } from '@waveform-audio/player';

function AudioPlayer() {
  return (
    <RootProvider src="your-audio-file.mp3">
      <Metadata />
    </RootProvider>
  );
}`;

const waveformExample = `import { RootProvider, Waveform } from '@waveform-audio/player';

function AudioPlayer() {
  return (
    <RootProvider src="your-audio-file.mp3">
      <Waveform
        type="mirror"
        gradient={{
          from: '#007fd1',
          to: '#c600ff',
        }}
        progressGradient={{
          from: '#00ff95',
          to: '#00ff95',
        }}
      />
    </RootProvider>
  );
}`;

const controlsExample = `import { RootProvider, PlayTrigger, StopTrigger, VolumeControl, PlaybackRateControl } from '@waveform-audio/player';

function AudioPlayer() {
  return (
    <RootProvider src="your-audio-file.mp3">
      <div className="flex items-center gap-2">
        <PlayTrigger />
        <StopTrigger />
        <VolumeControl />
        <PlaybackRateControl />
      </div>
    </RootProvider>
  );
}`;

function RootExample() {
  return (
    <AudioRoot src={demoMusic}>
      <div className="flex items-center gap-2">
        <AudioPlayButton />
        <AudioStopButton />
      </div>
    </AudioRoot>
  );
}

function MetadataExample() {
  return (
    <AudioRoot src={demoMusic}>
      <AudioMetadata />
    </AudioRoot>
  );
}

function WaveformExample() {
  return (
    <AudioRoot src={demoMusic}>
      <AudioWaveform
        type="mirror"
        gradient={{
          from: '#007fd1',
          to: '#c600ff',
        }}
        progressGradient={{
          from: '#00ff95',
          to: '#00ff95',
        }}
      />
    </AudioRoot>
  );
}

function ControlsExample() {
  return (
    <AudioRoot src={demoMusic}>
      <div className="flex items-center gap-2">
        <AudioPlayButton />
        <AudioStopButton />
        <AudioVolumeControl />
        <AudioPlaybackRateControl />
      </div>
    </AudioRoot>
  );
}

export default function PrimitivesDocs() {
  return (
    <div className="docs">
      <div>
        <h1>原子组件</h1>
        <p>
          原子组件是构建音频播放器的基础组件。它们提供了更大的灵活性，让你可以根据需要自由组合和定制播放器的外观和功能。
        </p>

        <h2 id="root">AudioRoot</h2>
        <p>
          AudioRoot 是所有原子组件的根容器。它负责管理音频状态和上下文，其他组件必须在它内部使用。
        </p>
        <CodePreview code={rootExample} preview={<RootExample />} />

        <h2 id="metadata">元数据组件</h2>
        <p>
          Metadata 组件用于显示音频文件的元数据信息，包括比特率、采样率、声道数等。
        </p>
        <CodePreview code={metadataExample} preview={<MetadataExample />} />

        <h2 id="waveform">波形图组件</h2>
        <p>
          Waveform 组件用于显示音频的波形图。它支持多种渲染类型和自定义样式。
        </p>
        <CodePreview code={waveformExample} preview={<WaveformExample />} />

        <h2 id="controls">控制组件</h2>
        <p>
          控制组件包括播放、停止、音量和播放速率控制等。你可以根据需要组合使用这些组件。
        </p>
        <CodePreview code={controlsExample} preview={<ControlsExample />} />

        <h2 id="api">API 参考</h2>
        <h3>AudioRoot</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>src</td>
              <td>string</td>
              <td>-</td>
              <td>音频文件的 URL</td>
            </tr>
            <tr>
              <td>samplePoints</td>
              <td>number</td>
              <td>200</td>
              <td>波形图采样点数</td>
            </tr>
            <tr>
              <td>mutualExclusive</td>
              <td>boolean</td>
              <td>false</td>
              <td>是否启用互斥播放</td>
            </tr>
          </tbody>
        </table>

        <h3>AudioMetadata</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>-</td>
              <td>自定义类名</td>
            </tr>
          </tbody>
        </table>

        <h3>AudioWaveform</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>type</td>
              <td>'mirror' | 'bars' | 'line' | 'wave' | 'envelope'</td>
              <td>'mirror'</td>
              <td>波形图类型</td>
            </tr>
            <tr>
              <td>gradient</td>
              <td>{'{ from: string; to: string }'}</td>
              <td>-</td>
              <td>波形图渐变色</td>
            </tr>
            <tr>
              <td>progressGradient</td>
              <td>{'{ from: string; to: string }'}</td>
              <td>-</td>
              <td>进度条渐变色</td>
            </tr>
            <tr>
              <td>height</td>
              <td>number</td>
              <td>100</td>
              <td>波形图高度</td>
            </tr>
          </tbody>
        </table>

        <h3>AudioTimeline</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>-</td>
              <td>自定义类名</td>
            </tr>
            <tr>
              <td>interval</td>
              <td>number</td>
              <td>30</td>
              <td>时间刻度间隔（秒）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
