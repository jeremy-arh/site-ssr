# Guide de Migration Vite → Next.js

## ✅ Fichiers déjà migrés

- ✅ `next.config.js` - Configuration Next.js
- ✅ `package.json` - Dépendances Next.js
- ✅ `tailwind.config.js` - Configuration Tailwind
- ✅ `tsconfig.json` - Configuration TypeScript
- ✅ `app/layout.jsx` - Layout principal
- ✅ `app/page.jsx` - Page d'accueil
- ✅ `app/blog/page.jsx` - Liste des blogs
- ✅ `app/blog/[slug]/page.jsx` - Article de blog
- ✅ `src/contexts/LanguageContext.jsx` - Adapté pour Next.js
- ✅ `src/contexts/CurrencyContext.jsx` - Adapté pour Next.js

## 📝 Remplacements nécessaires dans tous les composants

### 1. Imports React Router → Next.js

**Avant:**
```jsx
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
```

**Après:**
```jsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
```

### 2. Utilisation de Link

**Avant:**
```jsx
<Link to="/path">Text</Link>
```

**Après:**
```jsx
<Link href="/path">Text</Link>
```

### 3. useLocation → usePathname

**Avant:**
```jsx
const location = useLocation()
const pathname = location.pathname
```

**Après:**
```jsx
const pathname = usePathname()
```

### 4. useNavigate → useRouter

**Avant:**
```jsx
const navigate = useNavigate()
navigate('/path')
navigate('/path', { replace: true })
```

**Après:**
```jsx
const router = useRouter()
router.push('/path')
router.replace('/path')
```

### 5. useParams (identique mais import différent)

**Avant:**
```jsx
import { useParams } from 'react-router-dom'
const { slug } = useParams()
```

**Après:**
```jsx
import { useParams } from 'next/navigation'
const params = useParams()
const slug = params.slug
```

### 6. Composants Client

Tous les composants qui utilisent des hooks Next.js doivent avoir `'use client'` en haut:

```jsx
'use client'

import { useState } from 'react'
// ...
```

## 📁 Pages à créer

### Pages restantes à créer:

1. `app/services/page.jsx` - Liste des services
2. `app/services/[serviceId]/page.jsx` - Détail service
3. `app/terms-conditions/page.jsx` - Terms & Conditions
4. `app/privacy-policy/page.jsx` - Privacy Policy
5. `app/not-found.jsx` - Page 404

### Routes avec langue [lang]

Pour les routes avec préfixe de langue, créer:
- `app/[lang]/page.jsx`
- `app/[lang]/blog/page.jsx`
- `app/[lang]/blog/[slug]/page.jsx`
- `app/[lang]/services/page.jsx`
- `app/[lang]/services/[serviceId]/page.jsx`
- `app/[lang]/terms-conditions/page.jsx`
- `app/[lang]/privacy-policy/page.jsx`

## 🔧 Composants à adapter

Tous les composants dans `src/components/` qui utilisent:
- `Link` de react-router-dom → `Link` de next/link
- `useLocation` → `usePathname`
- `useNavigate` → `useRouter`
- `useParams` → `useParams` (import différent)

## 📦 Assets et fichiers publics

- Copier `public/` vers `public/` (Next.js utilise aussi public/)
- Copier `src/assets/` vers `public/` ou `src/assets/` (selon usage)

## ⚙️ Configuration

- Les variables d'environnement `VITE_*` doivent être renommées en `NEXT_PUBLIC_*` pour Next.js

## 🚀 Scripts

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run start` - Serveur production

