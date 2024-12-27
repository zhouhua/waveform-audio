import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

export default function DocsPage() {
  const { t } = useTranslation();

  const sidebarItems = [
    {
      title: t('docs.gettingStarted.title'),
      items: [
        { path: '/docs/getting-started', title: t('docs.gettingStarted.title') },
        { path: '/docs/installation', title: t('docs.gettingStarted.installation.title') },
      ],
    },
    {
      title: t('docs.props.basicConfig.title'),
      items: [
        { path: '/docs/basic-player', title: t('docs.props.basicConfig.title') },
        { path: '/docs/custom-controls', title: t('docs.props.styleConfig.title') },
        { path: '/docs/waveform-renderers', title: t('docs.props.callbacks.title') },
      ],
    },
    {
      title: 'API 参考',
      items: [
        { path: '/docs/props', title: t('docs.props.title') },
        { path: '/docs/hooks', title: t('docs.hooks.title') },
        { path: '/docs/types', title: t('docs.props.basicConfig.title') },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-6 flex-shrink-0">
        <nav>
          {sidebarItems.map(section => (
            <div key={section.title} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white block py-1"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
