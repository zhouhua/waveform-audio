# Waveform Audio 重启研发设计文档

> 状态：待评审
> 日期：2026-03-24
> 范围：`player`、`recorder`、官网、文档、AI-first 资料、工程基础设施

## 1. 背景

`waveform-audio` 已停止开发一段时间。当前仓库仍保留了有价值的核心能力：React 音频播放器、波形渲染 primitives、hooks、官网原型与部分测试，但整体已出现明显老化和断裂：

- 工程基础设施不完整，共享 `tsconfig` 导出链路失效，测试无法正常运行
- 依赖版本陈旧，工具链版本不一致
- 官网与 README 仍停留在早期 demo 阶段，无法承担产品官网与正式文档职责
- 文档结构与真实 API 存在偏差，部分页面与示例失真
- `recorder` 仍是半成品状态，但产品目标要求本轮一并补齐为可发布能力

本次重启不是一次保守维护，而是一次允许 breaking change 的产品化重建。

## 2. 产品目标

本轮重启的主目标是：

1. 让 React 开发者可以快速接入 `player` 与 `recorder`
2. 让 AI / agent 能稳定理解项目结构并正确生成接入代码
3. 让官网、文档、示例、README 与实际 API 保持一致
4. 让仓库重新具备持续迭代能力，包括测试、构建、发布与维护边界

### 目标受众优先级

1. React 业务开发者
2. AI / agent / low-code 场景
3. 需要进一步深度定制的高级用户

## 3. 非目标

本轮不追求以下内容：

- 保持旧版 API 完整兼容
- 引入与音频播放/录音无关的新产品方向
- 对所有内部实现做大规模“为重构而重构”的整理
- 同时支持过多框架生态，首要目标仍是 React

## 4. 现状观察

### 4.1 仓库结构

- `libs/player-react`：当前最成熟的核心库，包含组件、primitives、hooks、utils 与测试
- `websites`：官网与文档站原型，已有首页、产品页、示例页和文档页骨架
- `packages/inf`：共享工程配置包，但当前实际可用性不足

### 4.2 已确认问题

- `libs/player-react/tsconfig.json` 通过 `@waveform-audio/inf/tsconfig` 继承配置，但当前解析失败，导致测试链路直接中断
- `libs/player-react` 的测试脚本使用 `vitest run --ui`，不适合作为 CI / 自动验证默认入口
- 浏览器测试依赖 Playwright 浏览器二进制，但当前环境未安装
- `websites/src/pages/recorder/*` 存在明显半成品痕迹，包括错误的包名、直接引用源码路径、路径结构不一致等
- 官网首页和 README 无法清晰表达产品定位与接入方式
- 文档结构更像“按文件堆页面”，而不是“按任务与 API 层级组织”

## 5. 总体方案

采用“分层重启型”方案，分三层完成重建：

### 第一层：工程底座扶正

修复 workspace 配置、共享配置导出、构建与测试脚本、依赖版本、包边界与发布前提，确保仓库可稳定开发。

### 第二层：统一产品 API

围绕 `player` 与 `recorder` 建立清晰的 API 层级、导出边界与命名体系，允许 breaking change，以换取后续更好的可维护性与文档一致性。

### 第三层：官网与文档重做

将 `websites` 从 demo 站改造为正式官网与文档站，建立“快速接入”为主、“AI 入口强化”为辅的产品叙事。

## 6. 信息架构与仓库边界

本轮优先保持现有 monorepo 大结构不变，但会把职责做清晰：

### 6.1 共享配置层

保留 `packages/inf` 或在必要时重命名为更直观的配置包，用于承载：

- `tsconfig`
- `eslint`
- `tailwind`
- 其他跨包开发约定

此层的目标是“所有包都能可靠继承”，而不是只存在一个形式上的配置包。

### 6.2 核心产品层

`libs/player-react` 升级为真正意义上的产品内核，承载：

- `Player`
- `Recorder`
- 共享音频状态管理
- 波形分析与渲染
- primitives
- hooks
- 样式与主题基础能力

如果录音能力需要新增独立目录，也应仍受同一套 API 设计约束，而不是在官网里单独“拼一个 recorder 页面”。

### 6.3 展示与知识层

`websites` 负责：

- 官网首页
- Player 产品页
- Recorder 产品页
- 文档
- 示例
- AI Integration 页面

仓库内额外新增机器友好的文档文件，用于 AI / agent 消费。

## 7. API 设计原则

### 7.1 明确三级能力模型

对外 API 统一按三级组织：

#### Level 1：高层组件

- `Player`
- `Recorder`

目标：5 分钟内接入完成，适合大多数 React 开发者。

#### Level 2：Root + primitives

- `PlayerRoot`
- `RecorderRoot`
- 各种控制、状态显示、波形、时间轴、录音控制 primitives

目标：支持自定义 UI，适合需要组合式开发的场景，也适合 AI 按稳定原语生成代码。

#### Level 3：hooks + utils

- `useAudioPlayer`
- `useAudioRecorder`
- 其他辅助 hooks / utils

目标：支持高级业务逻辑、自定义流程和深度集成。

### 7.2 对 AI 友好

API 设计与导出必须满足以下要求：

