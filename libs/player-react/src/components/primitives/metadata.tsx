import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { useContext } from 'react';
import { formatFileSize } from '../../utils/audio-metadata';
import { cn } from '../../utils/cn';
import { RootContext } from './root';

// 自定义 hook 用于获取 context
function usePlayerContext(propsContext?: AudioPlayerContextValue) {
  const rootContext = useContext(RootContext);
  return propsContext || rootContext;
}

export interface MetadataProps {
  className?: string;
  style?: React.CSSProperties;
  context?: AudioPlayerContextValue;
}

export function Metadata({
  className,
  context: propsContext,
  style,
}: MetadataProps) {
  const context = usePlayerContext(propsContext);
  const metadata = context?.metadata;

  return (
    <div className={cn('wa-flex wa-flex-wrap wa-gap-3 wa-text-xs wa-text-[var(--wa-text-color)]', className)} style={style}>
      {metadata && (
        <>
          {metadata.bitrate && (
            <span>
              {Math.round(metadata.bitrate / 1000)}
              {' '}
              kbps
            </span>
          )}
          {metadata.sampleRate && (
            <span>
              {Math.round(metadata.sampleRate / 1000)}
              {' '}
              kHz
            </span>
          )}
          {metadata.fileSize && (
            <span>
              {formatFileSize(metadata.fileSize)}
            </span>
          )}
        </>
      )}
    </div>
  );
}
