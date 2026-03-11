# Audit complet du site Notary - Mars 2025

## Problèmes identifiés

### 1. 🔴 CRITIQUE : Changements non visibles localement

#### 1.1 OneDrive et synchronisation
**Cause probable majeure.** Le projet est situé dans :
```
C:\Users\jerem\OneDrive\Bureau\Nouveau dossier (3)\SITE\site-ssr\notary-site
```

**Problème :** OneDrive synchronise les fichiers de manière asynchrone. Cela peut provoquer :
- Des fichiers modifiés qui ne sont pas immédiatement sauvegardés/synchronisés
- Des conflits de version
- Des verrous de fichiers pendant la synchronisation
- Un éditeur qui lit une version en cache pendant qu'OneDrive synchronise une autre

**Recommandation :** Déplacer le projet **hors d'OneDrive** (ex. `C:\Dev\notary-site` ou `C:\Projects\notary-site`).

#### 1.2 Cache Next.js (.next)
Le dossier `.next` contient le build compilé. Si ce cache est corrompu ou obsolète, les changements peuvent ne pas apparaître.

**Actions :**
```powershell
# Arrêter le serveur dev, puis :
Remove-Item -Recurse -Force .next
npm run dev
```

#### 1.3 Service Worker (sw.js)
Le Service Worker enregistré dans `Providers.jsx` peut servir des ressources en cache. Bien qu'il ne cache que les images (`CACHE_PATTERNS`), en développement il peut interférer.

**Action :** En dev, désactiver temporairement le SW ou vider le cache du navigateur (DevTools > Application > Clear storage).

#### 1.4 generateBuildId dynamique
```javascript
generateBuildId: async () => 'build-' + Date.now()
```
Chaque build génère un nouvel ID. En production, cela peut invalider les caches de manière inattendue. En dev, impact limité.

---

### 2. 🔴 CRITIQUE : Problèmes de rendu / affichage incorrect

#### 2.1 optimizeCss (Critters) - INCOMPATIBLE avec App Router
```javascript
// next.config.js
experimental: {
  optimizeCss: true,
}
```

**Problème confirmé :** La fonctionnalité `optimizeCss` avec Critters :
- **Ne fonctionne pas correctement avec l'App Router** (utilisé par ce projet)
- Peut provoquer un **Flash of Unstyled Text (FOUT)**
- Est expérimentale et non maintenue
- Peut modifier le CSS de manière différente entre serveur et client → **erreurs d'hydratation**

**Recommandation :** **Désactiver** `optimizeCss` immédiatement.

#### 2.2 Risque d'hydratation dans LanguageContext
Dans `src/contexts/LanguageContext.jsx` :
```javascript
const languageFromPath = useMemo(() => {
  const urlLanguage = extractLanguageFromPath(pathname)
  if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) return urlLanguage
  // Côté serveur : window undefined → DEFAULT_LANGUAGE
  // Côté client : localStorage peut retourner 'fr', 'es', etc.
  if (typeof window !== 'undefined') {
    const savedLanguage = getLanguageFromStorage()
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage
  }
  return DEFAULT_LANGUAGE
}, [pathname])
```

**Problème :** Mismatch serveur/client quand il n'y a pas de langue dans l'URL :
- Serveur : `DEFAULT_LANGUAGE` (ex. 'en')
- Client : `getLanguageFromStorage()` (ex. 'fr')

→ **Erreur d'hydratation** pouvant provoquer un affichage cassé ou un flash.

**Correction :** Ne jamais utiliser `localStorage` dans le calcul initial. Toujours retourner `DEFAULT_LANGUAGE` côté serveur ET pour le premier rendu client, puis mettre à jour dans un `useEffect`.

#### 2.3 suppressHydrationWarning masque les vrais problèmes
```jsx
<html lang="en" suppressHydrationWarning ...>
<body suppressHydrationWarning ...>
```

Ces attributs **masquent** les avertissements d'hydratation. Si des erreurs existent (comme dans LanguageContext), elles ne seront pas visibles dans la console.

**Recommandation :** Retirer temporairement `suppressHydrationWarning` pour diagnostiquer, puis corriger les causes avant de les remettre si nécessaire.

#### 2.4 LazyLoad avec ssr: false
Plusieurs composants utilisent `dynamic(..., { ssr: false })` :
- ChatCTA, BlogSection, MobileCTA, ScrollToTop, CTAPopup, GclidTracker, SegmentPageTracker

Cela peut créer un **flash** ou un **layout shift** quand le composant se charge côté client.

---

### 3. 🟠 MOYEN : Configuration et code de debug

#### 3.1 Appels fetch dans next.config.js
Des `fetch()` vers `http://127.0.0.1:7242/ingest/...` sont exécutés :
- Au chargement de la config (ligne 216)
- Dans la fonction `headers()` en dev (ligne 187)

**Problèmes :**
- Peuvent ralentir le démarrage si le serveur n'est pas disponible
- Code de debug/analytics qui ne devrait pas être en production
- Exécution synchrone dans une fonction async peut causer des timeouts

**Recommandation :** Supprimer ou conditionner strictement ce code (ex. variable d'environnement `DEBUG_AGENT=true`).

#### 3.2 Duplication CSS
Le layout inclut :
1. Un gros bloc `<style dangerouslySetInnerHTML>` avec du CSS critique inline
2. L'import `@/index.css` (Tailwind + styles personnalisés)

Risque de conflits ou de surcharge si les mêmes classes sont définies différemment.

---

### 4. 🟡 MINEUR : Bonnes pratiques

- **tsconfig paths :** `@/*` → `./src/*` — l'alias ne couvre pas `app/`. Les fichiers dans `app/` doivent importer depuis `@/` pour les composants partagés (c'est le cas).
- **CurrencyContext :** Correctement initialisé à `'EUR'` pour éviter l'hydratation ✓
- **Service Worker :** Ne cache que les images, pas le HTML ✓

---

## Plan d'action recommandé

### Priorité 1 (immédiat)
1. **Désactiver `optimizeCss`** dans `next.config.js`
2. **Corriger LanguageContext** pour éviter l'accès à `localStorage` au premier rendu
3. **Supprimer le cache** : supprimer `.next`, redémarrer `npm run dev`

### Priorité 2 (courant terme)
4. **Déplacer le projet hors d'OneDrive**
5. **Supprimer les appels fetch** de debug dans `next.config.js`
6. **Retirer `suppressHydrationWarning`** temporairement pour vérifier qu'il n'y a plus d'erreurs d'hydratation

### Priorité 3 (optionnel)
7. Revoir `generateBuildId` pour la production (ID stable par déploiement)
8. En dev, envisager de désactiver le Service Worker ou d'ajouter un bypass

---

## Commandes de diagnostic

```powershell
# Nettoyer et redémarrer
cd "c:\Users\jerem\OneDrive\Bureau\Nouveau dossier (3)\SITE\site-ssr\notary-site"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

Dans le navigateur (DevTools > Console) : vérifier les erreurs d'hydratation après les corrections.
