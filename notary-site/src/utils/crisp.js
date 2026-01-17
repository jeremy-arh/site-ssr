/**
 * Utilitaire pour ouvrir le chat Crisp de manière robuste
 * Gère les cas où Crisp n'est pas encore complètement chargé
 */

/**
 * Vérifie si Crisp est complètement chargé et prêt à être utilisé
 * @returns {boolean} true si Crisp est prêt
 */
export const isCrispReady = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Vérifier si le script externe Crisp est chargé
  const crispScriptLoaded = document.querySelector('script[src*="client.crisp.chat"]') !== null;
  
  // Vérifier si window.$crisp existe et est un tableau ou un objet
  const crispExists = typeof window.$crisp !== 'undefined';
  
  // Vérifier si la méthode push existe et est une fonction
  const pushExists = typeof window.$crisp?.push === 'function';
  
  return crispScriptLoaded && crispExists && pushExists;
};

/**
 * Ouvre le chat Crisp de manière robuste
 * Gère les cas où Crisp n'est pas encore chargé en attendant et en réessayant
 * @param {Object} options - Options de configuration
 * @param {number} options.maxAttempts - Nombre maximum de tentatives (défaut: 100)
 * @param {number} options.intervalMs - Intervalle entre les tentatives en ms (défaut: 200)
 * @param {boolean} options.forceLoad - Forcer le chargement du script si absent (défaut: true)
 * @returns {Promise<boolean>} true si le chat a été ouvert avec succès
 */
export const openCrispChat = (options = {}) => {
  const {
    maxAttempts = 100, // 20 secondes max (100 * 200ms)
    intervalMs = 200,
    forceLoad = true
  } = options;

  if (typeof window === 'undefined') {
    console.warn('[Crisp] ⚠️ window n\'est pas disponible');
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // Fonction pour ouvrir le chat
    const tryOpenChat = () => {
      if (isCrispReady()) {
        try {
          window.$crisp.push(['do', 'chat:open']);
          console.log('[Crisp] ✅ Chat ouvert avec succès');
          return true;
        } catch (error) {
          console.error('[Crisp] ❌ Erreur lors de l\'ouverture:', error);
          return false;
        }
      }
      return false;
    };

    // Essayer d'ouvrir immédiatement
    if (tryOpenChat()) {
      resolve(true);
      return;
    }

    // Si Crisp n'est pas encore prêt, attendre avec plusieurs tentatives
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      
      // Log de débogage toutes les 10 tentatives
      if (attempts % 10 === 0) {
        console.log(`[Crisp] Tentative ${attempts}/${maxAttempts} - État:`, {
          scriptLoaded: document.querySelector('script[src*="client.crisp.chat"]') !== null,
          crispExists: typeof window.$crisp !== 'undefined',
          pushExists: typeof window.$crisp?.push === 'function',
          crispReady: isCrispReady()
        });
      }
      
      if (tryOpenChat()) {
        clearInterval(interval);
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn(`[Crisp] ⚠️ Crisp n'a pas pu être chargé après ${maxAttempts} tentatives`);
        
        // Essayer de forcer le chargement du script si ce n'est pas déjà fait
        if (forceLoad && !document.querySelector('script[src*="client.crisp.chat"]')) {
          console.log('[Crisp] Tentative de chargement manuel du script...');
          const script = document.createElement('script');
          script.src = 'https://client.crisp.chat/l.js';
          script.async = true;
          script.onload = () => {
            console.log('[Crisp] Script chargé manuellement, nouvelle tentative...');
            setTimeout(() => {
              const success = tryOpenChat();
              resolve(success);
            }, 1000);
          };
          script.onerror = () => {
            console.error('[Crisp] ❌ Erreur lors du chargement manuel du script');
            resolve(false);
          };
          document.head.appendChild(script);
        } else {
          // Dernière tentative après un délai plus long
          setTimeout(() => {
            const success = tryOpenChat();
            resolve(success);
          }, 2000);
        }
      }
    }, intervalMs);
  });
};
