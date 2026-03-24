import { Toaster } from '@/components/ui/sonner';
import { I18nextProvider } from 'react-i18next';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Footer from './components/footer';
import { GlobalControl } from './components/global-control';
import Header from './components/header';
import i18n from './i18n';
import { cn } from './lib/utils';
import AiDocsPage from './pages/docs/ai';
import DocsHomePage from './pages/docs';
import HomePage from './pages/home';
import PlayerDocs from './pages/player/docs';
import PlayerHomePage from './pages/player/home';
import RecorderDocs from './pages/recorder/docs';
import RecorderHomePage from './pages/recorder/home';
import '@waveform-audio/player/index.css';

const ROUTES = {
  aiDocs: '/docs/ai',
  docs: '/docs',
  docsPlayer: '/docs/player',
  docsRecorder: '/docs/recorder',
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
          <Route path={ROUTES.docsPlayer} element={<PlayerDocs />} />
          <Route path={ROUTES.docsRecorder} element={<RecorderDocs />} />
          <Route path={ROUTES.aiDocs} element={<AiDocsPage />} />
          <Route path="/docs/*" element={<Navigate replace to={ROUTES.docs} />} />
          <Route path={ROUTES.player} element={<PlayerHomePage />} />
          <Route path="/player/docs" element={<Navigate replace to={ROUTES.docsPlayer} />} />
          <Route path="/player/docs/introduction" element={<Navigate replace to={`${ROUTES.docsPlayer}#quickstart`} />} />
          <Route path="/player/docs/player" element={<Navigate replace to={`${ROUTES.docsPlayer}#layer-1`} />} />
          <Route path="/player/docs/primitives" element={<Navigate replace to={`${ROUTES.docsPlayer}#layer-2`} />} />
          <Route path="/player/docs/hooks" element={<Navigate replace to={`${ROUTES.docsPlayer}#layer-3`} />} />
          <Route path="/player/docs/use-audio-player" element={<Navigate replace to={`${ROUTES.docsPlayer}#layer-3`} />} />
          <Route path="/player/docs/examples" element={<Navigate replace to={ROUTES.player} />} />
          <Route path="/player/docs/utils" element={<Navigate replace to={ROUTES.aiDocs} />} />
          <Route path="/player/docs/*" element={<Navigate replace to={ROUTES.docsPlayer} />} />
          <Route path="/player/examples" element={<Navigate replace to={ROUTES.player} />} />
          <Route path={ROUTES.recorder} element={<RecorderHomePage />} />
          <Route path="/recorder/docs" element={<Navigate replace to={ROUTES.docsRecorder} />} />
          <Route path="/recorder/docs/getting-started" element={<Navigate replace to={`${ROUTES.docsRecorder}#quickstart`} />} />
          <Route path="/recorder/docs/hooks" element={<Navigate replace to={`${ROUTES.docsRecorder}#hook`} />} />
          <Route path="/recorder/docs/props" element={<Navigate replace to={`${ROUTES.docsRecorder}#output-model`} />} />
          <Route path="/recorder/docs/*" element={<Navigate replace to={ROUTES.docsRecorder} />} />
          <Route path="/recorder/examples" element={<Navigate replace to={ROUTES.recorder} />} />
        </Routes>
      </Layout>
    </I18nextProvider>
  );
}
