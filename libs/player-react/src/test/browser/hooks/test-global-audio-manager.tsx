import Player from '../../../components/player';
import { PlayerRoot, PlayTrigger } from '../../../components/primitives';
import { useAudioPlayer } from '../../../hooks/use-audio-player';
import { useGlobalAudioManager } from '../../../hooks/use-global-audio-manager';
import audio from '../../test.mp3';
import '../../../index.css';

export default function TestGlobalAudioManager() {
  const { instances, stopAll } = useGlobalAudioManager();
  const { play } = useAudioPlayer({ src: audio });

  const playingCount = instances.filter(({ audioState }) => audioState.isPlaying).length;

  return (
    <div>
      <div data-testid="instances">{instances.length}</div>
      <div data-testid="playing">{playingCount}</div>
      <Player src={audio} />
      <Player src={audio} />
      <button type="button" onClick={play} data-testid="play">
        play
      </button>
      <PlayerRoot src={audio}>
        <PlayTrigger />
      </PlayerRoot>
      <button type="button" onClick={stopAll} data-testid="stop-all">
        stop all
      </button>
    </div>
  );
}
