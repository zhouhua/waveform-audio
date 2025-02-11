import type { WaveformType } from '@waveform-audio/player';
import type { TFunction } from 'i18next';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeatures } from '@/hooks/use-features';
import { cn } from '@/lib/utils';
import { SiGithub, SiReact } from '@icons-pack/react-simple-icons';
import { DropdownMenuRadioGroup } from '@radix-ui/react-dropdown-menu';
import Player from '@waveform-audio/player';
import { Asterisk, BookOpenText, Code, Copy, Sparkles, Terminal, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import demoMusic from '../../assets/music.mp3';

const types = ['bars', 'mirror', 'line', 'wave', 'envelope'];

async function copyToClipboard(text: string, t: TFunction) {
  await navigator.clipboard.writeText(text);
  toast.success(t('toast.copySuccess'));
}

export default function PlayerHome() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [type, setType] = useState<WaveformType>('mirror');
  const [src, setSrc] = useState<string>(demoMusic);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedPkg, setSelectedPkg] = useState<keyof typeof installCommands>('pnpm');
  const features = useFeatures();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSrc(url);
      setFileName(file.name);
    }
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const installCommands = {
    pnpm: 'pnpm add @waveform-audio/player',
    // eslint-disable-next-line perfectionist/sort-objects
    npm: 'npm install @waveform-audio/player',
    yarn: 'yarn add @waveform-audio/player',
  };

  const codeExample = `import Player from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
    />
  );
}`;

  return (
    <div className="min-h-screen container w-[720px] mx-auto">
      <div className="w-full px-4 py-16 mt-32">
        {/* Hero Section */}
        <div className="text-center mb-28">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('player.title')}
          </h1>
          <p className="text-xl text-gray-600 mt-12 mb-2">
            {t('player.description')}
          </p>
          <div className="text-xl text-gray-600 mb-8 flex items-center justify-center gap-2">
            <SiReact className="w-5 h-5" />
            {t('player.react')}
          </div>
        </div>

        <div className={cn(darkMode ? 'dark' : '', 'mb-32')}>
          <div className="border rounded-t-lg mx-4 h-9 flex items-center justify-between px-4 bg-background/40 shadow-md text-primary">
            <div className="text-xs text-primary/80">Demo: </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="darkMode" checked={darkMode} onCheckedChange={e => setDarkMode(!!e)} />
                <Label htmlFor="darkMode">{t('player.home.darkMode')}</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-32">
                    {t('player.home.waveform', { type })}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={type} onValueChange={value => setType(value as WaveformType)}>
                    {types.map(type => (
                      <DropdownMenuRadioItem key={type} value={type}>
                        {type}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="p-1 h-6" onClick={handleUploadClick}>
                <Upload className="w-4 h-4" />
                {t('player.home.uploadAudio')}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
              />
            </div>
          </div>
          <div className="-mt-px relative">
            <Player
              src={src}
              type={type}
              title={fileName}
              onEnded={(ctx) => {
                ctx.seek(0);
                ctx.play();
              }}
            // onTimeUpdate={(ctx) => {
            //   if (ctx.audioState.isPlaying && ctx.audioState.currentTime > 10) {
            //     ctx.seek(5);
            //     ctx.play();
            //   }
            // }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 pl-4 flex items-center gap-1">
            <Asterisk className="w-4 h-4" />
            {' '}
            {t('player.home.uploadDisclaimer')}
          </p>
        </div>

        <div className="mb-32 flex items-center justify-center gap-20">
          <Button
            className={cn(
              'border-[0.5px] duration-200 rounded-sm bg-transparent',
              // light mode
              'shadow-[4px_4px_0px_0px_rgba(0,0,0)] active:shadow-none border-zinc-800 hover:bg-zinc-50 text-zinc-800',
              // dark mode
              'dark:border-zinc-600 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)] active:dark:shadow-none dark:text-zinc-50 dark:bg-zinc-950',
              'flex items-center gap-2',
            )}
            asChild
          >
            <Link to="/player/docs/introduction">
              <BookOpenText className="w-4 h-4" />
              {' '}
              {t('player.readDocs')}
            </Link>
          </Button>

          <Button
            className={cn(
              'border-[0.5px] duration-200 rounded-sm bg-transparent',
              // light mode
              'shadow-[4px_4px_0px_0px_rgba(0,0,0)] active:shadow-none border-zinc-800 hover:bg-zinc-50 text-zinc-800',
              // dark mode
              'dark:border-zinc-600 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)] active:dark:shadow-none dark:text-zinc-50 dark:bg-zinc-950',
              'flex items-center gap-2',
            )}
            asChild
          >
            <Link to="https://github.com/zhouhua/waveform-audio" target="_blank" rel="noopener noreferrer">
              <SiGithub className="w-4 h-4" />
              {' '}
              {t('player.viewRepo')}
            </Link>
          </Button>
        </div>

        {/* Installation Section */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Terminal className="w-6 h-6" />
              {t('player.home.installation.title')}
            </h2>
            <p className="text-gray-600">{t('player.home.installation.description')}</p>
          </div>
          <div className="mx-auto">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#171717] text-white overflow-hidden shadow-lg relative">
              <Tabs value={selectedPkg} onValueChange={v => setSelectedPkg(v as keyof typeof installCommands)} className="w-full">
                <TabsList className="w-full flex h-10 items-center justify-start bg-[#171717] p-0 border-b border-[#2A2A2A]">
                  {Object.keys(installCommands).map(pkg => (
                    <TabsTrigger
                      key={pkg}
                      value={pkg}
                      className="relative h-10 rounded-none border-r border-r-[#2A2A2A] px-6 font-medium text-white/50 hover:text-white/90 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:bg-[#2A2A2A] first:rounded-tl-lg last:rounded-tr-lg last:border-none transition-colors"
                    >
                      {pkg}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div>
                  {Object.entries(installCommands).map(([pkg, command]) => (
                    <TabsContent key={pkg} value={pkg} className="m-0">
                      <div className="relative group">
                        <div className="flex items-center">
                          <SyntaxHighlighter
                            language="bash"
                            style={vscDarkPlus}
                            customStyle={{
                              background: '#171717',
                              fontSize: '0.875rem',
                              margin: 0,
                              padding: '1rem',
                            }}
                          >
                            {command.trim()}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
              <div className="absolute right-2 top-0 p-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(installCommands[selectedPkg], t)}
                  className="p-2 rounded-md transition-colors hover:bg-white/10 text-white/50 hover:text-white/90"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Code className="w-6 h-6" />
              {t('player.home.codeExample.title')}
            </h2>
            <p className="text-gray-600">{t('player.home.codeExample.description')}</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] text-white overflow-hidden">
              <div className="relative">
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    background: '#171717',
                    fontSize: '0.875rem',
                    margin: 0,
                    padding: '1rem',
                  }}
                >
                  {codeExample.trim()}
                </SyntaxHighlighter>
                <div className="absolute right-2 top-0 p-1">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(codeExample, t)}
                    className="p-2 rounded-md transition-colors hover:bg-white/10 text-white/50 hover:text-white/90"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              {t('player.home.highlights.title')}
            </h2>
            <p className="text-gray-600">{t('player.home.highlights.description')}</p>
          </div>
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {features.map(feature => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
