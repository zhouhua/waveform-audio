import type { AudioMetadata } from '../../utils/audio-metadata';
import { formatFileSize } from '../../utils/audio-metadata';
import { cn } from '../../utils/cn';

export interface MetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  metadata: AudioMetadata;
}

export function Metadata({
  className,
  metadata,
  ...props
}: MetadataProps) {
  const items = [
    metadata.bitrate && (
      <span key="bitrate">
        {metadata.bitrate}
        {' '}
        kbps
      </span>
    ),
    metadata.sampleRate && (
      <span key="sampleRate">
        {(metadata.sampleRate / 1000).toFixed(1)}
        {' '}
        kHz
      </span>
    ),
    metadata.fileSize && <span key="fileSize">{formatFileSize(metadata.fileSize)}</span>,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        'wa-flex wa-flex-wrap wa-gap-3 wa-text-xs wa-text-[var(--wa-text-color)]',
        className,
      )}
      {...props}
    >
      {items}
    </div>
  );
}
