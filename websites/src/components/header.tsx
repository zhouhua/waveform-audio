import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from './ui/navigation-menu';
import { AudioLines, CassetteTape } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './language-switcher';
import { SiGithub } from '@icons-pack/react-simple-icons';

export default function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (pathname === '/') {
    return <div className="fixed top-0 right-0 p-6">
      <LanguageSwitcher />
    </div>;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-gray-200 backdrop-blur">
      <NavigationMenu className="flex h-16 items-center justify-between w-full max-w-[unset]">
        <div className="flex items-center">
          {pathname.startsWith('/player') ? (
            <Link to="/player" className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <AudioLines className="w-6 h-6" />
              Waveform Player
            </Link>
          ) : (
            <Link to="/recorder" className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <CassetteTape className="w-6 h-6" />
              Waveform Recorder
            </Link>
          )}
        </div>

        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <Link
              to="/docs/getting-started"
              className="text-gray-600 hover:bg-black/10 hover:text-gray-900  rounded-md p-2 cursor-pointer transition-colors duration-200"
            >
              {t('nav.docs')}
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/examples"
              className="text-gray-600 hover:bg-black/10 hover:text-gray-900  rounded-md p-2 cursor-pointer transition-colors duration-200"
            >
              {t('nav.examples')}
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a
              href="https://github.com/zhouhua/waveform-audio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:bg-black/10 hover:text-gray-900  rounded-md p-2 cursor-pointer transition-colors duration-200 block"
            >
              <SiGithub className="w-5 h-5" />
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <LanguageSwitcher />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
