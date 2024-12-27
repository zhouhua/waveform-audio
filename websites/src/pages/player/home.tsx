import { useTranslation } from 'react-i18next';
import demoMusic from '../../assets/music.mp3';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenuRadioGroup } from '@radix-ui/react-dropdown-menu';
import Player, { WaveformType } from '@zhouhua-dev/waveform-player-react';
import { Asterisk, Upload, Terminal, Code, Sparkles, Copy, Check, Wand2, Zap, Palette, Layers, Settings2, Waves, Box, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Toaster } from '@/components/ui/sonner';

const types = ['bars', 'mirror', 'line', 'wave', 'envelope'];

type GradientKey = 'purple' | 'yellow' | 'green' | 'blue' | 'indigo' | 'pink' | 'orange';

const gradientMap: Record<GradientKey, string> = {
  purple: 'linear-gradient(135deg, rgb(233 213 255 / 33%) 0%, rgb(251 207 232 / 33%) 100%)',
  yellow: 'linear-gradient(135deg, rgb(254 240 138 / 33%) 0%, rgb(253 186 116 / 33%) 100%)',
  green: 'linear-gradient(135deg, rgb(187 247 208 / 33%) 0%, rgb(167 243 208 / 33%) 100%)',
  blue: 'linear-gradient(135deg, rgb(191 219 254 / 33%) 0%, rgb(165 243 252 / 33%) 100%)',
  indigo: 'linear-gradient(135deg, rgb(199 210 254 / 33%) 0%, rgb(233 213 255 / 33%) 100%)',
  pink: 'linear-gradient(135deg, rgb(251 207 232 / 33%) 0%, rgb(254 205 211 / 33%) 100%)',
  orange: 'linear-gradient(135deg, rgb(254 215 170 / 33%) 0%, rgb(254 202 202 / 33%) 100%)',
};

interface Feature {
  icon: LucideIcon;
  color: string;
  gradientKey: GradientKey;
  title: string;
  description: string;
  code: string;
  demo: JSX.Element;
}

