import * as TabsPrimitive from '@radix-ui/react-tabs';
import Player, { ProgressIndicator, Primitives as WaveForm } from '@waveform-audio/player';
import { Highlight, themes } from 'prism-react-renderer';

import demoMusic from '../assets/music.mp3';

const examples = [
  {
    code: `import Player from '@waveform/player-react';

export default function BasicPlayer() {
  return (
    <Player
      src="your-audio.mp3"
      samplePoints={500}
    />
  );
}`,
    demo: (
      <Player
        src={demoMusic}
        samplePoints={500}
      />
    ),
    description: '最简单的播放器配置，只需提供音频源即可',
    title: '基础播放器',
  },
  {
    code: `import { Primitives as WaveForm } from '@waveform/player-react';

export default function BarsExample() {
  return (
    <WaveForm.Root src="your-audio.mp3">
      <WaveForm.Waveform
        height={120}
        type="bars"
        barWidth={4}
        barGap={2}
        barRadius={2}
        gradient={{
          from: '#4ade80',
          to: '#22c55e',
        }}
        progressGradient={{
          from: '#2dd4bf',
          to: '#0d9488',
        }}
      />
      <ProgressIndicator
        height={120}
        color="#2dd4bf"
        overlay
      />
      <WaveForm.Timeline height={20} color="#6b7280" />
    </WaveForm.Root>
  );
}`,
    demo: (
      <WaveForm.Root src={demoMusic}>
        <div className="space-y-4 relative">
          <WaveForm.Waveform
            height={120}
            type="bars"
            barWidth={4}
            barGap={2}
            barRadius={2}
            gradient={{
              from: '#4ade80',
              to: '#22c55e',
            }}
            progressGradient={{
              from: '#2dd4bf',
              to: '#0d9488',
            }}
          />
          <ProgressIndicator
            height={120}
            color="#2dd4bf"
            overlay
          />
          <WaveForm.Timeline height={20} color="#6b7280" />
        </div>
      </WaveForm.Root>
    ),
    description: '使用条形图样式显示波形，支持自定义颜色和大小',
    title: '条形图样式',
  },
  {
    code: `import { Primitives as WaveForm } from '@waveform/player-react';

export default function LineExample() {
  return (
    <WaveForm.Root src="your-audio.mp3">
      <WaveForm.Waveform
        height={120}
        type="line"
        gradient={{
          from: '#6b7280',
          to: '#374151',
        }}
        progressGradient={{
          from: '#f59e0b',
          to: '#b45309',
        }}
      />
      <ProgressIndicator
        height={120}
        color="#f59e0b"
        overlay
      />
      <WaveForm.Timeline height={20} color="#6b7280" />
    </WaveForm.Root>
  );
}`,
    demo: (
      <WaveForm.Root src={demoMusic}>
        <div className="space-y-4 relative">
          <WaveForm.Waveform
            height={120}
            type="line"
            gradient={{
              from: '#6b7280',
              to: '#374151',
            }}
            progressGradient={{
              from: '#f59e0b',
              to: '#b45309',
            }}
          />
          <ProgressIndicator
            height={120}
            color="#f59e0b"
            overlay
          />
          <WaveForm.Timeline height={20} color="#6b7280" />
        </div>
      </WaveForm.Root>
    ),
    description: '使用线条样式显示波形，适合展示连续的音频数据',
    title: '线条样式',
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">示例</h1>
        <div className="space-y-16">
          {examples.map((example, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {example.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{example.description}</p>

              <TabsPrimitive.Root defaultValue="preview" className="space-y-6">
                <TabsPrimitive.List className="border-b border-gray-200 dark:border-gray-700">
                  <TabsPrimitive.Trigger
                    value="preview"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    预览
                  </TabsPrimitive.Trigger>
                  <TabsPrimitive.Trigger
                    value="code"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    代码
                  </TabsPrimitive.Trigger>
                </TabsPrimitive.List>

                <TabsPrimitive.Content value="preview" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {example.demo}
                </TabsPrimitive.Content>

                <TabsPrimitive.Content value="code">
                  <Highlight
                    theme={themes.vsDark}
                    code={example.code}
                    language="tsx"
                  >
                    {({ className, getLineProps, getTokenProps, style, tokens }) => (
                      <pre className={className} style={{ ...style, margin: 0, padding: '1rem' }}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </TabsPrimitive.Content>
              </TabsPrimitive.Root>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
