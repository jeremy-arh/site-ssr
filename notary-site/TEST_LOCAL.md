# 🚀 Guide pour tester en local

## Prérequis

1. **Node.js** installé (version 18 ou supérieure)
2. **npm** ou **yarn** installé

## Étapes pour tester

### 1. Installer les dépendances

```bash
cd notary-site
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du dossier `notary-site` :

```bash
# Dans le dossier notary-site
touch .env.local
```

Puis ajoutez vos variables d'environnement dans `.env.local` :

```env
# Supabase Configuration (pour Next.js)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Note importante :** 
- Next.js utilise le préfixe `NEXT_PUBLIC_` pour les variables accessibles côté client
- Si vous avez déjà `VITE_SUPABASE_URL`, vous devez aussi ajouter `NEXT_PUBLIC_SUPABASE_URL` avec la même valeur

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

### 4. Tester les routes

Une fois le serveur lancé, testez ces routes :

- ✅ **Page d'accueil** : http://localhost:3000
- ✅ **Blog** : http://localhost:3000/blog
- ✅ **Services** : http://localhost:3000/services
- ✅ **Service détail** : http://localhost:3000/services/certified-translation
- ✅ **Privacy Policy** : http://localhost:3000/privacy-policy
- ✅ **Terms & Conditions** : http://localhost:3000/terms-conditions

### 5. Build de production (optionnel)

Pour tester le build de production :

```bash
# Build
npm run build

# Lancer le serveur de production
npm start
```

## Dépannage

### Erreur : "Supabase environment variables are not configured"

**Solution :** Vérifiez que votre fichier `.env.local` contient bien :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erreur : "Module not found"

**Solution :** Réinstallez les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : Port 3000 déjà utilisé

**Solution :** Changez le port :
```bash
PORT=3001 npm run dev
```

### Les images ne s'affichent pas

**Solution :** Vérifiez que les URLs d'images dans `next.config.js` sont correctes et que le domaine `imagedelivery.net` est autorisé.

## Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancer la production
npm start

# Linter
npm run lint

# Prebuild (génère les données statiques)
npm run prebuild
```

## Structure des fichiers

```
notary-site/
├── app/                    # Pages Next.js (App Router)
│   ├── page.jsx           # Page d'accueil
│   ├── blog/              # Pages blog
│   ├── services/          # Pages services
│   └── ...
├── src/                   # Composants, hooks, utils
│   ├── components/        # Composants React
│   ├── contexts/          # Contextes (Language, Currency)
│   ├── hooks/             # Hooks personnalisés
│   └── utils/             # Utilitaires
├── public/                # Fichiers statiques
├── .env.local             # Variables d'environnement (à créer)
└── package.json
```

## Notes importantes

- ⚠️ Le fichier `.env.local` ne doit **PAS** être commité dans Git (déjà dans `.gitignore`)
- ✅ Les variables `NEXT_PUBLIC_*` sont accessibles côté client (nécessaire pour Supabase)
- ✅ Next.js recharge automatiquement les changements (Hot Module Replacement)

