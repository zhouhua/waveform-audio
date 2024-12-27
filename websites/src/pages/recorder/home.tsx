import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Player from '../../../../libs/player-react/src';
import demoMusic from '../assets/music.mp3';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('home.description')}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/docs/getting-started"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {t('home.getStarted')}
            </Link>
            <Link
              to="/examples"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              {t('home.viewExamples')}
            </Link>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mb-16">
          <Player
            src={demoMusic}
            onPlay={() => console.log('播放')}
            onPause={() => console.log('暂停')}
            samplePoints={500}
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title={t('home.features.waveform')}
            description={t('home.features.playback')}
          />
          <FeatureCard
            title={t('home.features.customization')}
            description={t('home.features.responsive')}
          />
          <FeatureCard
            title={t('home.features.typescript')}
            description={t('home.features.events')}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