- 导入路径稳定且文档化
- 禁止文档和示例引用内部私有源码路径
- 每一层 API 都有明确职责
- 推荐 AI 默认从高层组件开始，只有在需要定制时再下降到 primitives / hooks

### 7.3 Player 与 Recorder 的关系

`Recorder` 不单独发展成一套割裂体系，而应复用：

- 音频状态建模
- 波形数据表达
- 视觉语言
- 主题和布局基础
- 文档组织方式

这样能减少重复实现，也让官网和 AI 文档可以统一描述“同一产品家族”。

## 8. 文档体系设计

### 8.1 人类入口

官网文档按任务和层级组织，而不是按零散文件组织：

1. Getting Started
2. Core Concepts
3. Player
4. Recorder
5. Primitives
6. Hooks
7. Examples
8. AI Integration
9. Migration Guide

### 8.2 AI 入口

新增仓库内结构化资料，建议包括：

- `README.md`
- `docs/ai/overview.md`
- `docs/ai/player.md`
- `docs/ai/recorder.md`
- `docs/ai/examples.md`
- 根目录 `AGENTS.md` 或 `LLMS.md` 风格说明文件

这些内容需要明确：

- 项目用途
- 推荐接入方式
- 稳定导入路径
- 不建议直接使用的内部实现
- 常见生成模板
- 样式接入方法
- breaking changes 与迁移方式

### 8.3 文档约束

- 官网示例代码必须可复制运行
- README 与官网内容必须对齐
- AI 文档必须避免引用内部路径
- Recorder 文档不能再复用错误的 player 包名或旧接口

## 9. 官网设计方案

### 9.1 主方向

官网采用“Developer Product 为主，强化 AI 入口”的混合方向。

也就是：

- 首页主叙事先服务 React 开发者的快速接入诉求
- AI 能力不作为隐蔽补充，而是作为醒目的二级主入口出现

### 9.2 页面结构

#### 首页

首屏直接回答：

- 这是什么
- 为什么值得用
- 如何快速安装和接入

随后依次展示：

- Player / Recorder 双产品入口
- 安装命令与最小示例
- 核心能力
- AI Integration 入口
- Docs / Examples / GitHub 入口

#### Player 产品页

围绕以下路径组织：

- 快速接入
- 常见配置
- 常见定制
- primitives / hooks 进阶

#### Recorder 产品页

围绕以下路径组织：

- 请求录音权限
- 开始/停止录音
- 回放录音结果
- 导出 / 上传
- 与 Player 串联

#### Docs

使用统一的文档布局和简化导航，不保留当前 recorder 文档那种明显失配的路由和信息结构。

#### Examples

按任务场景组织，如：

- 最简单播放器
- 自定义控制条
- 上传后试听
- 录音后回放
- Player / Recorder 联动

### 9.3 视觉原则

- 简约、现代、编辑化，而不是早期 demo 卡片堆叠风格
- 代码展示权重高
- 信息层级清晰
- 动效克制，只用于进入、切换和关键反馈
- 兼顾桌面与移动端体验

## 10. 依赖与工具链策略

### 10.1 升级原则

- 将主要依赖升级到当前稳定版本
- 删除无必要、长期未使用或引入维护负担的依赖
- 统一 React、Vite、TypeScript、Vitest、ESLint 生态版本

### 10.2 测试策略

默认验证链路需要适配当前开发与 CI 场景：

- `lint`
- `typecheck`
- `unit test`
- 选择性保留 browser test / e2e

特别是：

- `vitest run --ui` 不应继续作为默认 `test` 命令
- Browser test 需要有清晰的安装要求与非阻塞执行方式
- Playwright 相关说明需要写入文档

## 11. 错误处理与风险控制

### 11.1 风险

- 允许 breaking change，意味着示例、README、官网和包导出必须同时更新
- recorder 现状较弱，容易在本轮中拖慢整体节奏
- 依赖升级可能触发样式、测试和打包配置联动问题

### 11.2 控制方式

- 先修工程底座，再动公开 API
- 先统一文档结构，再批量迁移示例
- 为 `player` 与 `recorder` 都准备最小可用回归测试
- 对 breaking changes 编写迁移说明

## 12. 实施产出

本轮完成后应至少具备以下产出：

- 可工作的 monorepo 配置
- 升级后的依赖与脚本
- 可发布的 `Player`
- 可发布的 `Recorder`
- 统一风格的官网
- 完整的人类文档与 AI 文档
- 与实际 API 对齐的示例
- 可执行的验证链路

## 13. 验收标准

当以下条件全部满足时，本轮可视为完成：

1. 仓库安装、构建、测试流程可运行
2. `player` 和 `recorder` 都有清晰、真实、可运行的最小示例
3. 官网首页、产品页、文档页和 AI 页可正常访问
4. README、官网文档、仓库 AI 文档与真实代码一致
5. 不再存在明显引用错误包名、错误路径、内部私有实现路径暴露的问题
6. breaking changes 有明确迁移说明

## 14. 后续步骤

在本设计确认后，下一步将编写实施计划，拆分为可执行的工程任务，包括：

- 基础设施修复
- 核心库整理
- recorder 能力补齐
- 文档与 AI 资料重写
- 官网页面重构
- 依赖升级与验证
