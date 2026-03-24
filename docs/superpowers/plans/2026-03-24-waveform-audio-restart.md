# Waveform Audio Restart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `waveform-audio` 重启为一个可持续迭代、可发布、文档和官网一致、对 AI / agent 友好的 React 音频组件项目，同时补齐 `player` 与 `recorder` 两条产品线。

**Architecture:** 先修复 monorepo 基础设施和验证链路，再统一核心库的公开 API 与产品边界，随后重写官网、文档和 AI-first 资料，最后通过构建、类型检查、测试和站点构建完成收口。整个过程保持“共享底座 + 产品分层 API + 官网知识层”三层架构，避免再次出现 demo、文档、源码三套叙事脱节。

**Tech Stack:** pnpm workspace, React, TypeScript, Vite, Vitest, Playwright, Tailwind CSS, Radix UI, react-router, i18next

---

## File Structure Map

### Existing files that are definitely in scope

- Root:
  - `package.json`
  - `pnpm-workspace.yaml`
  - `pnpm-lock.yaml`
- Shared config:
  - `packages/inf/package.json`
  - `packages/inf/tsconfig.json`
  - `packages/inf/eslint.config.js`
  - `packages/inf/tailwind.config.js`
- Core library:
  - `libs/player-react/package.json`
  - `libs/player-react/tsconfig.json`
  - `libs/player-react/vite.config.ts`
  - `libs/player-react/src/index.ts`
  - `libs/player-react/src/components/player.tsx`
  - `libs/player-react/src/components/primitives/root.tsx`
  - `libs/player-react/src/hooks/use-audio-player.ts`
  - `libs/player-react/src/hooks/*`
  - `libs/player-react/src/utils/*`
  - `libs/player-react/src/test/unit/**/*`
  - `libs/player-react/src/test/browser/**/*`
  - `libs/player-react/README.md`
  - `libs/player-react/README.zh.md`
- Website:
  - `websites/package.json`
  - `websites/vite.config.ts`
  - `websites/src/main.tsx`
  - `websites/src/app.tsx`
  - `websites/src/index.css`
  - `websites/src/components/**/*`
  - `websites/src/pages/home.tsx`
  - `websites/src/pages/player/**/*`
  - `websites/src/pages/recorder/**/*`
  - `websites/src/pages/examples.tsx`
  - `websites/src/i18n/**/*`
  - `websites/README.md`

### New files likely to be created

- Root docs:
  - `README.md`
  - `AGENTS.md` or `LLMS.md`
- AI docs:
  - `docs/ai/overview.md`
  - `docs/ai/player.md`
  - `docs/ai/recorder.md`
  - `docs/ai/examples.md`
  - `docs/migration/v1-to-v2.md`
- Website docs pages:
  - `websites/src/pages/player/docs/ai-integration.tsx`
  - `websites/src/pages/recorder/docs/introduction.tsx`
  - `websites/src/pages/recorder/docs/examples.tsx`
  - additional shared doc components under `websites/src/components/`
- Recorder core code if missing:
  - `libs/player-react/src/components/recorder.tsx`
  - `libs/player-react/src/hooks/use-audio-recorder.ts`
  - `libs/player-react/src/components/primitives/recorder-*`
  - `libs/player-react/src/test/unit/**/*recorder*`
  - `libs/player-react/src/test/browser/**/*recorder*`

## Task 1: 扶正 workspace 与验证链路

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/pnpm-workspace.yaml`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/packages/inf/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/packages/inf/tsconfig.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/tsconfig.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/package.json`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/**/*`

- [ ] **Step 1: 写下当前基础设施回归测试清单**

在计划备注或临时笔记中记录必须恢复的命令：

```bash
pnpm --filter @waveform-audio/player typecheck
pnpm --filter @waveform-audio/player test:unit
pnpm --filter websites build
```

- [ ] **Step 2: 让共享 `tsconfig` 导出真正可解析**

重点检查并修复 `packages/inf/package.json` 的 export 与 `libs/player-react/tsconfig.json` 的继承方式，必要时改成相对路径或新增更稳定的导出入口。

- [ ] **Step 3: 为每个包补齐稳定的脚本命名**

目标脚本：

```json
{
  "typecheck": "...",
  "lint": "...",
  "test": "...",
  "test:unit": "...",
  "test:browser": "..."
}
```

要求默认 `test` 不再依赖 `vitest --ui`。

- [ ] **Step 4: 运行类型检查验证共享配置修复**

Run: `pnpm --filter @waveform-audio/player typecheck`
Expected: PASS，不再报 `@waveform-audio/inf/tsconfig` 无法解析

- [ ] **Step 5: 运行单元测试，确认测试入口已可执行**

Run: `pnpm --filter @waveform-audio/player test:unit`
Expected: 单元测试开始执行，失败应来自真实逻辑问题而不是基础配置问题

- [ ] **Step 6: 提交基础设施修复**

```bash
git add package.json pnpm-workspace.yaml packages/inf libs/player-react/package.json libs/player-react/tsconfig.json websites/package.json pnpm-lock.yaml
git commit -m "build: restore workspace tooling and test scripts"
```

## Task 2: 清理核心库 API 并建立 v2 导出边界

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/index.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/components/player.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/components/primitives/root.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/hooks/use-audio-player.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.zh.md`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/**/*`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/browser/components/player.test.tsx`

