import { Toaster } from '@/components/ui/sonner';
import { I18nextProvider } from 'react-i18next';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Footer from './components/footer';
import { GlobalControl } from './components/global-control';
import Header from './components/header';
import i18n from './i18n';
import { cn } from './lib/utils';
import DocsHomePage from './pages/docs';
import HomePage from './pages/home';
import PlayerHomePage from './pages/player/home';
import RecorderHomePage from './pages/recorder/home';
import '@waveform-audio/player/index.css';

const ROUTES = {
  docs: '/docs',
  player: '/player',
  recorder: '/recorder',
} as const;

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full bg-transparent">
      <Header />
      <main className={cn('flex-1', pathname === '/' ? 'overflow-hidden' : '')}>
        {children}
      </main>
      <Footer />
      <GlobalControl />
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/examples" element={<Navigate replace to={ROUTES.player} />} />
          <Route path={ROUTES.docs} element={<DocsHomePage />} />
          <Route path="/docs/player" element={<Navigate replace to={`${ROUTES.docs}#player`} />} />
          <Route path="/docs/recorder" element={<Navigate replace to={`${ROUTES.docs}#recorder`} />} />
          <Route path="/docs/ai" element={<Navigate replace to={`${ROUTES.docs}#ai`} />} />
          <Route path="/docs/*" element={<Navigate replace to={ROUTES.docs} />} />
          <Route path={ROUTES.player} element={<PlayerHomePage />} />
          <Route path="/player/docs" element={<Navigate replace to={`${ROUTES.docs}#player`} />} />
          <Route path="/player/docs/introduction" element={<Navigate replace to={`${ROUTES.docs}#getting-started`} />} />
          <Route path="/player/docs/player" element={<Navigate replace to={`${ROUTES.docs}#player-default`} />} />
          <Route path="/player/docs/primitives" element={<Navigate replace to={`${ROUTES.docs}#player-primitives`} />} />
          <Route path="/player/docs/hooks" element={<Navigate replace to={`${ROUTES.docs}#player-hooks`} />} />
          <Route path="/player/docs/use-audio-player" element={<Navigate replace to={`${ROUTES.docs}#player-hooks`} />} />
          <Route path="/player/docs/examples" element={<Navigate replace to={ROUTES.player} />} />
          <Route path="/player/docs/utils" element={<Navigate replace to={`${ROUTES.docs}#ai`} />} />
          <Route path="/player/docs/*" element={<Navigate replace to={`${ROUTES.docs}#player`} />} />
          <Route path="/player/examples" element={<Navigate replace to={ROUTES.player} />} />
          <Route path={ROUTES.recorder} element={<RecorderHomePage />} />
          <Route path="/recorder/docs" element={<Navigate replace to={`${ROUTES.docs}#recorder`} />} />
          <Route path="/recorder/docs/getting-started" element={<Navigate replace to={`${ROUTES.docs}#recorder-quickstart`} />} />
          <Route path="/recorder/docs/hooks" element={<Navigate replace to={`${ROUTES.docs}#recorder-hook`} />} />
          <Route path="/recorder/docs/props" element={<Navigate replace to={`${ROUTES.docs}#recorder-output`} />} />
          <Route path="/recorder/docs/*" element={<Navigate replace to={`${ROUTES.docs}#recorder`} />} />
          <Route path="/recorder/examples" element={<Navigate replace to={ROUTES.recorder} />} />
        </Routes>
      </Layout>
    </I18nextProvider>
  );
}
