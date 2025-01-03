import type { ComponentPropsWithoutRef, CSSProperties, HTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { Children, cloneElement, useContext } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { RootContext } from './root';

// 自定义 hook 用于获取 context
function usePlayerContext(propsContext?: AudioPlayerContextValue) {
  const rootContext = useContext(RootContext);
  return propsContext || rootContext;
}

type TriggerProps = {
  asChild?: boolean;
  children?: ((props: { isPlaying: boolean }) => React.ReactNode) | React.ReactNode;
  context?: AudioPlayerContextValue;
} & ComponentPropsWithoutRef<'button'>;

export interface VolumeControlProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  step?: number;
  context?: AudioPlayerContextValue;
}

const playIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const pauseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const stopIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

// 播放按钮触发器
export function PlayTrigger({
  asChild,
  children,
  className,
  context: propsContext,
  style,
  ...props
}: TriggerProps) {
  const context = usePlayerContext(propsContext);

  const handleClick = () => {
    if (context?.audioState.isPlaying) {
      context.pause();
    }
    else {
      context?.play();
    }
  };

  const isPlaying = context?.audioState.isPlaying;

  if (asChild && children) {
    const child = Children.only(children) as ReactElement<HTMLAttributes<HTMLElement>>;
    return cloneElement(child, {
      ...props,
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children || (
        <div
          className={cn(
            'wa-flex wa-items-center wa-justify-center wa-transition-colors',
            'wa-w-8 wa-h-8 wa-rounded-full',
            !isPlaying ? 'wa-bg-blue-500 hover:wa-bg-blue-600' : 'wa-bg-yellow-500 hover:wa-bg-yellow-600',
            className,
          )}
          style={style}
        >
          {isPlaying ? pauseIcon : playIcon}
        </div>
      )}
    </button>
  );
}

// 停止按钮触发器
export const StopTrigger = function StopTrigger({
  asChild = false,
  children,
  className,
  context: propsContext,
  style,
  ...props
}: TriggerProps) {
  const context = usePlayerContext(propsContext);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    context?.stop();
  };

  if (asChild && children) {
    const child = Children.only(children) as ReactElement<HTMLAttributes<HTMLElement>>;
    return cloneElement(child, {
      ...props,
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children || (
        <div
          className={cn(
            'wa-flex wa-items-center wa-justify-center wa-transition-colors',
            'wa-w-8 wa-h-8 wa-rounded-full',
            'wa-bg-gray-500 hover:wa-bg-gray-700',
            'hover:wa-text-red-600 wa-text-gray-100',
            className,
          )}
          style={style}
        >
          {stopIcon}
        </div>
      )}
    </button>
  );
};

// 时间显示
export function CurrentTimeDisplay({
  className,
  context: propsContext,
  format = formatTime,
  style,
}: {
  className?: string;
  style?: CSSProperties;
  format?: (seconds: number) => string;
  context?: AudioPlayerContextValue;
}) {
  const context = usePlayerContext(propsContext);
  return <div className={className} style={style}>{format(context?.audioState?.currentTime ?? 0)}</div>;
}

export function DurationDisplay({
  className,
  context: propsContext,
  format = formatTime,
  style,
}: {
  className?: string;
  style?: CSSProperties;
  format?: (seconds: number) => string;
  context?: AudioPlayerContextValue;
}) {
  const context = usePlayerContext(propsContext);
  return <div className={className} style={style}>{format(context?.audioState?.duration ?? 0)}</div>;
}

// 控制组件容器
export function Controls({
  children,
  className,
  context: propsContext,
  style,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  context?: AudioPlayerContextValue;
}) {
  const context = usePlayerContext(propsContext);
  return (
    <div className={`wa-flex wa-items-center wa-space-x-4 ${className}`} style={style}>
      {children || (
        <>
          <PlayTrigger context={context} />
          <StopTrigger context={context} />
        </>
      )}
    </div>
  );
}

// 辅助函数：格式化时间
function formatTime(seconds: number): string {
  if (Number.isNaN(seconds)) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 音量控制
export function VolumeControl({
  className,
  context: propsContext,
  max = 1,
  min = 0,
  step = 0.01,
  style,
}: {
  className?: string;
  style?: CSSProperties;
  min?: number;
  max?: number;
  step?: number;
  context?: AudioPlayerContextValue;
}) {
  const context = usePlayerContext(propsContext);
  const volume = ((context?.audioState?.volume ?? 1) * 100).toFixed(0);

  const volumeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="wa-w-4 wa-h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );

  const muteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="wa-w-4 wa-h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn('wa-flex wa-items-center !wa-p-1 wa-text-[var(--wa-text-secondary-color)]', className)}
          style={style}
        >
          <span className="wa-w-4 wa-h-4">{context?.audioState?.volume === 0 ? muteIcon : volumeIcon}</span>
          <span className="wa-text-xs wa-font-mon w-[22px]">{volume}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="wa-bg-white !wa-w-32 !wa-p-4">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[context?.audioState?.volume ?? 1]}
          className="wa-w-full wa-h-2"
          onValueChange={e => context?.setVolume(Number(e[0]))}
        />
      </PopoverContent>
    </Popover>
  );
}

// 播放速度控制
export function PlaybackRateControl({
  className,
  context: propsContext,
  options = [0.5, 0.8, 1, 1.25, 1.5, 2],
  style,
}: {
  className?: string;
  style?: CSSProperties;
  options?: number[];
  context?: AudioPlayerContextValue;
}) {
  const context = usePlayerContext(propsContext);

  const speedIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M13.4 10.6 19 5" />
    </svg>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn('wa-relative', className)}
        style={style}
        asChild
      >
        <Button variant="ghost" size="sm" className="wa-flex wa-items-center !wa-p-1 !wa-ring-0 !wa-outline-none wa-text-[var(--wa-text-secondary-color)]">
          <span className="wa-w-4 wa-h-4">{speedIcon}</span>
          <span className="wa-text-xs wa-font-mono">
            {context?.audioState?.playbackRate ?? 1}
            x
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!wa-min-w-20 !wa-w-20 wa-bg-white">
        <DropdownMenuGroup>
          {options.map(rate => (
            <DropdownMenuItem
              key={rate}
              onClick={() => context?.setPlaybackRate(rate)}
              className="wa-justify-end"
            >
              {rate}
              &times;
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 下载
export function DownloadTrigger({
  asChild,
  children,
  className,
  context: propsContext,
  style,
  ...props
}: {
  className?: string;
  style?: CSSProperties;
  context?: AudioPlayerContextValue;
} & TriggerProps) {
  const context = usePlayerContext(propsContext);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (context?.src) {
      const a = document.createElement('a');
      a.href = context.src;
      a.download = 'audio';
      a.click();
    }
  };

  if (asChild && children) {
    const child = Children.only(children) as ReactElement<HTMLAttributes<HTMLElement>>;
    return cloneElement(child, {
      ...props,
      onClick: handleClick,
    });
  }

  const downloadIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} className={cn('wa-flex wa-items-center !wa-p-1 wa-text-[var(--wa-text-secondary-color)]', className)} style={style} {...props}>
      {children || <div className="wa-w-4 wa-h-4">{downloadIcon}</div>}
    </Button>
  );
}

export type PlayButtonProps = TriggerProps;
export type StopButtonProps = TriggerProps;
