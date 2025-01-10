# Obsidian Waveform Player Plugin

这是一个 Obsidian 插件，可以将音频文件渲染为波形播放器。

## 功能

- 将 Markdown 中的音频链接自动转换为波形播放器
- 支持 MP3、WAV、OGG、M4A 等音频格式
- 提供美观的波形可视化界面
- 支持播放控制和进度显示

## 使用方法

### 方法 1：音频链接

在 Markdown 中使用标准的图片语法来引用音频文件：

```markdown
![音频标题](./path/to/audio.mp3)
```

### 方法 2：代码块

使用专门的音频代码块：

```markdown
```audio
./path/to/audio.mp3
```
```

## 开发

1. 克隆仓库
2. 安装依赖：
   ```bash
   pnpm install
   ```
3. 构建插件：
   ```bash
   pnpm build
   ```

## 许可证

MIT 