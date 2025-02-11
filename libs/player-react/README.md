# 🎵 Waveform Player React

> Beautiful audio visualization for your React applications
>
> [中文文档](./README.zh.md)

<p align="center">
  <img src="https://raw.githubusercontent.com/zhouhua/waveform-audio/main/websites/public/favicon.svg" width="180" height="180" alt="Waveform Player Logo" />
</p>

<p align="center">
  <a href="https://zhouhua.github.io/waveform-audio/player/examples">Live Demo</a> •
  <a href="https://zhouhua.github.io/waveform-audio/player/docs/introduction">Documentation</a> •
  <a href="https://github.com/zhouhua/waveform-audio/issues">Issues</a>
</p>

## ✨ Features

Transform your audio player into an immersive experience with:

- 🎨 **Beautiful Waveform Visualization** - See your audio come to life with real-time waveform rendering
- 🎮 **Rich Playback Controls** - Play, pause, seek, and more with an intuitive interface
- 🎯 **Precise Audio Analysis** - High-quality audio processing with Web Audio API
- 🎭 **Themeable Design** - Customize every aspect to match your application style and scenario

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @waveform-audio/player

# Using pnpm
pnpm add @waveform-audio/player
```

### Basic Usage

```tsx
import { WaveformPlayer } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

function App() {
  return (
    <WaveformPlayer 
      src="https://example.com/awesome-track.mp3"
      height={200}
      width={800}
      onPlay={() => console.log('Music starts playing!')}
    />
  );
}
```

## 📖 Documentation

Dive deeper into Waveform Player's capabilities in our [comprehensive documentation](https://zhouhua.github.io/waveform-audio/player/docs/introduction).

## 🎯 Examples

See Waveform Player in action with our [interactive examples](https://zhouhua.github.io/waveform-audio/player/examples).

## 🤝 Contributing

We love your input! Whether it's:

- Reporting a bug
- Submitting a fix
- Proposing new features
- Sharing examples


## 📄 License

MIT © [zhouhua](https://github.com/zhouhua)
