import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { usePlayerContext } from '../../hooks/use-player-context';
import { formatFileSize } from '../../utils/audio-metadata';
import { cn } from '../../utils/cn';

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
    <div
      className={cn('wa-metadata wa-flex wa-flex-wrap wa-gap-3 wa-text-xs wa-text-[var(--wa-text-color)]', className)}
      style={style}
    >
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
