import { Route, Routes } from 'react-router';
import DocsLayout from '../docs-layout';
import Examples from './examples';
import Hooks from './hooks';
import Introduction from './introduction';
import Player from './player';
import Primitives from './primitives';
import Utils from './utils';

export default function PlayerDocs() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route path="introduction" element={<Introduction />} />
        <Route path="player" element={<Player />} />
        <Route path="primitives" element={<Primitives />} />
        <Route path="hooks" element={<Hooks />} />
        <Route path="utils" element={<Utils />} />
        <Route path="examples" element={<Examples />} />
        <Route path="*" element={<Introduction />} />
      </Route>
    </Routes>
  );
}
