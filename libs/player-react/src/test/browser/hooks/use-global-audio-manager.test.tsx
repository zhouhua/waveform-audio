import { userEvent } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { delay } from '../utils';
import TestGlobalAudioManager from './test-global-audio-manager';

describe('useGlobalAudioManager Hook', () => {
  it('管理多种来源的音频实例', async () => {
    const user = userEvent.setup();

    const screen = render(<TestGlobalAudioManager />);
    const instanceCount = screen.getByTestId('instances');
    const playingCount = screen.getByTestId('playing');
    const playButton = screen.getByTestId('play')!;
    const stopAllButton = screen.getByTestId('stop-all')!;

    // 增加初始延迟，确保组件完全挂载
    await delay(20);

    // 确保元素存在
    await expect.element(playButton).toBeInTheDocument();

    // 模拟用户交互 - 点击文档
    await user.click(screen.baseElement.ownerDocument.documentElement);
    // 增加延迟时间
    await delay(20);

    await expect.element(instanceCount).toHaveTextContent('4');
    await expect.element(playingCount).toHaveTextContent('0');

    // 使用 user.click 而不是直接调用 click()
    await user.click(playButton.element());
    await delay(20);

    await expect.element(instanceCount).toHaveTextContent('4');
    await expect.element(playingCount).toHaveTextContent('1');

    await user.click(stopAllButton.element());
    await delay(20);

    await expect.element(instanceCount).toHaveTextContent('4');
    await expect.element(playingCount).toHaveTextContent('0');
  });
});