const features: Feature[] = [
  {
    icon: Waves,
    color: 'from-purple-500 to-pink-500',
    gradientKey: 'purple',
    title: '多样化波形展示',
    description: '支持多种波形渲染模式：条形图、镜像、线条、波浪和包络，满足不同场景需求',
    code: `<Player
  src="audio.mp3"
  type="mirror"
/>`,
    demo: (
      <div className="wa-flex wa-gap-2 wa-justify-center">
        {types.map(type => (
          <div
            key={type}
            className={cn(
              'wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-purple-500 wa-to-pink-500 wa-cursor-pointer wa-transition-all',
              type === 'mirror' && 'wa-scale-110 wa-shadow-lg'
            )}
          />
        ))}
      </div>
    )
  },
  {
    icon: Settings2,
    color: 'from-yellow-500 to-orange-500',
    gradientKey: 'yellow',
    title: '高度可定制',
    description: '支持自定义样式、主题、布局和行为，轻松适配不同的设计需求',
    code: `<Player
  classes={{
    root: 'custom-root',
    waveform: 'custom-wave'
  }}
  styles={{
    root: { background: '#000' }
  }}
/>`,
    demo: (
      <div className="wa-flex wa-gap-2 wa-justify-center">
        <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-yellow-500 wa-to-orange-500" />
        <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-orange-500 wa-to-red-500" />
        <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-red-500 wa-to-pink-500" />
      </div>
    )
  },
  {
    icon: Palette,
    color: 'from-green-500 to-emerald-500',
    gradientKey: 'green',
    title: '主题系统',
    description: '内置亮色和暗色主题，支持自定义主题变量，轻松实现品牌定制',
    code: `/* 自定义主题变量 */
:root {
  --waveform-color: #cbd5e1;
  --waveform-progress-color: #2563eb;
}`,
    demo: (
      <div className="wa-flex wa-gap-2 wa-justify-center">
        <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-white wa-border-2 wa-border-gray-200" />
        <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gray-900" />
      </div>
    )
  },
  {
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    gradientKey: 'blue',
    title: 'Primitive API',
    description: '提供底层原子化组件，支持完全自定义播放器界面和行为',
    code: `import { Primitives } from '@zhouhua-dev/waveform-player-react';

const { PlayTrigger, Timeline, Waveform } = Primitives;

function CustomPlayer() {
  return (
    <Root src="audio.mp3">
      <PlayTrigger />
      <Timeline />
      <Waveform />
    </Root>
  );
}`,
    demo: (
      <div className="wa-flex wa-flex-wrap wa-gap-2 wa-justify-center">
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">PlayTrigger</div>
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">Timeline</div>
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">Waveform</div>
      </div>
    )
  },
  {
    icon: Box,
    color: 'from-indigo-500 to-purple-500',
    gradientKey: 'indigo',
    title: 'TypeScript 支持',
    description: '完整的 TypeScript 类型定义，享受智能提示和类型检查',
    code: `import type { PlayerProps } from '@zhouhua-dev/waveform-player-react';

type CustomPlayerProps = PlayerProps & {
  onCustomEvent: () => void;
};`,
    demo: (
      <div className="wa-flex wa-gap-2 wa-justify-center">
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.d.ts</div>
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.tsx</div>
      </div>
    )
  },
  {
    icon: Zap,
    color: 'from-pink-500 to-rose-500',
    gradientKey: 'pink',
    title: 'React Hooks',
    description: '提供多个 React Hooks，轻松获取和控制播放器状态',
    code: `import { usePlayerState, usePlayerControls } from '@zhouhua-dev/waveform-player-react';

function Controls() {
  const { isPlaying } = usePlayerState();
  const { play, pause } = usePlayerControls();
  return <button onClick={isPlaying ? pause : play} />;
}`,
    demo: (
      <div className="wa-flex wa-gap-2 wa-justify-center">
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerState</div>
        <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerControls</div>
      </div>
    )
  },
  {
    icon: Terminal,
    color: 'from-orange-500 to-red-500',
    gradientKey: 'orange',
    title: '元数据支持',
    description: '自动提取和显示音频文件元数据，包括时长、比特率、采样率等',
    code: `<Player
  src="audio.mp3"
  showMetadata
/>

// 提取的元数据
{
  title: string;
  format: string;
  bitrate: number;
  sampleRate: number;
  duration: number;
  channels: number;
}`,
    demo: (
      <div className="wa-flex wa-flex-col wa-gap-1 wa-justify-center wa-items-center">
        <div className="wa-text-xs wa-text-gray-500">44.1kHz</div>
        <div className="wa-text-xs wa-text-gray-500">320kbps</div>
      </div>
    )
  }
];

export default function HomePage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [type, setType] = useState<WaveformType>('mirror');
  const [src, setSrc] = useState<string>(demoMusic);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedPkg, setSelectedPkg] = useState<keyof typeof installCommands>('pnpm');

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
            />
          </div>
          <p className='text-xs text-gray-500 mt-2 pl-4 flex items-center gap-1'>
            <Asterisk className='w-4 h-4' /> 上传的音频仅用于展示，不会保存到服务器，也不会用于其他用途
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
            {features.map(({ icon: Icon, color, gradientKey, title, description, code, demo }, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl transition-all hover:shadow-lg hover:scale-[1.01]"
              >
                {/* 渐变背景层 */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: gradientMap[gradientKey]
                  }}
                />
                {/* 内容层 */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r shadow-sm",
                      color
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">{description}</p>
                  <div className="mb-6 overflow-hidden rounded-lg bg-[#171717] shadow-sm">
                    {/** @ts-ignore */}
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.75rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                  <div className="p-4 rounded-lg bg-white shadow-sm">
                    {demo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
