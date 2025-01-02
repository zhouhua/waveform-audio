import { useTranslation } from 'react-i18next';
import demoMusic from '../../assets/music.mp3';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenuRadioGroup } from '@radix-ui/react-dropdown-menu';
import Player, { WaveformType } from '@zhouhua-dev/waveform-player-react';
import { Asterisk, Upload, Terminal, Code, Sparkles, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Toaster } from '@/components/ui/sonner';
import { FeatureCard } from '@/components/feature-card';
import { useFeatures } from '@/hooks/use-features';

const types = ['bars', 'mirror', 'line', 'wave', 'envelope'];

export default function HomePage() {
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
    pnpm: 'pnpm add @zhouhua-dev/waveform-player-react',
    npm: 'npm install @zhouhua-dev/waveform-player-react',
    yarn: 'yarn add @zhouhua-dev/waveform-player-react',
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('代码已复制到剪贴板');
  };

  const codeExample = `import Player from '@zhouhua-dev/waveform-player-react';
import '@zhouhua-dev/waveform-player-react/index.css';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
    />
  );
}`;

  return (
    <div className="min-h-screen container">
      <Toaster />
      <div className="w-full px-4 py-16 mt-32">
        {/* Hero Section */}
        <div className="text-center mb-28">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('player.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('player.description')}
          </p>
        </div>

        <div className={cn(darkMode ? 'dark' : '', 'mb-32')}>
          <div className="border rounded-t-lg mx-4 h-9 flex items-center justify-between px-4 bg-background/40 shadow-md text-primary">
            <div className="text-xs text-primary/80">Demo: </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="darkMode" checked={darkMode} onCheckedChange={e => setDarkMode(!!e)} />
                <Label htmlFor="darkMode">黑暗模式</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-28">
                    波型: {type}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={type} onValueChange={(value) => setType(value as WaveformType)}>
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
                上传音频
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
          <p className='text-xs text-gray-500 mt-2 pl-4 flex items-center gap-1'>
            <Asterisk className='w-4 h-4' /> 上传的音频仅用于展示，不会保存到服务器，不会用于其他用途
          </p>
        </div>

        {/* Installation Section */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Terminal className="w-6 h-6" />
              安装方式
            </h2>
            <p className="text-gray-600">使用你喜欢的包管理器安装</p>
          </div>
          <div className="mx-auto">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#171717] text-white overflow-hidden shadow-lg relative">
              <Tabs value={selectedPkg} onValueChange={v => setSelectedPkg(v as keyof typeof installCommands)} className="w-full">
                <TabsList className="w-full flex h-10 items-center justify-start bg-[#171717] p-0 border-b border-[#2A2A2A]">
                  {Object.keys(installCommands).map((pkg) => (
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
                          {/** @ts-ignore */}
                          <SyntaxHighlighter
                            language="bash"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: '1rem',
                              background: '#171717',
                              fontSize: '0.875rem',
                            }}
                          >
                            {command}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
              <div className="absolute right-2 top-0 p-1">
                <button
                  onClick={() => copyToClipboard(installCommands[selectedPkg])}
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
              代码示例
            </h2>
            <p className="text-gray-600">简单几行代码即可实现功能强大的音频播放器</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] text-white overflow-hidden">
              <div className="relative">
                {/** @ts-ignore */}
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#171717',
                    fontSize: '0.875rem',
                  }}
                >
                  {codeExample}
                </SyntaxHighlighter>
                <div className="absolute right-2 top-0 p-1">
                  <button
                    onClick={() => copyToClipboard(codeExample)}
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
              功能亮点
            </h2>
            <p className="text-gray-600">强大而灵活的音频播放器解决方案</p>
          </div>
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
