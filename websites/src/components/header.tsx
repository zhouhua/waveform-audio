import { SiGithub } from '@icons-pack/react-simple-icons';
import { CassetteTape } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import LanguageSwitcher from './language-switcher';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';

export default function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (pathname === '/') {
    return (
      <div className="fixed top-0 right-0 p-6">
        <LanguageSwitcher />
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur mx-auto">
      <div className="=w-[720px] mx-auto border-gray-200">
        <NavigationMenu className="flex h-16 items-center justify-between w-full max-w-[unset]">
          <div className="flex items-center">
            <Link to={pathname.startsWith('/player') ? '/player' : '/recorder'} className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <CassetteTape className="w-6 h-6" />
              Waveform
              {' '}
              {pathname.startsWith('/player') ? 'Player' : 'Recorder'}
            </Link>
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
      </div>
    </header>
  );
}
