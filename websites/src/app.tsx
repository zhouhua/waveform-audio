import { Toaster } from '@/components/ui/sonner';
import { I18nextProvider } from 'react-i18next';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Footer from './components/footer';
import { GlobalControl } from './components/global-control';
import Header from './components/header';
import i18n from './i18n';
import { cn } from './lib/utils';
import ExamplesPage from './pages/examples';
import AiDocsPage from './pages/docs/ai';
import HomePage from './pages/home';
import PlayerDocs from './pages/player/docs';
import PlayerExamplesPage from './pages/player/examples';
import PlayerHomePage from './pages/player/home';
import RecorderDocs from './pages/recorder/docs';
import RecorderExamplesPage from './pages/recorder/examples';
import RecorderHomePage from './pages/recorder/home';
import '@waveform-audio/player/index.css';

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
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/player" element={<PlayerHomePage />} />
          <Route path="/player/docs" element={<PlayerDocs />} />
          <Route path="/player/docs/introduction" element={<Navigate replace to="/player/docs#quickstart" />} />
          <Route path="/player/docs/player" element={<Navigate replace to="/player/docs#layer-1" />} />
          <Route path="/player/docs/primitives" element={<Navigate replace to="/player/docs#layer-2" />} />
          <Route path="/player/docs/hooks" element={<Navigate replace to="/player/docs#layer-3" />} />
          <Route path="/player/docs/use-audio-player" element={<Navigate replace to="/player/docs#layer-3" />} />
          <Route path="/player/docs/examples" element={<Navigate replace to="/examples" />} />
          <Route path="/player/docs/utils" element={<Navigate replace to="/docs/ai" />} />
          <Route path="/player/docs/*" element={<Navigate replace to="/player/docs" />} />
          <Route path="/player/examples" element={<PlayerExamplesPage />} />
          <Route path="/recorder" element={<RecorderHomePage />} />
          <Route path="/recorder/docs" element={<RecorderDocs />} />
          <Route path="/recorder/docs/getting-started" element={<Navigate replace to="/recorder/docs#quickstart" />} />
          <Route path="/recorder/docs/hooks" element={<Navigate replace to="/recorder/docs#hook" />} />
          <Route path="/recorder/docs/props" element={<Navigate replace to="/recorder/docs#output-model" />} />
          <Route path="/recorder/docs/*" element={<Navigate replace to="/recorder/docs" />} />
          <Route path="/recorder/examples" element={<RecorderExamplesPage />} />
          <Route path="/docs/ai" element={<AiDocsPage />} />
        </Routes>
      </Layout>
    </I18nextProvider>
  );
}
