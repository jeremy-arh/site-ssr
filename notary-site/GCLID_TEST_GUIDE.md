# Guide de Test du Tracking GCLID

## Tests Manuels

### Test 1 : Capture du GCLID depuis l'URL

1. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Ouvrir l'application avec un paramètre gclid**
   ```
   http://localhost:3000/?gclid=test_12345_abc
   ```

3. **Vérifier le cookie dans le navigateur**
   - Ouvrir les DevTools (F12)
   - Aller dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
   - Cliquer sur "Cookies" → Sélectionner votre domaine local
   - Vérifier que le cookie `gclid` existe avec la valeur `test_12345_abc`

4. **Vérifier la console**
   - En mode développement, vous devriez voir dans la console : 
   ```
   GCLID capturé: test_12345_abc
   ```

### Test 2 : Persistance du Cookie

1. **Naviguer vers une autre page**
   - Cliquer sur différents liens du site
   - Le cookie devrait persister

2. **Ouvrir la console et tester**
   ```javascript
   // Dans la console du navigateur
   document.cookie
   // Devrait contenir: gclid=test_12345_abc
   ```

### Test 3 : Partage entre Sous-domaines (Production uniquement)

**Note:** Ce test ne fonctionne qu'en production avec le domaine `mynotary.io`

1. **Sur le domaine principal**
   ```
   https://mynotary.io/?gclid=prod_test_789
   ```

2. **Vérifier le cookie**
   - Domain devrait être `.mynotary.io`

3. **Naviguer vers un sous-domaine**
   ```
   https://app.mynotary.io
   ```

4. **Vérifier que le cookie est toujours accessible**
   ```javascript
   // Dans la console
   console.log(document.cookie.includes('gclid=prod_test_789'))
   // Devrait retourner: true
   ```

### Test 4 : Fonction getCookie

1. **Ouvrir la console du navigateur**

2. **Tester l'utilitaire getCookie**
   ```javascript
   // Importer la fonction (si vous utilisez un module bundler)
   // ou copier-coller la fonction dans la console
   
   function getCookie(name) {
     const value = `; ${document.cookie}`
     const parts = value.split(`; ${name}=`)
     if (parts.length === 2) return parts.pop().split(';').shift()
     return null
   }
   
   console.log(getCookie('gclid'))
   // Devrait afficher la valeur du gclid
   ```

### Test 5 : Hook useGclid

1. **Créer un composant de test**
   ```jsx
   // app/test-gclid/page.jsx
   'use client'
   
   import { useGclid } from '@/hooks/useGclid'
   
   export default function TestGclidPage() {
     const gclid = useGclid()
     
     return (
       <div style={{ padding: '20px' }}>
         <h1>Test GCLID</h1>
         <p>Valeur du GCLID: {gclid || 'Non détecté'}</p>
         {gclid ? (
           <p style={{ color: 'green' }}>✅ GCLID détecté avec succès!</p>
         ) : (
           <p style={{ color: 'orange' }}>⚠️ Aucun GCLID détecté. Ajoutez ?gclid=test à l'URL.</p>
         )}
       </div>
     )
   }
   ```

2. **Visiter la page de test**
   ```
   http://localhost:3000/test-gclid?gclid=hook_test_456
   ```

3. **Vérifier l'affichage**
   - La page devrait afficher : "Valeur du GCLID: hook_test_456"

### Test 6 : Google Tag Manager Integration

1. **Ouvrir GTM Debug Mode**
   - Installer l'extension "Tag Assistant" de Google
   - Activer le mode debug

2. **Visiter le site avec un gclid**
   ```
   http://localhost:3000/?gclid=gtm_test_999
   ```

3. **Vérifier le dataLayer**
   ```javascript
   // Dans la console
   console.log(window.dataLayer)
   // Chercher l'événement 'gclid_captured'
   ```

