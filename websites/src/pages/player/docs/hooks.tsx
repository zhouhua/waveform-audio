import { useTranslation } from 'react-i18next';
import CodeBlock from '../../../components/code-block';

const hooksExample = `// 播放器状态 Hook
const {
  currentTime,    // 当前播放时间（秒）
  duration,       // 音频总时长（秒）
  isPlaying,      // 是否正在播放
  playbackRate,   // 播放速率
  volume,         // 音量（0-1）
} = usePlayerState();

// 播放器控制 Hook
const {
  play,           // 开始播放
  pause,          // 暂停播放
  stop,           // 停止播放
  seek,           // 跳转到指定时间
  setVolume,      // 设置音量
  setPlaybackRate // 设置播放速率
} = usePlayerControls();

// 波形数据 Hook
const {
  peaks,          // 波形数据数组
  duration,       // 音频时长
  isLoading,      // 是否正在加载
  error           // 错误信息
} = usePlayerWaveform();`;

export default function HooksAPI() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('docs.hooks.title')}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.hooks.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.hooks.description')}
        </p>
        <CodeBlock code={hooksExample} language="typescript" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.hooks.playerState.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.hooks.playerState.description')}
        </p>
        <ul className="space-y-4">
          <li>
            <div className="font-medium">currentTime</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerState.currentTime')}
            </div>
          </li>
          <li>
            <div className="font-medium">duration</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerState.duration')}
            </div>
          </li>
          <li>
            <div className="font-medium">isPlaying</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerState.isPlaying')}
            </div>
          </li>
          <li>
            <div className="font-medium">playbackRate</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerState.playbackRate')}
            </div>
          </li>
          <li>
            <div className="font-medium">volume</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerState.volume')}
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.hooks.playerControls.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.hooks.playerControls.description')}
        </p>
        <ul className="space-y-4">
          <li>
            <div className="font-medium">play()</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.play')}
            </div>
          </li>
          <li>
            <div className="font-medium">pause()</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.pause')}
            </div>
          </li>
          <li>
            <div className="font-medium">stop()</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.stop')}
            </div>
          </li>
          <li>
            <div className="font-medium">seek(time: number)</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.seek')}
            </div>
          </li>
          <li>
            <div className="font-medium">setVolume(volume: number)</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.setVolume')}
            </div>
          </li>
          <li>
            <div className="font-medium">setPlaybackRate(rate: number)</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.playerControls.setPlaybackRate')}
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.hooks.waveform.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.hooks.waveform.description')}
        </p>
        <ul className="space-y-4">
          <li>
            <div className="font-medium">peaks</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.waveform.peaks')}
            </div>
          </li>
          <li>
            <div className="font-medium">duration</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.waveform.duration')}
            </div>
          </li>
          <li>
            <div className="font-medium">isLoading</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.waveform.isLoading')}
            </div>
          </li>
          <li>
            <div className="font-medium">error</div>
            <div className="text-gray-600 dark:text-gray-300">
              {t('docs.hooks.waveform.error')}
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
} 