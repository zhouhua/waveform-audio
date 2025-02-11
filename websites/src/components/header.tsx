import { SiGithub } from '@icons-pack/react-simple-icons';
import { AudioLines, CassetteTape } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import LanguageSwitcher from './language-switcher';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';

export default function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isPlayerPage = useMemo(() => pathname.startsWith('/player'), [pathname]);

  if (pathname === '/') {
    return (
      <div className="fixed top-0 right-0 p-6">
        <LanguageSwitcher />
      </div>
    );
  }

  const Icon = isPlayerPage ? AudioLines : CassetteTape;

  const menus = [
    {
      href: isPlayerPage ? '/player/docs/introduction' : '/recorder/docs/introduction',
      title: isPlayerPage ? 'player.nav.docs' : 'recorder.nav.docs',
    },
    {
      href: isPlayerPage ? '/player/examples' : '/recorder/examples',
      title: isPlayerPage ? 'player.nav.examples' : 'recorder.nav.examples',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur mx-auto">
      <div className="w-[720px] mx-auto border-gray-200 px-8">
        <NavigationMenu className="flex h-16 items-center justify-between w-full max-w-[unset]">
          <div className="flex items-center">
            <Link to={isPlayerPage ? '/player' : '/recorder'} className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Icon className="w-6 h-6" />
              Waveform
              {' '}
              {isPlayerPage ? 'Player' : 'Recorder'}
            </Link>
          </div>

          <NavigationMenuList className="flex items-center gap-4">
            {menus.map(menu => (
              <NavigationMenuItem key={menu.title}>
                <Link
                  to={menu.href}
                  className="text-gray-600 hover:bg-black/10 hover:text-gray-900  rounded-md p-2 cursor-pointer transition-colors duration-200"
                >
                  {t(menu.title)}
                </Link>
              </NavigationMenuItem>
            ))}
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
