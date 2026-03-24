import { SiGithub, SiKofi } from '@icons-pack/react-simple-icons';
import { Rss } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content';

export default function Footer() {
  const site = useSiteContent();

  return (
    <footer className="border-t border-black/5 bg-[#f3efe7]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-stone-600 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="font-medium uppercase tracking-[0.18em] text-stone-900">Waveform Audio</p>
          <p>{site.footer.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/zhouhua/waveform-audio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 transition-colors hover:border-black/20 hover:text-stone-900"
          >
            <SiGithub className="size-4" />
            GitHub
          </a>
          <a
            href="https://zhouhua.site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 transition-colors hover:border-black/20 hover:text-stone-900"
          >
            <Rss className="size-4" />
            {site.footer.blog}
          </a>
          <a
            href="https://ko-fi.com/zhouhua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 transition-colors hover:border-black/20 hover:text-stone-900"
          >
            <SiKofi className="size-4" />
            {site.footer.donate}
          </a>
        </div>
      </div>
    </footer>
  );
}
