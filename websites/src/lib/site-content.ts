import { useTranslation } from 'react-i18next';

const content = {
  en: {
    nav: {
      docs: 'Docs',
      home: 'Home',
      player: 'Player',
      recorder: 'Recorder',
    },
    home: {
      eyebrow: 'React audio toolkit',
      title: 'Waveform Audio',
      description: 'A React-first solution for polished audio playback and waveform recording.',
      primaryCta: 'Explore Player',
      secondaryCta: 'Explore Recorder',
      installLabel: 'Install',
      productsTitle: 'Choose a starting point',
      productsDescription: 'Open the product page that matches the job you need to solve.',
      products: [
        {
          description: 'A polished React player with waveform rendering, multi-instance coordination, and layered APIs.',
          href: '/player',
          label: 'Player',
        },
        {
          description: 'A waveform recorder with file output, streaming events, and ASR-friendly hooks.',
          href: '/recorder',
          label: 'Recorder',
        },
      ],
      pillars: [
        {
          title: '美观',
          description: 'Designed to look like a finished product, not a demo shell.',
        },
        {
          title: '易用',
          description: 'Start with `Player` or `Recorder` and move deeper only when needed.',
        },
        {
          title: 'AI friendly',
          description: 'Stable public APIs and machine-readable guidance for assistants.',
        },
      ],
      aiTitle: 'Built for humans and agents',
      aiDescription: 'Docs, prompts, and machine-readable files work together so AI can follow the same public API that humans use.',
      aiBullets: [
        'Install once, then choose Player or Recorder.',
        'Short prompts point AI to the right public docs.',
        'Deep customization is available when the default UI is not enough.',
      ],
      aiCta: 'Open AI guidance',
    },
    player: {
      eyebrow: 'Waveform Player',
      title: 'A React audio player that scales from install-and-go to headless composition.',
      description: 'Use the default `Player` for fast shipping, or move down to `PlayerRoot` and hooks when your product needs a custom control surface.',
      docsCta: 'Player docs',
      examplesCta: 'AI guidance',
      installLabel: 'Quick install',
      codeTitle: 'Recommended v2 entry',
      highlights: [
        'Named export `Player` plus the legacy default export for smoother migration.',
        'Composable `PlayerRoot` primitives for custom UI without private imports.',
        'Global audio coordination for mutual-exclusion and shared controls.',
      ],
      sections: [
        {
          title: 'Level 1: Ship fast',
          description: 'Start with `Player` when you need a complete player with sensible controls, waveform display, and stable defaults.',
        },
        {
          title: 'Level 2: Compose your own',
          description: 'Reach for `PlayerRoot` and primitives to build branded playback UI without reimplementing timing or waveform logic.',
        },
        {
          title: 'Level 3: Control with hooks',
          description: 'Use `useAudioPlayer()` and related hooks for advanced flows, orchestration, and AI-generated integration code.',
        },
      ],
    },
    recorder: {
      eyebrow: 'Waveform Recorder',
      title: 'A browser recorder with a small API surface and a clean handoff to playback.',
      description: 'Capture audio in React, preview it immediately, and keep the integration legible for product engineers and AI tools.',
      docsCta: 'Recorder docs',
      examplesCta: 'ASR guidance',
      installLabel: 'Quick install',
      codeTitle: 'Minimal recording loop',
      highlights: [
        'Stable `useAudioRecorder()` hook for capture, stop, reset, and preview flows.',
        'Default `Recorder` component for teams that want a ready-made shell.',
        'Explicit error states for unsupported environments, permissions, capture, and stop failures.',
      ],
      sections: [
        {
          title: 'Respect browser reality',
          description: 'The public API exposes permission and support failures directly so product code can branch intentionally.',
        },
        {
          title: 'Keep output portable',
          description: 'Every successful session gives you a `Blob` and `blobUrl`, ready for upload, review, or handoff into `Player`.',
        },
        {
          title: 'Stay AI-readable',
          description: 'The recorder docs describe which imports, statuses, and error codes an agent should rely on when generating code.',
        },
      ],
    },
    docs: {
      index: {
        eyebrow: 'Documentation hub',
        title: 'Find the right entry point fast.',
        intro: 'Start with Player or Recorder docs, then open the AI guidance when you need agent-friendly integration details.',
      },
      player: {
        title: 'Player docs',
        intro: 'Waveform Player is organized as three layers so teams can move from speed to control without changing packages.',
        quickstartTitle: 'Quick start',
        sections: [
          {
            title: 'Layer 1: `Player`',
            description: 'Best for product teams that need a complete playback surface quickly.',
          },
          {
            title: 'Layer 2: `PlayerRoot` + primitives',
            description: 'Best for custom layouts and branded control surfaces.',
          },
          {
            title: 'Layer 3: hooks',
            description: 'Best for orchestration, headless logic, and generated integration code.',
          },
        ],
      },
      recorder: {
        title: 'Recorder docs',
        intro: 'Waveform Recorder intentionally starts small: one default component, one hook, explicit statuses, and predictable output.',
        quickstartTitle: 'Quick start',
        sections: [
          {
            title: '`Recorder` component',
            description: 'Use this when you want a ready-made recording shell with minimal UI decisions.',
          },
          {
            title: '`useAudioRecorder()` hook',
            description: 'Use this when your app owns the layout and recording workflow.',
          },
          {
            title: 'Output and error model',
            description: 'Rely on `blob`, `blobUrl`, `status`, and typed error codes for upload and retry flows.',
          },
        ],
      },
      common: {
        conceptsTitle: 'Core concepts',
        concepts: [
          'Stable imports only: always import from `@waveform-audio/player`.',
          'Prefer public APIs over internal source paths, even in demos and AI prompts.',
          'Use high-level components first, then move down to primitives and hooks only when the product actually needs it.',
        ],
        linksTitle: 'Next steps',
        links: [
          { href: '/docs/player', label: 'Open Player docs' },
          { href: '/docs/recorder', label: 'Open Recorder docs' },
          { href: '/docs/ai', label: 'Read AI integration guidance' },
        ],
      },
      ai: {
        title: 'AI integration',
        intro: 'This project is designed so an agent can generate correct usage without touching internal files.',
        sections: [
          {
            title: 'Preferred path',
            description: 'Tell AI to use `Player`, `Recorder`, `PlayerRoot`, and public hooks from `@waveform-audio/player`.',
          },
          {
            title: 'Do not use',
            description: 'Avoid repo-relative imports, `src/*` paths, generated `dist/*` internals, and unpublished primitives.',
          },
          {
            title: 'Prompting guidance',
            description: 'Ask for one of three levels: complete component, primitive composition, or hook-based integration.',
          },
        ],
        bullets: [
          'Prefer copy-paste examples from docs over inferred internals.',
          'Treat deprecated aliases as migration aids, not default patterns.',
          'When in doubt, generate the smallest working integration first, then customize.',
        ],
      },
    },
    examples: {
      title: 'Examples',
      description: 'Copyable reference patterns for quick setup, custom composition, and recording workflows.',
      playerTitle: 'Player',
      recorderTitle: 'Recorder',
    },
    footer: {
      blog: 'Blog',
      donate: 'Ko-fi',
      tagline: 'Modern audio UI for React, rebuilt for the next iteration.',
    },
    labels: {
      ai: 'AI Integration',
      highlight: 'Highlight',
      livePreview: 'Live preview',
      promptStarter: 'Prompt starter',
      waveformPreview: 'Waveform preview',
    },
  },
  zh: {
    nav: {
      docs: '文档',
      home: '首页',
      player: '播放器',
      recorder: '录音器',
    },
    home: {
      eyebrow: 'React 音频工具库',
      title: 'Waveform Audio',
      description: '面向 React 的播放与录制解决方案，兼顾美观、易用、可定制和 AI 友好。',
      primaryCta: '打开 Player',
      secondaryCta: '打开 Recorder',
      installLabel: '安装',
      productsTitle: '从这里开始',
      productsDescription: '先进入产品页，再看示例、API 和 AI 指引。',
      products: [
        {
          description: '用于构建波形播放器、列表播放和多实例协调。',
          href: '/player',
          label: 'Player',
        },
        {
          description: '用于构建波形录音、文件输出和流式 ASR 接入。',
          href: '/recorder',
          label: 'Recorder',
        },
      ],
      pillars: [
        {
          title: '美观',
          description: '更像一套成品体验，而不是组件拼盘。',
        },
        {
          title: '易用',
          description: '从默认组件开始，接入路径短而清楚。',
        },
        {
          title: 'AI 友好',
          description: '可供工具读取的说明和 prompt 让自动化更稳定。',
        },
      ],
      aiTitle: '人和 AI 都能直接开始',
      aiDescription: '短 prompt、机器可读文件和公开文档一起工作，避免误用内部路径。',
      aiBullets: [
        '只从 `@waveform-audio/player` 导入。',
        '先用默认组件，再进入更深的 API 层。',
        '录音场景支持文件级和流式两种接法。',
      ],
      aiCta: '查看 AI 指引',
    },
    player: {
      eyebrow: 'Waveform Player',
      title: '一个能从快速接入一路扩展到无头组合的 React 音频播放器。',
      description: '默认用 `Player` 迅速上线；当产品需要更强的控制力时，再切换到 `PlayerRoot` 与 hooks 组合自己的 UI。',
      docsCta: '播放器文档',
      examplesCta: 'AI 指南',
      installLabel: '快速安装',
      codeTitle: '推荐的 v2 入口',
      highlights: [
        '推荐使用命名导出 `Player`，同时保留默认导出作为迁移缓冲。',
        '通过 `PlayerRoot` 与 primitives 构建定制化界面，无需依赖私有路径。',
        '支持全局音频协调，便于做互斥播放与统一控制。',
      ],
      sections: [
        {
          title: '第 1 层：先上线',
          description: '当你只想快速得到一个完整播放器时，直接使用 `Player`。',
        },
        {
          title: '第 2 层：按产品组合',
          description: '当你需要定制控制栏、布局和品牌表达时，使用 `PlayerRoot` 与 primitives。',
        },
        {
          title: '第 3 层：用 hooks 接管',
          description: '当你要做复杂业务流程、全局编排或 AI 生成集成代码时，进入 hooks 层。',
        },
      ],
    },
    recorder: {
      eyebrow: 'Waveform Recorder',
      title: '一个 API 面积克制、可自然衔接回放流程的浏览器录音器。',
      description: '在 React 中完成音频采集、即时预览与结果导出，同时保持实现足够清晰，便于工程师与 AI 正确集成。',
      docsCta: '录音器文档',
      examplesCta: 'ASR 指南',
      installLabel: '快速安装',
      codeTitle: '最小录音闭环',
      highlights: [
        '稳定的 `useAudioRecorder()` hook，覆盖开始、停止、重置与预览流程。',
        '提供默认 `Recorder` 组件，适合直接接入的团队。',
        '对浏览器不支持、权限拒绝、录音失败、停止失败都暴露明确错误状态。',
      ],
      sections: [
        {
          title: '尊重浏览器现实',
          description: '公开 API 直接暴露权限与环境限制，让业务代码能明确分支而不是猜测失败原因。',
        },
        {
          title: '让结果容易接续',
          description: '每次成功录音都会拿到 `Blob` 与 `blobUrl`，方便上传、审核或交给 `Player` 回放。',
        },
        {
          title: '让 AI 不会走偏',
          description: '文档明确写出推荐导入、状态字段与错误码，减少 agent 乱用内部实现的概率。',
        },
      ],
    },
    docs: {
      index: {
        eyebrow: '文档中心',
        title: '快速找到正确的入口。',
        intro: '先从播放器或录音器文档开始，需要 AI 友好接入说明时再打开 AI 指南。',
      },
      player: {
        title: '播放器文档',
        intro: 'Waveform Player 采用三层 API 组织方式，让团队可以从“尽快接入”平滑过渡到“深度定制”。',
        quickstartTitle: '快速开始',
        sections: [
          {
            title: '第 1 层：`Player`',
            description: '适合希望以最少配置完成完整播放体验的业务开发者。',
          },
          {
            title: '第 2 层：`PlayerRoot` + primitives',
            description: '适合需要自定义布局、控制栏和视觉风格的产品场景。',
          },
          {
            title: '第 3 层：hooks',
            description: '适合复杂状态编排、无头集成以及 AI 生成代码的高级用法。',
          },
        ],
      },
      recorder: {
        title: '录音器文档',
        intro: 'Waveform Recorder 这次刻意保持最小可发布面：一个默认组件、一个 hook、明确状态和可复用结果。',
        quickstartTitle: '快速开始',
        sections: [
          {
            title: '`Recorder` 组件',
            description: '当你希望尽快拿到一个可用录音壳子时，直接使用它。',
          },
          {
            title: '`useAudioRecorder()` hook',
            description: '当你的产品自己掌控布局和流程时，使用 hook 接管录音逻辑。',
          },
          {
            title: '结果与错误模型',
            description: '围绕 `blob`、`blobUrl`、`status` 与错误码来组织上传、重试与回放流程。',
          },
        ],
      },
      common: {
        conceptsTitle: '核心原则',
        concepts: [
          '只使用稳定导入：统一从 `@waveform-audio/player` 引入。',
          '即使在 demo 或 AI prompt 中，也不要依赖仓库内部源码路径。',
          '优先使用高层组件，只有在产品确实需要时再下沉到 primitives 与 hooks。',
        ],
        linksTitle: '下一步',
        links: [
          { href: '/docs/player', label: '打开播放器文档' },
          { href: '/docs/recorder', label: '打开录音器文档' },
          { href: '/docs/ai', label: '阅读 AI 集成说明' },
        ],
      },
      ai: {
        title: 'AI 集成说明',
        intro: '这个项目正在按“让 agent 也能正确使用”的目标整理，所以 AI 不需要碰内部文件就能生成正确接入代码。',
        sections: [
          {
            title: '推荐路径',
            description: '让 AI 只使用 `@waveform-audio/player` 下的 `Player`、`Recorder`、`PlayerRoot` 和公开 hooks。',
          },
          {
            title: '不要使用',
            description: '避免仓库相对路径、`src/*`、未发布内部文件以及仅用于兼容的历史接口。',
          },
          {
            title: 'Prompt 建议',
            description: '在提示词里明确你要的是哪一层：完整组件、primitive 组合，还是 hook 驱动集成。',
          },
        ],
        bullets: [
          '优先复制文档示例，而不是让 AI 自行推断内部结构。',
          '废弃别名只作为迁移手段，不应成为默认推荐模式。',
          '先生成最小可运行版本，再要求 AI 逐步定制样式与行为。',
        ],
      },
    },
    examples: {
      title: '示例',
      description: '用于快速接入、组合式定制和录音流程的可复制参考实现。',
      playerTitle: '播放器',
      recorderTitle: '录音器',
    },
    footer: {
      blog: '博客',
      donate: 'Ko-fi',
      tagline: '为下一轮迭代重建的现代 React 音频组件库。',
    },
    labels: {
      ai: 'AI 集成',
      highlight: '亮点',
      livePreview: '实时预览',
      promptStarter: '提示词模板',
      waveformPreview: '波形预览',
    },
  },
} as const;

export function useSiteContent() {
  const { i18n } = useTranslation();
  return i18n.language.startsWith('zh') ? content.zh : content.en;
}
