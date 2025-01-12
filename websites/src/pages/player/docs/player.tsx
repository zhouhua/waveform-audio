import { CodePreview } from '@/components/code-preview';
import Player, { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';
import { useTranslation } from 'react-i18next';
import demoMusic from '../../../assets/music.mp3';

const basicExample = `import Player from '@zhouhua-dev/waveform-player-react';
import '@zhouhua-dev/waveform-player-react/index.css';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
      type="mirror"
      showWaveform
      showControls
      showTimeDisplay
      showVolumeControl
      showPlaybackRateControl
    />
  );
}`;

const anatomyExample = `<Player
  // 基础配置
  src="your-audio-file.mp3"     // 音频源
  type="mirror"                 // 波形图类型
  title="音频标题"              // 音频标题
  mutualExclusive              // 是否启用互斥播放

  // 显示控制
  showWaveform                 // 显示波形图
  showControls                 // 显示控制栏
  showTimeDisplay             // 显示时间显示
  showVolumeControl          // 显示音量控制
  showPlaybackRateControl    // 显示播放速率控制
  showDownloadButton        // 显示下载按钮
  showStopButton           // 显示停止按钮

  // 样式定制
  classes={{
    root: 'player-root',              // 根容器
    header: 'player-header',          // 头部区域
    title: 'player-title',            // 标题
    metadata: 'player-metadata',      // 元数据
    controls: 'player-controls',      // 控制栏
    waveform: 'player-waveform',      // 波形图
    progressIndicator: 'player-progress', // 进度指示器
    timeline: 'player-timeline',      // 时间轴
    playButton: 'player-play',        // 播放按钮
    stopButton: 'player-stop',        // 停止按钮
    downloadButton: 'player-download', // 下载按钮
    timeDisplay: 'player-time',       // 时间显示
    volumeControl: 'player-volume',   // 音量控制
    playbackRateControl: 'player-rate', // 播放速率控制
  }}
  styles={{
    root: { background: '#000' },      // 根容器样式
    header: { padding: '1rem' },       // 头部区域样式
    waveform: { height: '200px' },     // 波形图样式
    controls: { gap: '1rem' },         // 控制栏样式
  }}

  // 事件处理
  onPlay={(ctx) => {}}               // 播放事件
  onPause={(ctx) => {}}              // 暂停事件
  onTimeUpdate={(ctx) => {}}         // 时间更新事件
  onEnded={(ctx) => {}}              // 播放结束事件
/>`;

const eventHandlersExample = `import Player from '@zhouhua-dev/waveform-player-react';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
      onPlay={(ctx) => {
        console.log('Playing:', ctx.audioState);
      }}
      onPause={(ctx) => {
        console.log('Paused:', ctx.audioState);
      }}
      onTimeUpdate={(ctx) => {
        console.log('Time updated:', ctx.audioState.currentTime);
      }}
      onEnded={(ctx) => {
        console.log('Playback ended');
        // 自动重新播放
        ctx.seek(0);
        ctx.play();
      }}
    />
  );
}`;

const mutualExclusiveExample = `import Player from '@zhouhua-dev/waveform-player-react';

export default function App() {
  return (
    <div>
      <Player
        src="audio1.mp3"
        mutualExclusive
        title="Audio 1"
      />
      <Player
        src="audio2.mp3"
        mutualExclusive
        title="Audio 2"
      />
    </div>
  );
}`;

function PlayerAnatomy() {
  const { audioState: _ } = useAudioPlayer({ src: demoMusic });

  return (
    <div className="relative">
      {/* Root Container */}
      <div className="border-2 border-dashed border-slate-200/50 rounded-xl p-4 bg-white/5">
        {/* Header Section */}
        <div className="relative flex justify-between items-center mb-4">
          <div className="text-blue-500 text-lg">music.mp3</div>
          <div className="text-emerald-500 flex gap-2 text-sm">
            <span>128 kbps</span>
            <span>48 kHz</span>
            <span>3.26 MB</span>
          </div>
          {/* Header Labels */}
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-sm text-blue-500">title</span>
            <div className="w-8 h-px bg-blue-200/50" />
          </div>
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-8 h-px bg-emerald-200/50" />
            <span className="text-sm text-emerald-500">metadata</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          {/* Left Column - Controls */}
          <div className="flex flex-col gap-4 w-48">
            {/* Play/Stop Buttons */}
            <div className="relative flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/90 flex items-center justify-center text-white">
                ▶
              </div>
              <div className="w-8 h-8 rounded flex items-center justify-center text-slate-400">
                ⏹
              </div>
              {/* Label */}
              <div className="absolute -left-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm text-rose-500">controls</span>
                <div className="w-8 h-px bg-rose-200/50" />
              </div>
            </div>

            {/* Volume Control */}
            <div className="relative flex items-center gap-1">
              <span className="text-slate-400">🔊</span>
              <span className="text-sm text-slate-400">100</span>
              {/* Label */}
              <div className="absolute -left-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm text-teal-500">volumeControl</span>
                <div className="w-8 h-px bg-teal-200/50" />
              </div>
            </div>

            {/* Playback Rate Control */}
            <div className="relative flex items-center gap-1">
              <span className="text-slate-400">⟳</span>
              <span className="text-sm text-slate-400">1x</span>
              {/* Label */}
              <div className="absolute -left-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm text-teal-500">playbackRateControl</span>
                <div className="w-8 h-px bg-teal-200/50" />
              </div>
            </div>
          </div>

          {/* Right Column - Timeline & Waveform */}
          <div className="flex-1">
            {/* Timeline */}
            <div className="relative h-8 mb-2">
              <div className="absolute inset-0 flex justify-between px-4 items-center text-xs text-amber-500">
                <span>0:00</span>
                <span>0:30</span>
                <span>1:00</span>
                <span>1:30</span>
                <span>2:00</span>
                <span>2:30</span>
                <span>3:00</span>
                <span>3:30</span>
              </div>
              {/* Timeline Label */}
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-8 h-px bg-amber-200/50" />
                <span className="text-sm text-amber-500">timeline</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="relative h-32">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full flex items-center gap-px">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-purple-200/20"
                      style={{
                        height: `${30 + Math.sin(i * 0.2) * 20 + Math.cos(i * 0.3) * 15}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Waveform Label */}
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-8 h-px bg-purple-200/50" />
                <span className="text-sm text-purple-500">waveform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Root Label */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="h-4 border-l-2 border-slate-200/50" />
          <span className="text-sm text-slate-500 pt-1">root</span>
        </div>
      </div>
    </div>
  );
}

export default function PlayerDocs() {
  const { t } = useTranslation();

  return (
    <div className="docs prose prose-slate dark:prose-invert">
      <h1>
        {t('player.docs.pages.player.title')}
      </h1>
      <p>
        {t('player.docs.pages.player.description')}
      </p>

      {/* 基础使用 */}
      <section>
        <h2 id="basic">
          {t('player.docs.pages.player.basic.title')}
        </h2>
        <p>
          {t('player.docs.pages.player.basic.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={basicExample}
            preview={(
              <Player
                src={demoMusic}
                type="mirror"
                showWaveform
                showControls
                showTimeDisplay
                showVolumeControl
                showPlaybackRateControl
              />
            )}
          />
        </div>
      </section>

      {/* 组件结构 */}
      <section>
        <h2 id="anatomy">组件结构</h2>
        <p>
          Player 组件由多个部分组成，每个部分都可以通过 props 进行控制和样式定制。
          下面是一个完整的组件结构示意图，展示了所有可用的 props 及其对应的功能区域。
        </p>
        <div className="relative p-32 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
          <PlayerAnatomy />
        </div>
        <div className="docs-preview mt-8">
          <CodePreview
            code={anatomyExample}
            preview={null}
          />
        </div>
      </section>

      {/* 事件处理 */}
      <section>
        <h2 id="events">
          {t('player.docs.pages.player.events.title')}
        </h2>
        <p>
          {t('player.docs.pages.player.events.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={eventHandlersExample}
            preview={(
              <Player
                src={demoMusic}
                onEnded={(ctx) => {
                  ctx.seek(0);
                  ctx.play();
                }}
              />
            )}
          />
        </div>
      </section>

      {/* 互斥播放 */}
      <section>
        <h2 id="mutualExclusive">
          {t('player.docs.pages.player.mutualExclusive.title')}
        </h2>
        <p>
          {t('player.docs.pages.player.mutualExclusive.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={mutualExclusiveExample}
            preview={(
              <div className="space-y-4">
                <Player
                  src={demoMusic}
                  mutualExclusive
                  title="Audio 1"
                />
                <Player
                  src={demoMusic}
                  mutualExclusive
                  title="Audio 2"
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* API 参考 */}
      <section>
        <h2 id="api">API 参考</h2>
        <div className="space-y-4">
          <h3>Props</h3>
          <table>
            <thead>
              <tr>
                <th>属性</th>
                <th>类型</th>
                <th>默认值</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>src</td>
                <td>string</td>
                <td>-</td>
                <td>{t('player.docs.pages.player.api.props.src')}</td>
              </tr>
              <tr>
                <td>type</td>
                <td>WaveformType</td>
                <td>'mirror'</td>
                <td>{t('player.docs.pages.player.api.props.type')}</td>
              </tr>
              <tr>
                <td>title</td>
                <td>string</td>
                <td>-</td>
                <td>音频标题</td>
              </tr>
              <tr>
                <td>mutualExclusive</td>
                <td>boolean</td>
                <td>false</td>
                <td>{t('player.docs.pages.player.api.props.mutualExclusive')}</td>
              </tr>
              <tr>
                <td>showWaveform</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示波形图</td>
              </tr>
              <tr>
                <td>showControls</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示控制栏</td>
              </tr>
              <tr>
                <td>showTimeDisplay</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示时间显示</td>
              </tr>
              <tr>
                <td>showVolumeControl</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示音量控制</td>
              </tr>
              <tr>
                <td>showPlaybackRateControl</td>
                <td>boolean</td>
                <td>true</td>
                <td>是否显示播放速率控制</td>
              </tr>
              <tr>
                <td>showDownloadButton</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否显示下载按钮</td>
              </tr>
              <tr>
                <td>showStopButton</td>
                <td>boolean</td>
                <td>false</td>
                <td>是否显示停止按钮</td>
              </tr>
              <tr>
                <td>classes</td>
                <td>PlayerClasses</td>
                <td>{ }</td>
                <td>{t('player.docs.pages.player.api.props.classes')}</td>
              </tr>
              <tr>
                <td>styles</td>
                <td>PlayerStyles</td>
                <td>{ }</td>
                <td>{t('player.docs.pages.player.api.props.styles')}</td>
              </tr>
              <tr>
                <td>onPlay</td>
                <td>{'(ctx) => void'}</td>
                <td>-</td>
                <td>{t('player.docs.pages.player.api.props.onPlay')}</td>
              </tr>
              <tr>
                <td>onPause</td>
                <td>{'(ctx) => void'}</td>
                <td>-</td>
                <td>{t('player.docs.pages.player.api.props.onPause')}</td>
              </tr>
              <tr>
                <td>onTimeUpdate</td>
                <td>{'(ctx) => void'}</td>
                <td>-</td>
                <td>{t('player.docs.pages.player.api.props.onTimeUpdate')}</td>
              </tr>
              <tr>
                <td>onEnded</td>
                <td>{'(ctx) => void'}</td>
                <td>-</td>
                <td>{t('player.docs.pages.player.api.props.onEnded')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
