import { userEvent } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { TestPlayer } from './test-player';
import { delay } from '../utils';

describe('Player 组件', () => {
  it('基础渲染测试', async () => {
    const screen = render(<TestPlayer />);
    const root = screen.baseElement.querySelector('.wa-player')!;
    expect(root).toBeTruthy();

    // Header 部分
    expect(root.querySelector('.wa-header')).toBeTruthy();
    expect(root.querySelector('.wa-title')).toBeTruthy();
    expect(root.querySelector('.wa-metadata')).toBeTruthy();

    // Controls 部分
    const controls = root.querySelector('.wa-controls')!;
    expect(controls).toBeTruthy();
    expect(controls.querySelector('.wa-play-button')).toBeTruthy();
    expect(controls.querySelector('.wa-stop-button')).toBeTruthy();
    expect(controls.querySelector('.wa-time-display')).toBeTruthy();

    // 右侧波形区域
    expect(root.querySelector('.wa-waveform')).toBeTruthy();
    expect(root.querySelector('.wa-timeline')).toBeTruthy();
    expect(root.querySelector('.wa-progress-indicator')).toBeFalsy();
  });

  it('播放控制测试', async () => {
    const user = userEvent.setup();
    const screen = render(<TestPlayer />);
    const root = screen.baseElement.querySelector('.wa-player')!;

    const playButton = root?.querySelector('.wa-play-button') as HTMLButtonElement;
    const stopButton = root?.querySelector('.wa-stop-button') as HTMLButtonElement;

    // 测试播放/暂停
    await user.click(playButton);
    await delay(20);

    // 通过测试元素检查状态
    const isPlaying = screen.baseElement.querySelector('.wa-test-is-playing')!;
    expect(isPlaying.textContent).toBe('true');

    await user.click(playButton);
    await delay(20);
    expect(isPlaying.textContent).toBe('false');

    // 测试停止
    await user.click(playButton);
    await delay(20);
    await user.click(stopButton);
    await delay(20);

    const isStopped = screen.baseElement.querySelector('.wa-test-is-stopped')!;
    const currentTime = screen.baseElement.querySelector('.wa-test-current-time')!;

    expect(isPlaying.textContent).toBe('false');
    expect(isStopped.textContent).toBe('true');
    expect(currentTime.textContent).toBe('0');

    // 测试进度条是否存在
    expect(root.querySelector('.wa-progress-indicator')).toBeFalsy();
  });

  it('互斥模式测试', async () => {
    const user = userEvent.setup();
    const screen = render(
      <div>
        <TestPlayer mutualExclusive={true} />
        <TestPlayer mutualExclusive={true} />
      </div>
    );

    const players = screen.baseElement.querySelectorAll('.wa-player');
    const playButtons = Array.from(players).map(
      player => player.querySelector('.wa-play-button') as HTMLButtonElement
    );

    const isPlayingElements = screen.baseElement.querySelectorAll('.wa-test-is-playing');

    // 播放第一个
    await user.click(playButtons[0]);
    await delay(20);
    expect(isPlayingElements[0].textContent).toBe('true');
    expect(isPlayingElements[1].textContent).toBe('false');

    // 播放第二个，第一个应该停止
    await user.click(playButtons[1]);
    await delay(20);
    expect(isPlayingElements[0].textContent).toBe('false');
    expect(isPlayingElements[1].textContent).toBe('true');
  });

  it('样式定制测试', async () => {
    const customClasses = {
      root: 'custom-root',
      header: 'custom-header',
      title: 'custom-title',
      metadata: 'custom-metadata',
      controls: 'custom-controls',
      playButton: 'custom-play-button',
      stopButton: 'custom-stop-button',
      downloadButton: 'custom-download-button',
      timeDisplay: 'custom-time-display',
      volumeControl: 'custom-volume-control',
      playbackRateControl: 'custom-playback-rate-control',
      waveform: 'custom-waveform',
      timeline: 'custom-timeline',
      progressIndicator: 'custom-progress-indicator'
    };

    const screen = render(
      <TestPlayer classes={customClasses} />
    );

    const root = screen.baseElement.querySelector('.wa-player');
    expect(root?.classList.contains('custom-root')).toBeTruthy();
    expect(root?.querySelector('.custom-header')).toBeTruthy();
    expect(root?.querySelector('.custom-title')).toBeTruthy();
    expect(root?.querySelector('.custom-metadata')).toBeTruthy();
    expect(root?.querySelector('.custom-controls')).toBeTruthy();
    expect(root?.querySelector('.custom-play-button')).toBeTruthy();
    expect(root?.querySelector('.custom-stop-button')).toBeTruthy();
    expect(root?.querySelector('.custom-download-button')).toBeTruthy();
    expect(root?.querySelector('.custom-time-display')).toBeTruthy();
    expect(root?.querySelector('.custom-volume-control')).toBeTruthy();
    expect(root?.querySelector('.custom-playback-rate-control')).toBeTruthy();
    expect(root?.querySelector('.custom-waveform')).toBeTruthy();
    expect(root?.querySelector('.custom-timeline')).toBeTruthy();
    expect(root?.querySelector('.custom-progress-indicator')).toBeFalsy(); // 初始状态下不显示
  });

  it('时间显示测试', async () => {
    const screen = render(<TestPlayer />);
    const user = userEvent.setup();
    const root = screen.baseElement.querySelector('.wa-player');

    const currentTime = root?.querySelector('.wa-time-display');
    expect(currentTime).toBeTruthy();
    expect(currentTime?.textContent).toBe('0:00');

    // 通过测试状态元素检查时间
    const timeElement = screen.baseElement.querySelector('.wa-test-current-time')!;
    expect(timeElement.textContent).toBe('0');

    // 播放一段时间后检查
    const playButton = root?.querySelector('.wa-play-button') as HTMLButtonElement;
    await user.click(playButton);
    await delay(1000);  // 等待一秒
    expect(Number(timeElement.textContent)).toBeGreaterThan(0);
  });

  it('下载按钮测试', async () => {
    const user = userEvent.setup();
    const screen = render(<TestPlayer />);
    const root = screen.baseElement.querySelector('.wa-player');

    const downloadButton = root?.querySelector('.wa-download-trigger');
    expect(downloadButton).toBeTruthy();

    await user.click(downloadButton as HTMLButtonElement);
    await delay(20);
  });

  it('进度条交互测试', async () => {
    const screen = render(<TestPlayer />);
    const root = screen.baseElement.querySelector('.wa-player');

    const timeline = root?.querySelector('.wa-timeline');
    expect(timeline).toBeTruthy();
  });

  it('音频元数据测试', async () => {
    const screen = render(<TestPlayer />);
    const root = screen.baseElement.querySelector('.wa-player');

    const metadata = root?.querySelector('.wa-metadata');
    expect(metadata).toBeTruthy();
  });

  it('标题显示测试', async () => {
    const customTitle = '测试音频';
    const screen = render(<TestPlayer customTitle={customTitle} />);
    const root = screen.baseElement.querySelector('.wa-player');

    const title = root?.querySelector('.wa-title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe(customTitle);
  });

  it('Context模式事件测试', async () => {
    const screen = render(<TestPlayer useContext={true} />);
    const root = screen.baseElement.querySelector('.wa-player');
    const playButton = root?.querySelector('.wa-play-button') as HTMLButtonElement;
    expect(playButton).toBeTruthy();

    const isPlaying = screen.baseElement.querySelector('.wa-test-is-playing')!;
    expect(isPlaying.textContent).toBe('false');

    const user = userEvent.setup();
    await user.click(playButton);
    await delay(20);
    expect(isPlaying.textContent).toBe('true');
  });

  it('Controls组件层级显示控制测试', async () => {
    // Case 1: controls为false时，所有子元素都不应该显示
    const screen1 = render(
      <TestPlayer
        showControls={false}
        showPlayButton={true}
        showStopButton={true}
        showDownloadButton={true}
        showTimeDisplay={true}
        showVolumeControl={true}
        showPlaybackRateControl={true}
      />
    );
    const root1 = screen1.baseElement.querySelector('.wa-player');
    expect(root1?.querySelector('.wa-controls')).toBeFalsy();
    expect(root1?.querySelector('.wa-play-button')).toBeFalsy();
    expect(root1?.querySelector('.wa-stop-button')).toBeFalsy();
    expect(root1?.querySelector('button[aria-label="download"]')).toBeFalsy();
    expect(root1?.querySelector('.wa-time-display')).toBeFalsy();
    expect(root1?.querySelector('.wa-volume-control')).toBeFalsy();
    expect(root1?.querySelector('.wa-playback-rate-control')).toBeFalsy();

    // Case 2: controls为true时，子元素可以独立控制
    const screen2 = render(
      <TestPlayer
        showControls={true}
        showPlayButton={true}
        showStopButton={false}
        showDownloadButton={true}
        showTimeDisplay={false}
        showVolumeControl={true}
        showPlaybackRateControl={false}
      />
    );
    const root2 = screen2.baseElement.querySelector('.wa-player');
    expect(root2?.querySelector('.wa-controls')).toBeTruthy();
    expect(root2?.querySelector('.wa-play-button')).toBeTruthy();
    expect(root2?.querySelector('.wa-stop-button')).toBeFalsy();
    expect(root2?.querySelector('button[aria-label="download"]')).toBeTruthy();
    expect(root2?.querySelector('.wa-time-display')).toBeFalsy();
    expect(root2?.querySelector('.wa-volume-control')).toBeTruthy();
    expect(root2?.querySelector('.wa-playback-rate-control')).toBeFalsy();
  });

  it('波形区域组件层级显示控制测试', async () => {
    // Case 1: waveform为false时，所有子元素都不应该显示
    const screen1 = render(
      <TestPlayer
        showWaveform={false}
        showTimeline={true}
        showProgressIndicator={true}
      />
    );
    const root1 = screen1.baseElement.querySelector('.wa-player');
    expect(root1?.querySelector('.wa-waveform')).toBeFalsy();
    expect(root1?.querySelector('.wa-timeline')).toBeFalsy();
    expect(root1?.querySelector('.wa-progress-indicator')).toBeFalsy();

    // Case 2: waveform为true时，子元素可以独立控制
    const screen2 = render(
      <TestPlayer
        showWaveform={true}
        showTimeline={false}
        showProgressIndicator={true}
      />
    );
    const root2 = screen2.baseElement.querySelector('.wa-player');
    expect(root2?.querySelector('.wa-waveform')).toBeTruthy();
    expect(root2?.querySelector('.wa-timeline')).toBeFalsy();
    expect(root2?.querySelector('.wa-progress-indicator')).toBeTruthy();

    // Case 3: 只显示timeline
    const screen3 = render(
      <TestPlayer
        showWaveform={true}
        showTimeline={true}
        showProgressIndicator={false}
      />
    );
    const root3 = screen3.baseElement.querySelector('.wa-player');
    expect(root3?.querySelector('.wa-waveform')).toBeTruthy();
    expect(root3?.querySelector('.wa-timeline')).toBeTruthy();
    expect(root3?.querySelector('.wa-progress-indicator')).toBeFalsy();
  });
}); 