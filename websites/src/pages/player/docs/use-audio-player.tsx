import { CodePreview } from '@/components/code-preview';
import { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';
import demoMusic from '../../../assets/music.mp3';

function Example() {
  const { audioState, controls } = useAudioPlayer({
    src: demoMusic,
  });
  const { pause, play, stop } = controls;
  const { isPlaying } = audioState;

  return (
    <div className="flex items-center gap-2">
      <button
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
        onClick={() => {
          if (isPlaying) {
            pause();
          }
          else {
            play();
          }
        }}
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>
      <button
        className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
        onClick={stop}
      >
        ⏹
      </button>
    </div>
  );
}

function BasicExample() {
  return <Example />;
}

function CustomControls() {
  const { audioState, controls, metadata } = useAudioPlayer({
    src: demoMusic,
  });
  const { pause, play, setPlaybackRate, setVolume, stop } = controls;
  const { currentTime, duration, isPlaying, playbackRate, volume } = audioState;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          onClick={() => {
            if (isPlaying) {
              pause();
            }
            else {
              play();
            }
          }}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button
          className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
          onClick={stop}
        >
          ⏹
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm">音量：</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">播放速率：</span>
          <select
            value={playbackRate}
            onChange={e => setPlaybackRate(Number(e.target.value))}
            className="w-20"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
      <div className="text-sm space-y-1">
        <div>
          当前时间：
          {Math.floor(currentTime)}
          秒
        </div>
        <div>
          总时长：
          {Math.floor(duration)}
          秒
        </div>
        {metadata && (
          <>
            {metadata.bitrate && (
              <div>
                比特率：
                {metadata.bitrate}
                kbps
              </div>
            )}
            {metadata.sampleRate && (
              <div>
                采样率：
                {metadata.sampleRate}
                Hz
              </div>
            )}
            {metadata.channels && (
              <div>
                声道数：
                {metadata.channels}
              </div>
            )}
            {metadata.fileSize && (
              <div>
                文件大小：
                {metadata.fileSize}
                字节
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CustomControlsExample() {
  return <CustomControls />;
}

const basicExample = `import { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';

function Example() {
  const { controls, audioState } = useAudioPlayer({
    src: 'your-audio-file.mp3',
  });
  const { play, pause, stop } = controls;
  const { isPlaying } = audioState;

  return (
    <div className="flex items-center gap-2">
      <button
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
        onClick={() => {
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        }}
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>
      <button
        className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
        onClick={stop}
      >
        ⏹
      </button>
    </div>
  );
}`;

const customControlsExample = `import { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';

function CustomControls() {
  const { controls, audioState, metadata } = useAudioPlayer({
    src: 'your-audio-file.mp3',
  });
  const { play, pause, stop, setVolume, setPlaybackRate } = controls;
  const { isPlaying, volume, playbackRate, currentTime, duration } = audioState;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          onClick={() => {
            if (isPlaying) {
              pause();
            } else {
              play();
            }
          }}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button
          className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
          onClick={stop}
        >
          ⏹
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm">音量：</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">播放速率：</span>
          <select
            value={playbackRate}
            onChange={e => setPlaybackRate(Number(e.target.value))}
            className="w-20"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
      <div className="text-sm space-y-1">
        <div>当前时间：{Math.floor(currentTime)}秒</div>
        <div>总时长：{Math.floor(duration)}秒</div>
        {metadata && (
          <>
            {metadata.bitrate && <div>比特率：{metadata.bitrate}kbps</div>}
            {metadata.sampleRate && <div>采样率：{metadata.sampleRate}Hz</div>}
            {metadata.channels && <div>声道数：{metadata.channels}</div>}
            {metadata.fileSize && <div>文件大小：{metadata.fileSize}字节</div>}
          </>
        )}
      </div>
    </div>
  );
}`;

export default function UseAudioPlayerDocs() {
  return (
    <div className="docs">
      <div>
        <h1>useAudioPlayer</h1>
        <p>
          useAudioPlayer Hook 提供了一种灵活的方式来访问和控制音频播放器的状态。
        </p>

        <h2 id="basic">基础使用</h2>
        <p>
          下面是一个简单的例子，展示了如何使用 useAudioPlayer Hook 来控制音频播放：
        </p>
        <CodePreview code={basicExample} preview={<BasicExample />} />

        <h2 id="customControls">自定义控制</h2>
        <p>
          useAudioPlayer Hook 提供了丰富的控制选项，你可以根据需要自定义音频播放器的控制界面：
        </p>
        <CodePreview code={customControlsExample} preview={<CustomControlsExample />} />

        <h2 id="api">API 参考</h2>
        <h3>返回值</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>controls</td>
              <td>object</td>
              <td>包含控制音频播放的方法</td>
            </tr>
            <tr>
              <td>audioState</td>
              <td>object</td>
              <td>包含音频播放器的当前状态</td>
            </tr>
            <tr>
              <td>metadata</td>
              <td>object</td>
              <td>包含音频文件的元数据信息</td>
            </tr>
          </tbody>
        </table>

        <h3>controls 对象</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>方法</th>
              <th>参数</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>play</td>
              <td>-</td>
              <td>开始播放</td>
            </tr>
            <tr>
              <td>pause</td>
              <td>-</td>
              <td>暂停播放</td>
            </tr>
            <tr>
              <td>stop</td>
              <td>-</td>
              <td>停止播放</td>
            </tr>
            <tr>
              <td>setVolume</td>
              <td>volume: number</td>
              <td>设置音量（0-1）</td>
            </tr>
            <tr>
              <td>setPlaybackRate</td>
              <td>rate: number</td>
              <td>设置播放速率</td>
            </tr>
          </tbody>
        </table>

        <h3>audioState 对象</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>isPlaying</td>
              <td>boolean</td>
              <td>是否正在播放</td>
            </tr>
            <tr>
              <td>volume</td>
              <td>number</td>
              <td>当前音量（0-1）</td>
            </tr>
            <tr>
              <td>playbackRate</td>
              <td>number</td>
              <td>当前播放速率</td>
            </tr>
            <tr>
              <td>currentTime</td>
              <td>number</td>
              <td>当前播放时间（秒）</td>
            </tr>
            <tr>
              <td>duration</td>
              <td>number</td>
              <td>音频总时长（秒）</td>
            </tr>
          </tbody>
        </table>

        <h3>metadata 对象</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>bitrate</td>
              <td>number</td>
              <td>比特率（kbps）</td>
            </tr>
            <tr>
              <td>sampleRate</td>
              <td>number</td>
              <td>采样率（Hz）</td>
            </tr>
            <tr>
              <td>channels</td>
              <td>number</td>
              <td>声道数</td>
            </tr>
            <tr>
              <td>fileSize</td>
              <td>number</td>
              <td>文件大小（字节）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
