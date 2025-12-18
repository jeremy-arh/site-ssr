import { useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CTAPopup from './components/CTAPopup'
import LanguageRouter from './components/LanguageRouter'
import { useScrollAnimation } from './hooks/useScrollAnimation'

// Plausible uniquement - PAS de Supabase analytics (46 KiB économisés)
import { trackPageView as trackPlausiblePageView } from './utils/plausible'

// Prefetch chargé dynamiquement (mais sans analytics Supabase)
let prefetchModule = null;

const loadPrefetch = () => {
  if (prefetchModule) return Promise.resolve(prefetchModule);
  return import('./utils/prefetch').then(m => { prefetchModule = m; return m; });
};

// Component to track page views - Plausible uniquement (léger, ~1KB)
// PAS de Supabase analytics - économie de 46 KiB !
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.split('/').pop();
    trackPlausiblePageView(pageName, location.pathname).catch(() => {});
  }, [location]);

  return null;
}

// Component to prefetch form - chargé dynamiquement
function FormPrefetcher() {
  const { currency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const serviceMatch = location.pathname.match(/\/services\/([^/]+)/);
    const serviceId = serviceMatch ? serviceMatch[1] : null;

    // Prefetch après 2 secondes pour ne pas bloquer
    const prefetchTimer = setTimeout(() => {
      loadPrefetch().then(m => m.prefetchForm(currency, serviceId)).catch(() => {});
    }, 2000);

    return () => clearTimeout(prefetchTimer);
  }, [currency, location.pathname]);

  return null;
}

function App() {
  useScrollAnimation();

  // Prefetch chargé dynamiquement après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrefetch().then(m => {
        m.setupLinkPrefetch();
        m.prefetchVisibleLinks();
        // Blog et services après 5 secondes (vraiment pas urgent)
        setTimeout(() => {
          m.prefetchBlogPosts(10).catch(() => {});
          m.prefetchServices().catch(() => {});
        }, 2000);
      }).catch(() => {});
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <CurrencyProvider>
        <Router>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </Router>
      </CurrencyProvider>
    </HelmetProvider>
  )
}

export default App

// Render immédiat - ne pas bloquer sur la langue
const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <PageViewTracker />
      <FormPrefetcher />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LanguageRouter />
        </main>
        <Footer />
        <CTAPopup />
      </div>
    </>
  );
};
