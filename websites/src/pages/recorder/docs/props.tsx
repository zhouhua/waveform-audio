import { useTranslation } from 'react-i18next';
import CodeBlock from '../../../components/code-block';

const propsExample = `interface PlayerProps {
  // 音频源 URL
  src: string;
  
  // 波形采样点数量
  samplePoints?: number;
  
  // 播放器高度
  height?: number;
  
  // 波形渲染类型：'bars' | 'line' | 'mirror'
  type?: WaveformType;
  
  // 波形颜色渐变
  gradient?: {
    from: string;
    to: string;
  };
  
  // 播放进度颜色渐变
  progressGradient?: {
    from: string;
    to: string;
  };
  
  // 事件回调
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
}`;

export default function PropsAPI() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('docs.props.title')}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.props.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('docs.props.description')}
        </p>
        <CodeBlock code={propsExample} language="typescript" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('docs.props.title')}</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">{t('docs.props.basicConfig.title')}</h3>
            <ul className="space-y-4">
              <li>
                <div className="font-medium">src</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.basicConfig.src')}
                </div>
              </li>
              <li>
                <div className="font-medium">samplePoints</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.basicConfig.samplePoints')}
                </div>
              </li>
              <li>
                <div className="font-medium">height</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.basicConfig.height')}
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t('docs.props.styleConfig.title')}</h3>
            <ul className="space-y-4">
              <li>
                <div className="font-medium">type</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.styleConfig.type')}
                </div>
              </li>
              <li>
                <div className="font-medium">gradient</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.styleConfig.gradient')}
                </div>
              </li>
              <li>
                <div className="font-medium">progressGradient</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.styleConfig.progressGradient')}
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t('docs.props.callbacks.title')}</h3>
            <ul className="space-y-4">
              <li>
                <div className="font-medium">onPlay</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.callbacks.onPlay')}
                </div>
              </li>
              <li>
                <div className="font-medium">onPause</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.callbacks.onPause')}
                </div>
              </li>
              <li>
                <div className="font-medium">onEnded</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.callbacks.onEnded')}
                </div>
              </li>
              <li>
                <div className="font-medium">onTimeUpdate</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.callbacks.onTimeUpdate')}
                </div>
              </li>
              <li>
                <div className="font-medium">onError</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {t('docs.props.callbacks.onError')}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 