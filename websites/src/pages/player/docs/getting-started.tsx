import { useTranslation } from 'react-i18next';
import CodeBlock from '../../../components/code-block';

const installCode = `# 使用 npm
npm install @waveform/player-react

# 使用 yarn
yarn add @waveform/player-react

# 使用 pnpm
pnpm add @waveform/player-react`;

const usageCode = `import Player from '@waveform/player-react';

function App() {
  return (
    <Player
      src="your-audio.mp3"
      samplePoints={500}
      onPlay={() => console.log('开始播放')}
      onPause={() => console.log('暂停播放')}
      onEnded={() => console.log('播放结束')}
    />
  );
}`;

export default function GettingStarted() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('docs.gettingStarted.title')}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.gettingStarted.installation.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.gettingStarted.installation.description')}
        </p>
        <CodeBlock code={installCode} language="bash" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.gettingStarted.basicUsage.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.gettingStarted.basicUsage.description')}
        </p>
        <CodeBlock code={usageCode} language="tsx" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.gettingStarted.features.title')}</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>{t('home.features.waveform')}</li>
          <li>{t('home.features.playback')}</li>
          <li>{t('home.features.customization')}</li>
          <li>{t('home.features.responsive')}</li>
          <li>{t('home.features.typescript')}</li>
          <li>{t('home.features.events')}</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.gettingStarted.features.nextSteps')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.gettingStarted.features.learnMore')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>{t('docs.props.basicConfig.title')}</li>
          <li>{t('docs.props.styleConfig.title')}</li>
          <li>{t('docs.props.callbacks.title')}</li>
          <li>{t('docs.props.title')}</li>
        </ul>
      </section>
    </div>
  );
} 