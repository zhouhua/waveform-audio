import { Route, Routes, useLocation } from 'react-router-dom';
import PlayerDocsPage from './pages/player/docs';
import PlayerExamplesPage from './pages/player/examples';
import PlayerHomePage from './pages/player/home';
import ExamplesPage from './pages/examples';
import HomePage from './pages/home';
import Footer from './components/footer';
import Header from './components/header';
import '@zhouhua-dev/waveform-player-react/index.css';
import { cn } from './lib/utils';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className='bg-fixed' style={{
      backgroundImage: 'linear-gradient(120deg, #e0c3fc, #8ec5fc)',
    }}>
      <div className="min-h-screen w-[720px] mx-auto flex flex-col">
        <Header />

        <main className={cn('flex-1', pathname === '/' ? 'flex flex-col items-center justify-center' : '')}>
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/player" element={<PlayerHomePage />} />
          <Route path="/player/docs/*" element={<PlayerDocsPage />} />
          <Route path="/player/examples" element={<PlayerExamplesPage />} />
        </Routes>
      </Layout>
    </I18nextProvider>
  );
}
