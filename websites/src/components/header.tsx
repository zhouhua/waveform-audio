import { SiGithub } from '@icons-pack/react-simple-icons';
import { AudioLines, BookOpen, CassetteTape, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useSiteContent } from '@/lib/site-content';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './language-switcher';

const navItems = [
  { href: '/', key: 'home', match: (pathname: string) => pathname === '/' },
  { href: '/player', key: 'player', match: (pathname: string) => pathname.startsWith('/player') },
  { href: '/recorder', key: 'recorder', match: (pathname: string) => pathname.startsWith('/recorder') },
  {
    href: '/docs',
    key: 'docs',
    match: (pathname: string) => (
      pathname.startsWith('/docs')
      || pathname.startsWith('/player/docs')
      || pathname.startsWith('/recorder/docs')
    ),
  },
] as const;

export default function Header() {
  const { pathname } = useLocation();
  const site = useSiteContent();
  const isHome = pathname === '/';
  const isDocs = pathname.startsWith('/docs') || pathname.startsWith('/player/docs') || pathname.startsWith('/recorder/docs');
  const [mobileOpen, setMobileOpen] = useState(false);

  const docsHref = pathname.startsWith('/recorder')
    ? '/docs/recorder'
    : pathname.startsWith('/player')
      ? '/docs/player'
      : '/docs';

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(249,247,242,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm font-medium tracking-[0.16em] text-stone-900 uppercase">
          <div className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
            <Sparkles className="size-4" />
          </div>
          <span className="hidden sm:inline">Waveform Audio</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map(item => {
            const isActive = item.match(pathname);
            const Icon = item.key === 'player'
              ? AudioLines
              : item.key === 'recorder'
                ? CassetteTape
                : item.key === 'docs'
                  ? BookOpen
                  : undefined;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-stone-900 text-stone-50'
                    : 'text-stone-600 hover:bg-black/5 hover:text-stone-900',
                )}
                >
                  {Icon && <Icon className="size-4" />}
                  {site.nav[item.key]}
                </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!isHome && (
            <Link
              to={docsHref}
              className="hidden rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950 sm:inline-flex"
            >
              {isDocs ? site.nav.docs : pathname.startsWith('/recorder') ? site.recorder.docsCta : site.player.docsCta}
            </Link>
          )}
          <a
            href="https://github.com/zhouhua/waveform-audio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
            aria-label="GitHub"
          >
            <SiGithub className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(current => !current)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-black/5 bg-[rgba(249,247,242,0.96)] px-4 py-4 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-800"
              >
                {site.nav[item.key]}
              </Link>
            ))}
            {!isHome && (
              <Link
                to={docsHref}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-800"
              >
                {isDocs ? site.nav.docs : pathname.startsWith('/recorder') ? site.recorder.docsCta : site.player.docsCta}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
