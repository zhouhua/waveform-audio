import { cn } from '@/lib/utils';
import { useGlobalAudioManager } from '@waveform-audio/player';
import { Disc3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function GlobalControl() {
  const { instances, stopAll } = useGlobalAudioManager();
  const { t } = useTranslation();
  const playingInstances = instances.filter(({ audioState }) => audioState.isPlaying);

  if (instances.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-black/10 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur"
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
