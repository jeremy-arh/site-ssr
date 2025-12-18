import { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { removeLanguageFromPath, addLanguageToPath, SUPPORTED_LANGUAGES } from '../utils/language';

// Lazy load pages
import { lazy } from 'react';
const Home = lazy(() => import('../pages/Home'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogPost = lazy(() => import('../pages/BlogPost'));
const ServicesList = lazy(() => import('../pages/ServicesList'));
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'));
const TermsConditions = lazy(() => import('../pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Composant wrapper pour vérifier si le paramètre lang est valide
 */
const ValidatedLanguageRoute = ({ element }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const lang = params.lang;

  useEffect(() => {
    // Si lang est défini mais n'est pas une langue supportée, rediriger
    if (lang && !SUPPORTED_LANGUAGES.includes(lang)) {
      const basePath = removeLanguageFromPath(location.pathname);
      const newPath = addLanguageToPath(basePath, language);
      navigate(newPath, { replace: true });
    }
  }, [lang, language, location.pathname, navigate]);

  // Si lang n'est pas valide, ne rien afficher pendant la redirection
  if (lang && !SUPPORTED_LANGUAGES.includes(lang)) {
    return null;
  }

  return element;
};

/**
 * Composant qui gère les redirections de langue et les routes localisées
 */
const LanguageRouter = () => {
  const { isReady } = useLanguage();

  // Ne pas rediriger automatiquement - laisser LanguageContext gérer la synchronisation
  // Cela évite les boucles de redirection sur les pages de blog

  // Routes avec support de langue dans l'URL
  // Format: /:lang?/route ou /route (pour 'en')
  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-white z-50" aria-busy="true" />}>
      <Routes>
        {/* Routes sans langue (pour 'en' ou langue par défaut) */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Routes avec langue dans l'URL */}
        <Route path="/:lang" element={<ValidatedLanguageRoute element={<Home />} />} />
        <Route path="/:lang/blog" element={<ValidatedLanguageRoute element={<Blog />} />} />
        <Route path="/:lang/blog/:slug" element={<ValidatedLanguageRoute element={<BlogPost />} />} />
        <Route path="/:lang/services" element={<ValidatedLanguageRoute element={<ServicesList />} />} />
        <Route path="/:lang/services/:serviceId" element={<ValidatedLanguageRoute element={<ServiceDetail />} />} />
        <Route path="/:lang/terms-conditions" element={<ValidatedLanguageRoute element={<TermsConditions />} />} />
        <Route path="/:lang/privacy-policy" element={<ValidatedLanguageRoute element={<PrivacyPolicy />} />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default LanguageRouter;
