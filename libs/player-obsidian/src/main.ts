import type { EditorState, Extension } from '@codemirror/state';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import type { ComponentType } from 'react';
import { StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin, WidgetType } from '@codemirror/view';
import WaveformPlayer from '@zhouhua-dev/waveform-player-react';
import { Plugin, TFile } from 'obsidian';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const PLAYER_CLASS = 'waveform-player-widget';
const AUDIO_LINK_PATTERN = '!\\[([^\\]]*)\\]\\(([^)]+\\.(?:mp3|wav|ogg|m4a|webm))\\)';

const styles = `
.${PLAYER_CLASS} {
  border-radius: 8px;
  overflow: hidden;
  display: block;
  width: 100%;
  background: var(--background-secondary);
}

.${PLAYER_CLASS}-container {
  position: relative;
  width: 100%;
  display: block;
  transition: all 0.3s ease;
  margin: 0.5em 0;
}

/* 实时预览模式的特殊处理 */
.markdown-source-view.mod-cm6.is-live-preview .cm-content .${PLAYER_CLASS}-container {
  display: block !important;
  visibility: visible !important;
  position: relative !important;
  pointer-events: auto !important;
  user-select: auto !important;
  z-index: 1;
}

/* 处理实时预览模式下的嵌套问题 */
.markdown-source-view.mod-cm6.is-live-preview .cm-line .${PLAYER_CLASS}-container {
  margin: 0.5em 0 !important;
  padding-left: 0.5em !important;
  border-left: 2px solid var(--interactive-accent);
}

/* 确保播放器在实时预览模式下可以交互 */
.markdown-source-view.mod-cm6.is-live-preview .${PLAYER_CLASS} {
  pointer-events: auto !important;
  user-select: auto !important;
  position: relative !important;
  z-index: 2;
}

/* 优化间距 */
.${PLAYER_CLASS}-container + .${PLAYER_CLASS}-container {
  margin-top: 1em !important;
}
`;

class AudioPlayerWidget extends WidgetType {
  private static counter = 0;
  private container: HTMLElement | null = null;
  private readonly id: string;
  private mounted = false;
  private playerDiv: HTMLElement | null = null;
  private root: null | ReturnType<typeof createRoot> = null;

  constructor(
    private readonly src: string,
    private readonly title: string,
    private readonly plugin: WaveformPlayerPlugin,
  ) {
    super();
    this.id = `audio-player-${AudioPlayerWidget.counter++}`;
  }

  destroy() {
    this.unmount();
    this.container = null;
    this.playerDiv = null;
  }

  eq(other: AudioPlayerWidget): boolean {
    return (
      this.id === other.id
      && this.src === other.src
      && this.title === other.title
    );
  }

  toDOM() {
    if (this.container) {
      this.unmount();
    }

    const container = document.createElement('div');
    container.className = `${PLAYER_CLASS}-container`;
    container.dataset.playerId = this.id;

    const playerDiv = document.createElement('div');
    playerDiv.className = PLAYER_CLASS;
    container.appendChild(playerDiv);

    this.container = container;
    this.playerDiv = playerDiv;

    // 使用 requestIdleCallback 延迟挂载，优化性能
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => this.mount());
    }
    else {
      setTimeout(() => this.mount(), 0);
    }

    return container;
  }

  private mount() {
    if (!this.playerDiv || !this.container || this.mounted) {
      return;
    }

    const audioFile = this.plugin.getAudioFile(this.src);
    if (!audioFile) {
      console.warn('[AudioPlayerWidget] Audio file not found:', this.src);
      return;
    }

    const audioUrl = this.plugin.app.vault.getResourcePath(audioFile);
    const decodedUrl = decodeURIComponent(audioUrl);

    try {
      this.root = createRoot(this.playerDiv);
      this.root.render(
        createElement(WaveformPlayer as ComponentType<any>, {
          className: 'wa-obsidian-player',
          key: this.id,
          samplePoints: 200,
          showControls: true,
          showDownloadButton: false,
          showHeader: true,
          showPlaybackRateControl: true,
          showPlayButton: true,
          showProgressIndicator: true,
          showStopButton: true,
          showTimeDisplay: true,
          showTimeline: true,
          showVolumeControl: true,
          showWaveform: true,
          src: decodedUrl,
          styles: {
            controls: {
              paddingBottom: 0,
              width: '156px',
            },
            root: {
              background: 'var(--background-secondary)',
              borderRadius: '8px',
              padding: '0.5em',
            },
            title: {
              fontSize: '14px',
              margin: 0,
              opacity: 0.8,
            },
            waveform: {
              height: '100px',
            },
          },
          title: this.title || audioFile.basename,
          type: 'mirror',
        }),
      );
      this.mounted = true;
    }
    catch (error) {
      console.error('[AudioPlayerWidget] Failed to mount player:', error);
    }
  }

  private unmount() {
    if (this.root) {
      try {
        this.root.unmount();
      }
      catch (error) {
        console.error('[AudioPlayerWidget] Failed to unmount player:', error);
      }
      this.root = null;
    }
    if (this.playerDiv) {
      this.playerDiv.innerHTML = '';
    }
    this.mounted = false;
  }
}