- [ ] **Step 1: 先为 v2 API 约束写失败用例或断言**

至少覆盖：

```ts
// 示例方向
expect(exports).toHaveProperty('Player')
expect(exports).toHaveProperty('PlayerRoot')
expect(exports).not.toExposeInternalPath()
```

如果当前测试框架不适合验证导出，可新增简单的类型测试或 smoke test。

- [ ] **Step 2: 梳理并重命名明显不稳定或语义不清的公开 API**

优先处理：
- `isStoped` 拼写问题
- `Player` 默认导出与命名导出关系
- `RootProvider` / `PlayerRoot` 命名一致性
- hooks 与 context 顶层字段重复或语义混乱的问题

- [ ] **Step 3: 在 `src/index.ts` 建立“高层组件 / primitives / hooks / utils”稳定导出**

要求 README、官网和 AI 文档只引用这些正式导出。

- [ ] **Step 4: 最小实现通过类型检查与现有测试**

Run: `pnpm --filter @waveform-audio/player typecheck`
Expected: PASS

Run: `pnpm --filter @waveform-audio/player test:unit`
Expected: PASS 或只剩与后续 recorder 工作相关的已知失败

- [ ] **Step 5: 更新中英文库 README 为 v2 叙事**

README 必须包含：
- 项目定位
- 三级 API 模型
- 最小安装示例
- Player / Recorder 入口
- 文档与 AI 文档链接

- [ ] **Step 6: 提交 v2 API 整理**

```bash
git add libs/player-react
git commit -m "feat: define v2 public api for audio toolkit"
```

## Task 3: 补齐 Recorder 内核能力

**Files:**
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/components/recorder.tsx`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/hooks/use-audio-recorder.ts`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/hooks/use-audio-recorder.test.ts`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/browser/components/recorder.test.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/index.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`

- [ ] **Step 1: 先写 recorder 最小可用行为测试**

覆盖的最小行为：

```ts
// unit
// 1. 初始化状态
// 2. 请求开始录音
// 3. 停止录音后生成结果
// 4. 暴露 blob/url/duration 等最小输出
```

- [ ] **Step 2: 设计 recorder 最小 v2 API**

最小范围：
- `Recorder`
- `useAudioRecorder`
- 录音状态
- 结果导出
- 可选回放衔接

避免首轮引入过多高级能力。

- [ ] **Step 3: 实现最小功能直到测试通过**

Run: `pnpm --filter @waveform-audio/player test:unit`
Expected: recorder 相关单测 PASS

- [ ] **Step 4: 为 recorder 增加一个浏览器 smoke test**

Run: `pnpm --filter @waveform-audio/player test:browser`
Expected: 至少可执行；如果依赖 Playwright 浏览器，文档中要说明安装步骤

- [ ] **Step 5: 将 recorder 接入正式导出**

更新 `src/index.ts` 与 README 示例，确保不再需要官网页面直接引用源码路径。

- [ ] **Step 6: 提交 recorder 基础能力**

```bash
git add libs/player-react
git commit -m "feat: add recorder v2 foundation"
```

## Task 4: 升级依赖并移除不合适的运行时代码

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/package.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/main.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/vite.config.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/vite.config.ts`

- [ ] **Step 1: 升级前先列出必须保留和可删除的依赖**

重点检查：
- `react-scan` 是否应继续默认启用
- `@vitest/ui` 是否应该放在生产依赖中
- `rollup-plugin-visualizer` 是否应该默认 `open`
- 重复插件如 `@vitejs/plugin-react` / `@vitejs/plugin-react-swc`

- [ ] **Step 2: 先写一条依赖升级 smoke 验证命令**

Run: `pnpm install --lockfile-only`
Expected: lockfile 可更新且无 workspace 解析错误

- [ ] **Step 3: 执行依赖升级并清理明显不合适的默认行为**

重点：
- 官网默认禁用 `react-scan`
- 库构建默认不自动打开 visualizer
- `test` / `build` / `dev` 行为更适合日常与 CI

- [ ] **Step 4: 运行构建和测试回归**

Run: `pnpm --filter @waveform-audio/player build`
Expected: PASS

Run: `pnpm --filter websites build`
Expected: PASS

- [ ] **Step 5: 提交依赖升级**

```bash
git add package.json libs/player-react/package.json websites/package.json libs/player-react/vite.config.ts websites/vite.config.ts websites/src/main.tsx pnpm-lock.yaml
git commit -m "chore: upgrade dependencies and normalize runtime defaults"
```

## Task 5: 重构官网首页与产品信息架构

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/app.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/index.css`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/footer.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/i18n/locales/zh.json`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/i18n/locales/en.json`

