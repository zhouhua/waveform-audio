import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { usePlayerContext } from '../../hooks/use-player-context';

function abstractComponentFactory(name: string, check: (context: AudioPlayerContextValue) => boolean) {
  const AbstractComponent = function ({ children, context: propsContext }: {
    children?: React.ReactNode;
    context?: AudioPlayerContextValue;
  }) {
    const context = usePlayerContext(propsContext);
    if (context && check(context)) {
      return children;
    }
    return null;
  };
  AbstractComponent.displayName = name;
  return AbstractComponent;
}

export const Playing = abstractComponentFactory('Playing', context => context.audioState.isPlaying);
export const Paused = abstractComponentFactory('Paused', context => !context.audioState.isPlaying);
export const Stopped = abstractComponentFactory('Stopped', context => context.audioState.isStoped);
export const NotStopped = abstractComponentFactory('NotStopped', context => !context.audioState.isStoped);
export const Loading = abstractComponentFactory('Loading', context => !context.isReady);
export const NotLoading = abstractComponentFactory('NotLoading', context => context.isReady);

export function WithContext({ context: propsContext, render }: {
  context?: AudioPlayerContextValue;
  render: (context: AudioPlayerContextValue) => React.ReactNode;
}) {
  const context = usePlayerContext(propsContext);
  return context ? render(context) : null;
}
