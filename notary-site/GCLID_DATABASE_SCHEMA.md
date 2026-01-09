# Schéma de Base de Données pour le Tracking GCLID

## Vue d'ensemble

Pour exploiter pleinement le tracking GCLID, il est recommandé de stocker cette information dans votre base de données avec chaque conversion/booking/lead.

## Schéma Supabase (PostgreSQL)

### Table : bookings

```sql
-- Ajouter la colonne gclid à une table existante
ALTER TABLE bookings 
ADD COLUMN gclid VARCHAR(255) NULL,
ADD COLUMN gclid_captured_at TIMESTAMP NULL;

-- Créer un index pour les recherches rapides
CREATE INDEX idx_bookings_gclid ON bookings(gclid) WHERE gclid IS NOT NULL;

-- Commentaire pour documentation
COMMENT ON COLUMN bookings.gclid IS 'Google Click ID capturé depuis les paramètres URL - utilisé pour le tracking des conversions Google Ads';
```

### Nouvelle Table : conversions_tracking (optionnel)

Si vous voulez une table dédiée au tracking :

```sql
CREATE TABLE conversions_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Identifiant de la conversion
  conversion_type VARCHAR(50) NOT NULL, -- 'booking', 'contact', 'download', etc.
  conversion_id UUID NULL, -- ID de la réservation/contact associé
  
  -- Tracking Google Ads
  gclid VARCHAR(255) NULL,
  gclid_captured_at TIMESTAMP NULL,
  
  -- Détails de la conversion
  conversion_value DECIMAL(10, 2) NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Metadata
  user_agent TEXT NULL,
  ip_address VARCHAR(45) NULL,
  referrer TEXT NULL,
  landing_page TEXT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Contraintes
  CHECK (conversion_type IN ('booking', 'contact', 'download', 'signup', 'purchase'))
);

-- Index pour performance
CREATE INDEX idx_conversions_gclid ON conversions_tracking(gclid) WHERE gclid IS NOT NULL;
CREATE INDEX idx_conversions_type ON conversions_tracking(conversion_type);
CREATE INDEX idx_conversions_created ON conversions_tracking(created_at DESC);

-- Commentaires
COMMENT ON TABLE conversions_tracking IS 'Suivi des conversions et tracking Google Ads';
COMMENT ON COLUMN conversions_tracking.gclid IS 'Google Click ID pour attribution des conversions';
```

## Exemple d'insertion (JavaScript/TypeScript)

### Insertion simple

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getGclid } from '@/utils/cookies'

export async function createBookingWithTracking(bookingData) {
  const supabase = createClientComponentClient()
  const gclid = getGclid()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      // Données de la réservation
      name: bookingData.name,
      email: bookingData.email,
      service: bookingData.service,
      
      // Tracking
      gclid: gclid,
      gclid_captured_at: gclid ? new Date().toISOString() : null,
      
      // Autres métadonnées
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

### Insertion avec table de tracking séparée

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getGclid } from '@/utils/cookies'

export async function createBookingWithSeparateTracking(bookingData) {
  const supabase = createClientComponentClient()
  const gclid = getGclid()
  
  // 1. Créer la réservation
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      name: bookingData.name,
      email: bookingData.email,
      service: bookingData.service,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (bookingError) throw bookingError
  
  // 2. Créer l'entrée de tracking
  if (gclid) {
    const { error: trackingError } = await supabase
      .from('conversions_tracking')
      .insert({
        conversion_type: 'booking',
        conversion_id: booking.id,
        gclid: gclid,
        gclid_captured_at: new Date().toISOString(),
        conversion_value: getServicePrice(bookingData.service),
        currency: 'EUR',
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        landing_page: window.location.href,
        created_at: new Date().toISOString()
      })
    
    if (trackingError) {
      console.error('Erreur lors de l\'enregistrement du tracking:', trackingError)
      // Ne pas bloquer la réservation si le tracking échoue
    }
  }
  
  return booking
}

function getServicePrice(service) {
  const prices = {
    'apostille': 50,
    'notarization': 30,
    'translation': 40
  }
  return prices[service] || 0
}
```

## Requêtes Utiles

### Statistiques des conversions par GCLID

```sql
-- Nombre de conversions par GCLID
SELECT 
  gclid,
  COUNT(*) as conversion_count,
  SUM(conversion_value) as total_value,
  MIN(created_at) as first_conversion,
  MAX(created_at) as last_conversion
