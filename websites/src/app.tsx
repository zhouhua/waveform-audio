import { Toaster } from '@/components/ui/sonner';
import { I18nextProvider } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router';
import Footer from './components/footer';
import { GlobalControl } from './components/global-control';
import Header from './components/header';
import i18n from './i18n';
import { cn } from './lib/utils';
import ExamplesPage from './pages/examples';
import HomePage from './pages/home';
import PlayerDocs from './pages/player/docs';
import PlayerExamplesPage from './pages/player/examples';
import PlayerHomePage from './pages/player/home';
import '@zhouhua-dev/waveform-player-react/index.css';

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full max-w-[1000px] mx-auto flex flex-col">
      <Header />

      <main className={cn('flex-1', pathname === '/' ? 'flex flex-col items-center justify-center' : '')}>
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
          <Route path="/player/docs/*" element={<PlayerDocs />} />
          <Route path="/player/examples" element={<PlayerExamplesPage />} />
        </Routes>
      </Layout>
    </I18nextProvider>
  );
}
