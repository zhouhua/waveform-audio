import { SiGithub, SiKofi } from '@icons-pack/react-simple-icons';
import { Rss } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 shrink-0 grow-0">
      <div className="container py-8 flex justify-between items-center">
        <div className="text-gray-600 dark:text-gray-400">
          {t('footer.copyright')}
        </div>
        <div className="text-gray-600 dark:text-gray-400 flex gap-4 items-center">
          <a
            href="https://github.com/zhouhua/waveform-audio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:bg-black/10 hover:text-gray-900 rounded-md p-2 cursor-pointer transition-colors duration-200 flex items-center gap-2"
          >
            <SiGithub className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://zhouhua.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:bg-black/10 hover:text-gray-900 rounded-md p-2 cursor-pointer transition-colors duration-200 flex items-center gap-2"
          >
            <Rss className="w-4 h-4" />
            {t('footer.blog')}
          </a>
          <a
            href="https://ko-fi.com/zhouhua"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:bg-black/10 hover:text-gray-900 rounded-md p-2 cursor-pointer transition-colors duration-200 flex items-center gap-2"
          >
            <SiKofi className="w-4 h-4" />
            {t('footer.donate')}
          </a>
        </div>
      </div>
    </footer>
  );
}