FROM conversions_tracking
WHERE gclid IS NOT NULL
GROUP BY gclid
ORDER BY conversion_count DESC;
```

### Taux de conversion

```sql
-- Taux de conversion par type
SELECT 
  conversion_type,
  COUNT(*) as total_conversions,
  COUNT(DISTINCT gclid) as unique_gclids,
  AVG(conversion_value) as avg_value,
  SUM(conversion_value) as total_value
FROM conversions_tracking
WHERE gclid IS NOT NULL
GROUP BY conversion_type
ORDER BY total_conversions DESC;
```

### Conversions des 30 derniers jours

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as conversions,
  COUNT(DISTINCT gclid) as unique_clicks,
  SUM(conversion_value) as revenue
FROM conversions_tracking
WHERE 
  gclid IS NOT NULL 
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Retrouver toutes les conversions d'un GCLID spécifique

```sql
SELECT 
  ct.*,
  b.name,
  b.email,
  b.service
FROM conversions_tracking ct
LEFT JOIN bookings b ON ct.conversion_id = b.id
WHERE ct.gclid = 'votre_gclid_ici'
ORDER BY ct.created_at DESC;
```

## Migration Supabase

Créez un fichier de migration :

```sql
-- supabase/migrations/20240101000000_add_gclid_tracking.sql

-- Étape 1: Ajouter la colonne gclid à la table bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS gclid VARCHAR(255),
ADD COLUMN IF NOT EXISTS gclid_captured_at TIMESTAMP;

-- Étape 2: Créer l'index
CREATE INDEX IF NOT EXISTS idx_bookings_gclid 
ON bookings(gclid) 
WHERE gclid IS NOT NULL;

-- Étape 3: Créer la table de tracking (optionnel)
CREATE TABLE IF NOT EXISTS conversions_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversion_type VARCHAR(50) NOT NULL,
  conversion_id UUID,
  gclid VARCHAR(255),
  gclid_captured_at TIMESTAMP,
  conversion_value DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  landing_page TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CHECK (conversion_type IN ('booking', 'contact', 'download', 'signup', 'purchase'))
);

-- Étape 4: Créer les index
CREATE INDEX IF NOT EXISTS idx_conversions_gclid 
ON conversions_tracking(gclid) 
WHERE gclid IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_conversions_type 
ON conversions_tracking(conversion_type);

CREATE INDEX IF NOT EXISTS idx_conversions_created 
ON conversions_tracking(created_at DESC);

-- Étape 5: Ajouter les commentaires
COMMENT ON COLUMN bookings.gclid IS 'Google Click ID capturé depuis les paramètres URL';
COMMENT ON TABLE conversions_tracking IS 'Suivi des conversions et tracking Google Ads';

-- Étape 6: Configurer Row Level Security (RLS)
ALTER TABLE conversions_tracking ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (pour le tracking depuis le frontend)
CREATE POLICY "Allow insert for all users" 
ON conversions_tracking 
FOR INSERT 
WITH CHECK (true);

-- Politique : Lecture restreinte aux utilisateurs authentifiés
CREATE POLICY "Allow select for authenticated users" 
ON conversions_tracking 
FOR SELECT 
USING (auth.role() = 'authenticated');
```

## Avantages de cette approche

1. **Attribution des conversions** : Savoir quels clics Google Ads ont généré des conversions
2. **ROI Marketing** : Calculer le retour sur investissement de vos campagnes
3. **Analyse avancée** : Identifier les campagnes les plus performantes
4. **Reporting** : Générer des rapports détaillés pour l'équipe marketing
5. **Optimisation** : Ajuster les enchères et les campagnes selon les performances
6. **Conformité** : Tracer l'origine des conversions pour la conformité RGPD

## Notes importantes

- **RGPD** : Le GCLID est considéré comme une donnée de tracking. Assurez-vous d'avoir le consentement approprié
- **Durée de conservation** : Définissez une politique de rétention (ex: 2 ans maximum)
- **Anonymisation** : Considérez l'anonymisation des données après la période de tracking
- **Performance** : Les index sont essentiels pour les requêtes rapides sur de grandes tables
- **Backup** : Incluez ces tables dans vos stratégies de sauvegarde



