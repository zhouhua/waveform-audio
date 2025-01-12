import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

function DocsLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const currentPath = pathname.split('#')[0];

  const navItems: NavItem[] = [
    {
      href: '/player/docs/introduction',
      items: [
        {
          href: '/player/docs/introduction#features',
          title: t('player.docs.pages.introduction.features.title'),
        },
        {
          href: '/player/docs/introduction#installation',
          title: t('player.docs.pages.introduction.installation.title'),
        },
        {
          href: '/player/docs/introduction#quickstart',
          title: t('player.docs.pages.introduction.quickstart.title'),
        },
        {
          href: '/player/docs/introduction#next',
          title: t('player.docs.pages.introduction.next.title'),
        },
      ],
      title: t('player.docs.pages.introduction.title'),
    },
    {
      href: '/player/docs/player',
      items: [
        {
          href: '/player/docs/player#basic',
          title: t('player.docs.pages.player.basic.title'),
        },
        {
          href: '/player/docs/player#anatomy',
          title: t('player.docs.pages.player.anatomy.title'),
        },
        {
          href: '/player/docs/player#events',
          title: t('player.docs.pages.player.events.title'),
        },
        {
          href: '/player/docs/player#mutualExclusive',
          title: t('player.docs.pages.player.mutualExclusive.title'),
        },
        {
          href: '/player/docs/player#api',
          title: t('player.docs.pages.player.api.title'),
        },
      ],
      title: t('player.docs.pages.player.title'),
    },
    {
      href: '/player/docs/primitives',
      items: [
        {
          href: '/player/docs/primitives#root',
          title: 'AudioRoot',
        },
        {
          href: '/player/docs/primitives#metadata',
          title: t('player.docs.pages.primitives.metadata.title'),
        },
        {
          href: '/player/docs/primitives#waveform',
          title: t('player.docs.pages.primitives.waveform.title'),
        },
        {
          href: '/player/docs/primitives#controls',
          title: t('player.docs.pages.primitives.controls.title'),
        },
        {
          href: '/player/docs/primitives#api',
          title: t('player.docs.pages.primitives.api.title'),
        },
      ],
      title: t('player.docs.pages.primitives.title'),
    },
    {
      href: '/player/docs/use-audio-player',
      items: [
        {
          href: '/player/docs/use-audio-player#basic',
          title: t('player.docs.pages.useAudioPlayer.basic.title'),
        },
        {
          href: '/player/docs/use-audio-player#customControls',
          title: t('player.docs.pages.useAudioPlayer.customControls.title'),
        },
        {
          href: '/player/docs/use-audio-player#api',
          title: t('player.docs.pages.useAudioPlayer.api.title'),
        },
      ],
      title: t('player.docs.pages.useAudioPlayer.title'),
    },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r p-4 space-y-4">
        {navItems.map(section => (
          <div key={section.title} className="space-y-1">
            {section.href && (
              <Link
                to={section.href}
                className={
                  currentPath === section.href
                    ? 'block text-sm font-medium text-primary'
                    : 'block text-sm font-medium text-muted-foreground hover:text-foreground'
                }
              >
                {section.title}
              </Link>
            )}
            {!section.href && <h4 className="text-sm font-medium">{section.title}</h4>}
            {section.items?.map(item => (
              <Link
                key={item.href}
                to={item.href || ''}
                className={
                  currentPath + (item.href?.includes('#')
                    ? item.href.split('#')[1]
                    : '') === item.href
                    ? 'block pl-4 text-sm text-primary'
                    : 'block pl-4 text-sm text-muted-foreground hover:text-foreground'
                }
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DocsLayout;