4. **Vérifier que l'événement contient**
   ```javascript
   {
     event: 'gclid_captured',
     gclid: 'gtm_test_999',
     timestamp: '...'
   }
   ```

## Tests Automatisés

### Test avec Playwright (optionnel)

```javascript
// tests/gclid.spec.js
import { test, expect } from '@playwright/test'

test('should capture gclid from URL and store in cookie', async ({ page, context }) => {
  // Visiter la page avec un gclid
  await page.goto('http://localhost:3000/?gclid=playwright_test_123')
  
  // Attendre que le cookie soit défini
  await page.waitForTimeout(1000)
  
  // Récupérer les cookies
  const cookies = await context.cookies()
  const gclidCookie = cookies.find(c => c.name === 'gclid')
  
  // Vérifier que le cookie existe
  expect(gclidCookie).toBeDefined()
  expect(gclidCookie.value).toBe('playwright_test_123')
  
  // Vérifier le domaine (en local, ce sera localhost)
  console.log('Cookie domain:', gclidCookie.domain)
})

test('should persist gclid across navigation', async ({ page, context }) => {
  // Visiter avec gclid
  await page.goto('http://localhost:3000/?gclid=persist_test_456')
  await page.waitForTimeout(1000)
  
  // Naviguer vers une autre page
  await page.goto('http://localhost:3000/services')
  await page.waitForTimeout(1000)
  
  // Vérifier que le cookie existe toujours
  const cookies = await context.cookies()
  const gclidCookie = cookies.find(c => c.name === 'gclid')
  
  expect(gclidCookie).toBeDefined()
  expect(gclidCookie.value).toBe('persist_test_456')
})
```

## Checklist de Test

- [ ] Le cookie `gclid` est créé quand l'URL contient `?gclid=...`
- [ ] Le cookie a le bon domaine (`.mynotary.io` en production)
- [ ] Le cookie persiste pendant 90 jours
- [ ] Le cookie est accessible sur toutes les pages
- [ ] Le cookie est accessible sur les sous-domaines (production)
- [ ] La fonction `getCookie('gclid')` retourne la bonne valeur
- [ ] Le hook `useGclid()` retourne la bonne valeur
- [ ] L'événement GTM `gclid_captured` est déclenché
- [ ] Le cookie a l'attribut `Secure` (en HTTPS)
- [ ] Le cookie a l'attribut `SameSite=Lax`
- [ ] Pas de gclid dans l'URL = pas de cookie créé
- [ ] Le gclid est visible dans la console en mode dev

## Commandes Utiles

### Vérifier les cookies en ligne de commande (curl)

```bash
# Faire une requête avec gclid
curl -v "http://localhost:3000/?gclid=curl_test" 2>&1 | grep -i "set-cookie"

# Devrait afficher quelque chose comme:
# Set-Cookie: gclid=curl_test; Domain=.mynotary.io; Path=/; Max-Age=7776000; SameSite=Lax; Secure
```

### Nettoyer les cookies pour retester

```javascript
// Dans la console du navigateur
document.cookie = "gclid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
```

## Résolution des Problèmes

### Le cookie n'est pas créé
- Vérifier que le middleware Next.js fonctionne
- Vérifier la console pour les erreurs
- Vérifier que l'URL contient bien `?gclid=...`

### Le cookie n'est pas partagé entre sous-domaines
- Vérifier que vous êtes en production avec le domaine `mynotary.io`
- En local (`localhost`), le partage entre sous-domaines ne fonctionne pas
- Vérifier que le domaine du cookie est `.mynotary.io` (avec le point)

### Le hook useGclid retourne null
- Vérifier que le composant est bien un Client Component (`'use client'`)
- Vérifier que le GclidTracker est bien importé dans Providers
- Ouvrir la console pour voir les logs de développement

### L'événement GTM n'est pas déclenché
- Vérifier que GTM est bien configuré
- Vérifier que `window.dataLayer` existe
- Vérifier la console pour voir si l'événement est bien envoyé



