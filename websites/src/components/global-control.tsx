import { cn } from '@/lib/utils';
import { useGlobalAudioManager } from '@zhouhua-dev/waveform-player-react';
import { Disc3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function GlobalControl() {
  const { instances, stopAll } = useGlobalAudioManager();
  const { t } = useTranslation();
  const playingInstances = instances.filter(({ instance }) => instance.audioState.isPlaying);
  return (
    <div
      className="fixed bottom-4 right-4 flex items-center justify-center size-10 bg-white shadow-lg rounded-full"
      onClick={stopAll}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Disc3
              className={cn(
                'w-6 h-6',
                playingInstances.length > 0 && 'animate-spin',
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('globalControl.tooltip.clickToStop')}</p>
            <p>
              {t('globalControl.tooltip.status', {
                count: instances.length,
                playing: playingInstances.length,
              })}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
