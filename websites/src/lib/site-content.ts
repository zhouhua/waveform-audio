import { useTranslation } from 'react-i18next';

const content = {
  en: {
    nav: {
      ai: 'AI Docs',
      examples: 'Examples',
      home: 'Home',
      player: 'Player',
      recorder: 'Recorder',
    },
    home: {
      eyebrow: 'React audio toolkit for product teams and AI builders',
      title: 'Build waveform players and recorders that feel like product, not a demo.',
      description: 'Waveform Audio gives React teams a fast path to shippable audio UX, with stable public APIs, composable primitives, and docs that AI tools can follow without guessing internal paths.',
      primaryCta: 'Read the docs',
      secondaryCta: 'View examples',
      installLabel: 'Install',
      productsTitle: 'Two products, one design system',
      productsDescription: 'Ship a playback surface, a recording flow, or both, without splitting your stack.',
      products: [
        {
          description: 'A polished React player with waveform rendering, global coordination, and layered APIs for fast setup or deep customization.',
          href: '/player',
          label: 'Player',
        },
        {
          description: 'A minimal recorder for browser-based capture, preview, reset flows, and AI-friendly integration patterns.',
          href: '/recorder',
          label: 'Recorder',
        },
      ],
      pillars: [
        {
          title: 'Start simple',
          description: 'Use `Player` and `Recorder` when you want a complete UI in minutes.',
        },
        {
          title: 'Compose deeper',
          description: 'Drop to primitives and hooks when your product needs custom layout, workflow, or brand motion.',
        },
        {
          title: 'Guide AI clearly',
          description: 'Point agents to stable import paths, docs, and examples instead of source spelunking.',
        },
      ],
      aiTitle: 'AI-first docs, without a separate product fork',
      aiDescription: 'The same API surface is documented for humans and agents. We call out stable imports, recommended composition levels, and the paths AI should never use.',
      aiBullets: [
        'Stable import guidance for `@waveform-audio/player`.',
        'Copy-paste examples that match the published API.',
        'Explicit boundaries between high-level components, primitives, and hooks.',
      ],
      aiCta: 'Open AI docs',
    },
    player: {
      eyebrow: 'Waveform Player',
      title: 'A React audio player that scales from install-and-go to headless composition.',
      description: 'Use the default `Player` for fast shipping, or move down to `PlayerRoot` and hooks when your product needs a custom control surface.',
      docsCta: 'Player docs',
      examplesCta: 'Player examples',
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
      examplesCta: 'Examples',
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
          { href: '/examples', label: 'Browse examples' },
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
      ai: 'AI 文档',
      examples: '示例',
      home: '首页',
      player: '播放器',
      recorder: '录音器',
    },
    home: {
      eyebrow: '面向 React 团队与 AI 构建工具的音频组件库',
      title: '做真正能上线的波形播放器与录音器，而不是一个 demo。',
      description: 'Waveform Audio 提供稳定的公开 API、可组合 primitives，以及能被 AI 正确消费的文档结构，让 React 团队在不碰内部源码路径的前提下快速交付音频体验。',
      primaryCta: '阅读文档',
      secondaryCta: '查看示例',
      installLabel: '安装',
      productsTitle: '两个产品，一套设计语言',
      productsDescription: '无论你要做播放、录音，还是从录音回放到上传，都可以在同一套 API 体系里完成。',
      products: [
        {
          description: '提供成熟的 React 播放器能力，支持波形渲染、全局协调与分层 API，既能快速接入，也能深度定制。',
          href: '/player',
          label: 'Player',
        },
        {
          description: '提供面向浏览器录音场景的最小闭环，覆盖开始、停止、重置、预览和明确错误状态。',
          href: '/recorder',
          label: 'Recorder',
        },
      ],
      pillars: [
        {
          title: '先把功能跑起来',
          description: '直接使用 `Player` 和 `Recorder`，几分钟内完成可发布的基础交互。',
        },
        {
          title: '需要时再下沉',
          description: '当产品需要更强的品牌表达和流程控制时，再进入 primitives 和 hooks 层。',
        },
        {
          title: '让 AI 也看得懂',
          description: '为 agent 明确推荐导入路径、API 层级和不该使用的内部实现细节。',
        },
      ],
      aiTitle: '同一套 API，同时服务人类开发者与 AI',
      aiDescription: '我们没有把 AI 文档做成另一套系统，而是在同一份知识面上补齐稳定导入、推荐层级和禁用路径。',
      aiBullets: [
        '明确指出只应从 `@waveform-audio/player` 导入。',
        '示例代码与当前发布 API 保持一致，可直接复制。',
        '清晰划分高层组件、primitives 与 hooks 的职责边界。',
      ],
      aiCta: '打开 AI 文档',
    },
    player: {
      eyebrow: 'Waveform Player',
      title: '一个能从快速接入一路扩展到无头组合的 React 音频播放器。',
      description: '默认用 `Player` 迅速上线；当产品需要更强的控制力时，再切换到 `PlayerRoot` 与 hooks 组合自己的 UI。',
      docsCta: '播放器文档',
      examplesCta: '播放器示例',
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
      examplesCta: '示例',
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
          { href: '/examples', label: '查看示例' },
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
