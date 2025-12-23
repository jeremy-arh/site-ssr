# Suivi du GCLID (Google Click ID)

## Vue d'ensemble

Cette fonctionnalité capture automatiquement le paramètre `gclid` de Google Ads présent dans l'URL et le stocke dans un cookie partagé entre tous les sous-domaines de `mynotary.io`.

## Fonctionnement

### 1. Middleware Next.js

Le middleware (`middleware.js`) intercepte toutes les requêtes et vérifie la présence du paramètre `gclid` dans l'URL. Si présent, il crée automatiquement un cookie avec les caractéristiques suivantes :

- **Nom** : `gclid`
- **Domaine** : `.mynotary.io` (partagé sur tous les sous-domaines)
- **Durée** : 90 jours (standard Google Ads)
- **Path** : `/` (disponible sur toutes les pages)
- **SameSite** : `Lax`
- **Secure** : `true` (HTTPS uniquement)

### 2. Utilitaires côté client

Le fichier `src/utils/cookies.js` fournit des fonctions pour manipuler les cookies :

```javascript
import { getGclid } from '@/utils/cookies'

// Récupérer le gclid actuel
const gclid = getGclid()
console.log('GCLID actuel:', gclid)
```

### 3. Hook React

Le hook `useGclid` permet d'utiliser facilement le gclid dans vos composants React :

```javascript
import { useGclid } from '@/hooks/useGclid'

function MyComponent() {
  const gclid = useGclid()
  
  useEffect(() => {
    if (gclid) {
      console.log('GCLID détecté:', gclid)
      // Utiliser le gclid pour le tracking, les conversions, etc.
    }
  }, [gclid])
  
  return <div>...</div>
}
```

## Cas d'usage

### Envoi du GCLID lors d'une conversion

```javascript
import { getGclid } from '@/utils/cookies'

async function submitForm(formData) {
  const gclid = getGclid()
  
  const data = {
    ...formData,
    gclid: gclid // Inclure le gclid dans les données de conversion
  }
  
  await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}
```

### Tracking Google Ads avec GTM

```javascript
import { useGclid } from '@/hooks/useGclid'
import { useEffect } from 'react'

function GoogleAdsTracking() {
  const gclid = useGclid()
  
  useEffect(() => {
    if (gclid && window.dataLayer) {
      window.dataLayer.push({
        event: 'gclid_available',
        gclid: gclid
      })
    }
  }, [gclid])
  
  return null
}
```

## Test

Pour tester la fonctionnalité :

1. Visitez votre site avec un paramètre gclid dans l'URL :
   ```
   https://mynotary.io/?gclid=test123456
   ```

2. Ouvrez les DevTools du navigateur (F12)

3. Allez dans l'onglet "Application" > "Cookies"

4. Vérifiez que le cookie `gclid` existe avec :
   - Valeur : `test123456`
   - Domaine : `.mynotary.io`
   - Expiration : dans 90 jours

5. Naviguez vers un sous-domaine (ex: `app.mynotary.io`) et vérifiez que le cookie est toujours accessible

## Notes importantes

- Le cookie est défini avec l'attribut `Secure`, donc il ne fonctionnera qu'en HTTPS
- Le domaine `.mynotary.io` (avec le point) permet le partage entre tous les sous-domaines
- La durée de 90 jours correspond aux recommandations de Google pour le tracking des conversions
- Le middleware capture le gclid côté serveur, et le hook le capture également côté client comme fallback

