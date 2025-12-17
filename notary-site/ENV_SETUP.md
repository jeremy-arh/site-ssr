# Configuration des Variables d'Environnement

## 📍 Où mettre les clés d'environnement ?

Créez un fichier **`.env.local`** à la **racine du dossier `notary-site`** (même niveau que `package.json`).

## 📝 Variables nécessaires

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Clé anonyme (anon key) de votre projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔍 Comment trouver ces valeurs ?

1. **Connectez-vous à votre projet Supabase** : https://supabase.com
2. **Allez dans Settings > API**
3. **Copiez** :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ⚠️ Important

- Le fichier `.env.local` est **déjà ignoré par Git** (dans `.gitignore`)
- **NE COMMITEZ JAMAIS** ce fichier avec vos vraies clés
- Le préfixe `NEXT_PUBLIC_` est **obligatoire** pour que les variables soient accessibles côté client si nécessaire

## 🚀 Après configuration

1. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. Les variables seront automatiquement chargées par Next.js

## 📂 Structure du fichier

```
notary-site/
├── .env.local          ← Créez ce fichier ici
├── package.json
├── next.config.js
└── ...
```

## ✅ Vérification

Pour vérifier que les variables sont bien chargées, vous pouvez temporairement ajouter dans un Server Component :

```jsx
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**Note** : Ne faites cela qu'en développement, jamais en production !