- [ ] **Step 1: 先写首页与产品页的内容/结构验收标准**

至少覆盖：
- 首页首屏能解释项目定位
- 首页存在 Player / Recorder / Docs / AI 入口
- Player / Recorder 产品页都有最小接入和 demo
- 文案与 v2 API 保持一致

- [ ] **Step 2: 重做全站布局基础**

包括容器宽度、排版尺度、颜色变量、按钮样式、代码块样式、移动端间距策略。

- [ ] **Step 3: 重写首页**

首页需包含：
- 主标题与副标题
- 安装命令
- 双产品入口
- AI Integration 卡片或专区
- 示例与文档入口

- [ ] **Step 4: 重写 Player / Recorder 产品页**

要求每个产品页都包含：
- 产品价值说明
- 交互 demo
- 最小代码示例
- 进阶入口

- [ ] **Step 5: 运行站点构建验证**

Run: `pnpm --filter websites build`
Expected: PASS

- [ ] **Step 6: 提交官网信息架构重构**

```bash
git add websites/src websites/package.json
git commit -m "feat: redesign marketing site and product pages"
```

## Task 6: 重写文档页与 AI Integration 入口

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/introduction.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/player.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/primitives.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/hooks.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/examples.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/utils.tsx`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/ai-integration.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs/getting-started.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs/hooks.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs/props.tsx`

- [ ] **Step 1: 先为文档导航写出最终目录**

最终目录至少包括：
- Getting Started
- Core Concepts
- Player
- Recorder
- Primitives
- Hooks
- Examples
- AI Integration
- Migration

- [ ] **Step 2: 替换所有失真的旧文档内容**

特别处理：
- recorder 下错误包名 `@waveform/player-react`
- 错误 import
- 不存在的 props / hooks
- 与真实 API 不一致的示例

- [ ] **Step 3: 新增 AI Integration 页面**

必须说明：
- 推荐 AI 使用的导入方式
- 稳定 API 层级
- 不建议直接碰的内部路径
- 可复制的 prompt / code patterns

- [ ] **Step 4: 运行一次 docs smoke build**

Run: `pnpm --filter websites build`
Expected: PASS，文档页路由全部可打包

- [ ] **Step 5: 提交文档站重写**

```bash
git add websites/src/pages websites/src/components websites/src/i18n
git commit -m "docs: rebuild docs and add ai integration guide"
```

## Task 7: 新增仓库级 README、AI 文档与迁移说明

**Files:**
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/AGENTS.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/examples.md`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v1-to-v2.md`

- [ ] **Step 1: 先写 README 骨架**

README 至少包含：
- 项目简介
- 产品线说明
- 快速开始
- 文档入口
- AI 入口
- workspace 开发说明

- [ ] **Step 2: 写仓库级 AI 资料**

每个文件聚焦一件事：
- `overview.md`：项目总览
- `player.md`：player 用法
- `recorder.md`：recorder 用法
- `examples.md`：最稳的模板代码

- [ ] **Step 3: 写 breaking changes 迁移说明**

说明：
- 旧 API 与新 API 的差异
- 常见替换方式
- 弃用或删除的路径

- [ ] **Step 4: 提交文档资料**

```bash
git add README.md AGENTS.md docs/ai docs/migration
git commit -m "docs: add root readme ai docs and migration guide"
```

## Task 8: 最终验证与发布前收口

**Files:**
- Modify as needed across previously touched files

- [ ] **Step 1: 运行完整验证**

Run:

```bash
pnpm --filter @waveform-audio/player lint
pnpm --filter @waveform-audio/player typecheck
pnpm --filter @waveform-audio/player test:unit
pnpm --filter @waveform-audio/player build
pnpm --filter websites lint
pnpm --filter websites build
```

Expected: 全部 PASS；若 `test:browser` 依赖本地浏览器，则至少命令存在并在文档中说明安装前置条件

- [ ] **Step 2: 手动检查官网关键路径**

手动检查：
- 首页
- Player 页
- Recorder 页
- 文档页
- AI Integration 页
- 移动端布局

- [ ] **Step 3: 核对文档与代码一致性**

逐项确认：
- README 示例能运行
- 官网示例 import 正确
- AI 文档不引用内部路径
- Recorder 页面不再引用 `libs/player-react/src`

- [ ] **Step 4: 整理已知限制**

如果仍存在未解问题，需要写入：
- README
- AI 文档
- migration guide

- [ ] **Step 5: 提交最终收口**

```bash
git add .
git commit -m "release: restart waveform audio product foundation"
```
