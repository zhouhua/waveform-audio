# 🎵 Waveform Player React

> 为您的 React 应用带来精美的音频可视化体验
>
> [English Documentation](./README.md)

<p align="center">
  <img src="https://raw.githubusercontent.com/zhouhua/waveform-audio/main/websites/public/favicon.svg" width="180" height="180" alt="Waveform Player Logo" />
</p>

<p align="center">
  <a href="https://zhouhua.github.io/waveform-audio/player/examples">在线演示</a> •
  <a href="https://zhouhua.github.io/waveform-audio/player/docs/introduction">文档</a> •
  <a href="https://github.com/zhouhua/waveform-audio/issues">问题反馈</a>
</p>

## ✨ 特性

为您的音频播放器注入新的活力：

- 🎨 **精美波形可视化** - 实时渲染让音频跃然眼前
- 🎮 **丰富播放控制** - 直观的播放、暂停、进度控制
- 🎯 **精确音频分析** - 基于 Web Audio API 的高质量音频处理
- 🎭 **可定制主题** - 灵活调整以匹配您的应用风格和场景

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install @waveform-audio/player

# 使用 pnpm
pnpm add @waveform-audio/player
```

### 基础用法

```tsx
import { WaveformPlayer } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

function App() {
  return (
    <WaveformPlayer 
      src="https://example.com/awesome-track.mp3"
      height={200}
      width={800}
      onPlay={() => console.log('音乐开始播放！')}
    />
  );
}
```

## 📖 文档

深入了解 Waveform Player 的全部功能，请查看我们的[详细文档](https://zhouhua.github.io/waveform-audio/player/docs/introduction)。

## 🎯 示例

通过[交互式示例](https://zhouhua.github.io/waveform-audio/player/examples)体验 Waveform Player 的实际效果。

## 🤝 贡献

我们欢迎各种形式的贡献：

- 报告问题
- 提交代码
- 提议新功能
- 分享示例

## 📄 许可证

MIT © [zhouhua](https://github.com/zhouhua) 