export default class WaveformPlayerPlugin extends Plugin {
  createEditorExtension(): Extension {
    // 定义用于更新音频播放器的效果
    const updateAudioPlayers = StateEffect.define<void>();

    // 创建 StateField 来管理装饰器
    const audioPlayerField = StateField.define<DecorationSet>({
      create: (state) => {
        return this.buildDecorations(state);
      },
      provide: field => EditorView.decorations.from(field),
      update: (decorations, tr) => {
        if (tr.docChanged || tr.effects.some(e => e.is(updateAudioPlayers))) {
          return this.buildDecorations(tr.state);
        }
        return decorations;
      },
    });

    // 创建视口变化处理插件
    const viewportPlugin = ViewPlugin.fromClass(class {
      private timeout: NodeJS.Timeout | null = null;

      constructor(private readonly view: EditorView) {
        // 初始化时立即构建装饰器
        this.scheduleUpdate();
      }

      destroy() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.scheduleUpdate();
        }
      }

      private scheduleUpdate() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.view.dispatch({
            effects: updateAudioPlayers.of(undefined),
          });
        }, 100);
      }
    });

    return [audioPlayerField, viewportPlugin];
  }

  getAudioFile(src: string): null | TFile {
    const decodedSrc = decodeURIComponent(src);
    let audioFile = this.app.vault.getAbstractFileByPath(decodedSrc);
    if (!audioFile || !(audioFile instanceof TFile)) {
      const attachPath = this.app.vault.config.attachmentFolderPath;
      if (!attachPath) {
        return null;
      }

      audioFile = this.app.vault.getAbstractFileByPath(`${attachPath}/${decodedSrc}`);
      if (!audioFile || !(audioFile instanceof TFile)) {
        audioFile = this.app.vault.getAbstractFileByPath(`${attachPath}/${src}`);
        if (!audioFile || !(audioFile instanceof TFile)) {
          return null;
        }
      }
    }
    return audioFile instanceof TFile ? audioFile : null;
  }

  async onload() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // 注册编辑器扩展
    this.registerEditorExtension(this.createEditorExtension());

    // 注册 Markdown 后处理器（用于阅读视图）
    this.registerMarkdownPostProcessor((element) => {
      const audioElements = element.querySelectorAll('.internal-embed');

      audioElements.forEach((div) => {
        const src = div.getAttribute('src');
        if (!src || !/\.(?:mp3|wav|ogg|m4a|webm)$/i.test(src)) {
          return;
        }

        const audioFile = this.getAudioFile(src);
        if (!audioFile) {
          return;
        }

        const audioUrl = this.app.vault.getResourcePath(audioFile);
        const decodedUrl = decodeURIComponent(audioUrl);

        const container = document.createElement('div');
        container.className = `${PLAYER_CLASS}-container`;

        const playerDiv = document.createElement('div');
        playerDiv.className = PLAYER_CLASS;
        container.appendChild(playerDiv);

        // 在原有元素后面插入播放器
        div.parentNode?.insertBefore(container, div.nextSibling);

        const root = createRoot(playerDiv);
        root.render(
          createElement(WaveformPlayer as ComponentType<any>, {
            className: 'wa-obsidian-player',
            samplePoints: 200,
            showControls: true,
            showDownloadButton: false,
            showHeader: true,
            showPlaybackRateControl: true,
            showPlayButton: true,
            showProgressIndicator: true,
            showStopButton: true,
            showTimeDisplay: true,
            showTimeline: true,
            showVolumeControl: true,
            showWaveform: true,
            src: decodedUrl,
            styles: {
              controls: {
                paddingBottom: 0,
                width: '156px',
              },
              title: {
                fontSize: '16px',
                margin: 0,
              },
              waveform: {
                height: '120px',
              },
            },
            type: 'mirror',
          }),
        );
      });
    });
  }

  onunload() {
  }

  private buildDecorations(state: EditorState): DecorationSet {
    const widgets: any[] = [];
    const doc = state.doc;

    // 遍历所有行，注意 CodeMirror 6 中行号从 1 开始
    for (let lineNo = 1; lineNo <= doc.lines; lineNo++) {
      const line = doc.line(lineNo);
      const lineText = line.text;

      // 每次创建新的正则表达式实例
      const regex = new RegExp(AUDIO_LINK_PATTERN, 'gi');

      // 使用 matchAll 替代 while 循环
      Array.from(lineText.matchAll(regex)).forEach((match) => {
        const [, title, src] = match;
        if (!src) {
          return;
        }

        const matchStart = line.from + match.index!;
        const matchEnd = matchStart + match[0].length;

        // 添加播放器装饰器，直接在链接后面插入
        widgets.push(
          Decoration.widget({
            block: true, // 添加 block 属性
            persistent: true,
            side: 1, // 在匹配文本后面插入
            widget: new AudioPlayerWidget(src, title || '', this),
          }).range(matchEnd),
        );
      });
    }

    return Decoration.set(widgets, true);
  }
}
