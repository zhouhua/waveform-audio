# Waveform Audio React

面向 React 的音频播放与波形 UI 工具库。

[English Documentation](./README.md)

## 项目定位

`@waveform-audio/player` 是 Waveform Audio v2 产品家族的核心 React 库。

- `Player`：最快速接入的高层组件
- `Recorder`：最小可用的高层录音组件
- `PlayerRoot`：优先推荐的 primitives 根组件
- `useAudioPlayer()`：适合高级编排和自定义逻辑的 hook API
- `useAudioRecorder()`：适合录音流程编排的 hook API

`RootProvider` 仍然保留导出，但现在只是兼容性别名；后续公共叙事统一以 `PlayerRoot` 为主。

## 安装

```bash
pnpm add @waveform-audio/player
```

```tsx
import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export function Demo() {
  return <Player src="/audio/demo.mp3" />;
}
```

## v2 三级 API 模型

### Level 1：高层组件

默认 UI 直接使用 `Player` 或 `Recorder`：

```tsx
import { Player, Recorder } from '@waveform-audio/player';

<Player src="/audio/demo.mp3" />;
<Recorder />;
```

### Level 2：Root + primitives

需要自定义布局时，使用 `PlayerRoot` 和 primitives 组合：

```tsx
import { PlayerRoot, PlayTrigger, Timeline, Waveform } from '@waveform-audio/player';

<PlayerRoot src="/audio/demo.mp3">
  <PlayTrigger />
  <Timeline />
  <Waveform />
</PlayerRoot>;
```

### Level 3：Hooks

需要自己接管播放逻辑时，使用 `useAudioPlayer()`：

```tsx
import { useAudioPlayer } from '@waveform-audio/player';

function CustomPlayer() {
  const player = useAudioPlayer({ src: '/audio/demo.mp3' });

  return (
    <button type="button" onClick={player.play}>
      {player.audioState.isStopped ? '播放' : '继续'}
    </button>
  );
}
```

`useAudioPlayer()` 的公开返回值与 `AudioPlayerContextValue` 保持一致：顶层暴露控制方法，状态统一收口在 `audioState` 下。规范化后的停止状态请使用 `audioState.isStopped`；旧拼写 `audioState.isStoped` 被保留为兼容别名。

录音侧现在的公开 v2 API 同时覆盖文件级结果和流式事件：

```tsx
import { useAudioRecorder } from '@waveform-audio/player';

function CustomRecorder() {
  const recorder = useAudioRecorder();

  return (
    <div>
      <button type="button" onClick={() => void recorder.start()}>
        开始录音
      </button>
      <button type="button" onClick={recorder.stop} disabled={!recorder.isRecording}>
        停止
      </button>
      <button type="button" onClick={recorder.reset}>
        重置
      </button>
      <p>状态：{recorder.status}</p>
      <p>时长：{recorder.durationMs}ms</p>
      <p>会话：{recorder.sessionId}</p>
      <p>电平：{Math.round(recorder.level * 100)}%</p>
      {recorder.blobUrl && <audio controls src={recorder.blobUrl} />}
    </div>
  );
}
```

`useAudioRecorder()` 公开了这些能力：

- 控制方法：`start()`、`stop()`、`reset()`
- 会话状态：`status`、`isRecording`、`durationMs`、`sessionId`、`startedAt`、`mimeType`
- 波形状态：`level`、`waveformData`
- 输出结果：`blob`、`blobUrl`、`file`、`toFile()`
- 明确错误状态：浏览器不支持、权限拒绝、录音失败、停止失败

录音事件模型面向 ASR 集成：

- `onSessionStart`
- `onChunk`
- `onSessionEnd`
- `onRecordingComplete`
- `onError`

## 全局音频管理

多个播放器需要互斥或统一停止时，可以使用 `useGlobalAudioManager()`：

```tsx
import { useGlobalAudioManager } from '@waveform-audio/player';

function GlobalControls() {
  const { instances, stopAll } = useGlobalAudioManager();

  return (
    <button type="button" onClick={stopAll}>
      停止 {instances.length} 个播放器
    </button>
  );
}
```

每个实例会暴露：

- `id`
- `audioState`
- `controls.play()`
- `controls.pause()`
- `controls.stop()`

`stopOthers()` 当前的真实语义是“暂停其他正在播放的实例，让当前实例接管播放”；每个实例上的 `controls` 也是基于浏览器事件的命令包装器，不应被视为稳定引用的控制对象。

## 文档入口

- 产品文档总入口：[waveform-audio docs](https://zhouhua.github.io/waveform-audio/docs)
- Player 产品页：[waveform-audio player](https://zhouhua.github.io/waveform-audio/player)
- Recorder 产品页：[waveform-audio recorder](https://zhouhua.github.io/waveform-audio/recorder)
- AI / 重启设计资料：[`/docs/superpowers/specs`](../../docs/superpowers/specs) 与 [`/docs/superpowers/plans`](../../docs/superpowers/plans)

## 说明

- 默认导出仍然保留，但推荐优先使用 `Player` 这样的命名导入作为稳定 v2 入口。
- 只从 `@waveform-audio/player` 导入，不要依赖内部源码路径。
