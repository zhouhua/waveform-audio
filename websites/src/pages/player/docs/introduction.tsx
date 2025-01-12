import { CodePreview } from '@/components/code-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Player, { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';
import { Copy, Terminal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import demoMusic from '../../../assets/music.mp3';

function HookExample({ src }: { src: string }) {
  const { audioState, controls } = useAudioPlayer({
    src,
  });

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => {
          if (audioState.isPlaying) {
            controls.pause();
          }
          else {
            controls.play();
          }
        }}
      >
        {audioState.isPlaying ? '暂停' : '播放'}
      </Button>
      <div className="text-sm text-foreground/80">
        当前时间：
        {audioState.currentTime.toFixed(1)}
        s
      </div>
    </div>
  );
}

const installCommands = {
  npm: 'npm install @zhouhua-dev/waveform-player-react',
  pnpm: 'pnpm add @zhouhua-dev/waveform-player-react',
  yarn: 'yarn add @zhouhua-dev/waveform-player-react',
};

const basicExample = `import Player from '@zhouhua-dev/waveform-player-react';
import '@zhouhua-dev/waveform-player-react/index.css';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
      type="mirror"
      showWaveform
      showControls
      showTimeDisplay
      showVolumeControl
      showPlaybackRateControl
    />
  );
}`;

const customExample = `import Player from '@zhouhua-dev/waveform-player-react';
import '@zhouhua-dev/waveform-player-react/index.css';

export default function App() {
  return (
    <Player
      src="your-audio-file.mp3"
      type="mirror"
      classes={{
        root: 'custom-root-class',
        waveform: 'custom-waveform-class',
        controls: 'custom-controls-class',
      }}
      styles={{
        root: { background: '#000' },
        waveform: { height: '200px' },
      }}
    />
  );
}`;

const hookExample = `import { useAudioPlayer } from '@zhouhua-dev/waveform-player-react';

export default function App() {
  const { controls, audioState } = useAudioPlayer({
    src: 'your-audio-file.mp3',
  });

  return (
    <div>
      <button onClick={controls.play}>
        {audioState.isPlaying ? '暂停' : '播放'}
      </button>
      <div>当前时间：{audioState.currentTime}s</div>
    </div>
  );
}`;

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success('代码已复制到剪贴板');
}

export default function Introduction() {
  const { t } = useTranslation();
  const [selectedPkg, setSelectedPkg] = useState<keyof typeof installCommands>('pnpm');

  return (
    <div className="docs prose prose-slate dark:prose-invert">
      <h1>
        {t('player.docs.pages.introduction.title')}
      </h1>
      <p>
        {t('player.docs.pages.introduction.description')}
      </p>

      {/* 功能特点 */}
      <section>
        <h2 id="features">
          {t('player.docs.pages.introduction.features.title')}
        </h2>
        <div className="docs-grid">
          {[
            { icon: '🎨', key: 'waveform' },
            { icon: '🧩', key: 'primitives' },
            { icon: '🎣', key: 'hooks' },
            { icon: '🎯', key: 'customization' },
            { icon: '🔒', key: 'typescript' },
            { icon: '🌐', key: 'global' },
          ].map(({ icon, key }) => (
            <div key={key} className="docs-card">
              <h3 className="mb-2 font-medium text-foreground flex items-center gap-2">
                {icon}
                {t(`player.docs.pages.introduction.features.${key}`)}
              </h3>
              <p className="text-sm text-foreground/80">
                {t(`player.docs.pages.introduction.features.${key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 安装 */}
      <section>
        <h2 id="installation" className="flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          {t('player.docs.pages.introduction.installation.title')}
        </h2>
        <p>
          {t('player.docs.pages.introduction.installation.description')}
        </p>
        <div className="rounded-xl border bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-lg overflow-hidden">
          <Tabs value={selectedPkg} onValueChange={v => setSelectedPkg(v as keyof typeof installCommands)} className="w-full">
            <TabsList className="w-full flex h-10 items-center justify-start bg-zinc-900/50 p-0 border-b border-zinc-800">
              {Object.keys(installCommands).map(pkg => (
                <TabsTrigger
                  key={pkg}
                  value={pkg}
                  className="relative h-10 rounded-none border-r border-r-zinc-800 px-6 font-medium text-zinc-400 hover:text-zinc-200 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:bg-zinc-800 first:rounded-tl-lg last:rounded-tr-lg last:border-none transition-colors"
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
                          background: 'transparent',
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(installCommands[selectedPkg])}
              className="p-2 rounded-md transition-colors hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section>
        <h2 id="quickstart">
          {t('player.docs.pages.introduction.quickstart.title')}
        </h2>
        <p>
          {t('player.docs.pages.introduction.quickstart.description')}
        </p>

        {/* 基础使用 */}
        <h3>
          {t('player.docs.pages.introduction.quickstart.basic.title')}
        </h3>
        <p>
          {t('player.docs.pages.introduction.quickstart.basic.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={basicExample}
            preview={(
              <Player
                src={demoMusic}
                type="mirror"
                showWaveform
                showControls
                showTimeDisplay
                showVolumeControl
                showPlaybackRateControl
              />
            )}
          />
        </div>

        {/* 自定义样式 */}
        <h3>
          {t('player.docs.pages.introduction.quickstart.custom.title')}
        </h3>
        <p>
          {t('player.docs.pages.introduction.quickstart.custom.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={customExample}
            preview={(
              <Player
                src={demoMusic}
                type="mirror"
                classes={{
                  controls: 'gap-4',
                  root: 'bg-black/90',
                  waveform: 'h-[200px]',
                }}
                styles={{
                  header: { padding: '1rem' },
                }}
              />
            )}
          />
        </div>

        {/* 使用 Hooks */}
        <h3>
          {t('player.docs.pages.introduction.quickstart.hook.title')}
        </h3>
        <p>
          {t('player.docs.pages.introduction.quickstart.hook.description')}
        </p>
        <div className="docs-preview">
          <CodePreview
            code={hookExample}
            preview={<HookExample src={demoMusic} />}
          />
        </div>
      </section>

      {/* 下一步 */}
      <section>
        <h2 id="next">
          {t('player.docs.pages.introduction.next.title')}
        </h2>
        <p>
          {t('player.docs.pages.introduction.next.description')}
        </p>
        <div className="docs-grid md:grid-cols-3">
          <Link
            to="/player/docs/player"
            className="docs-card"
          >
            <h3 className="mb-2 font-medium text-foreground flex items-center gap-2">
              {t('player.docs.pages.introduction.next.player_title')}
            </h3>
            <p className="text-sm text-foreground/80">
              {t('player.docs.pages.introduction.next.player_desc')}
            </p>
          </Link>
          <Link
            to="/player/docs/primitives"
            className="docs-card"
          >
            <h3 className="mb-2 font-medium text-foreground flex items-center gap-2">
              {t('player.docs.pages.introduction.next.primitives_title')}
            </h3>
            <p className="text-sm text-foreground/80">
              {t('player.docs.pages.introduction.next.primitives_desc')}
            </p>
          </Link>
          <Link
            to="/player/docs/hooks"
            className="docs-card"
          >
            <h3 className="mb-2 font-medium text-foreground flex items-center gap-2">
              {t('player.docs.pages.introduction.next.hooks_title')}
            </h3>
            <p className="text-sm text-foreground/80">
              {t('player.docs.pages.introduction.next.hooks_desc')}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
