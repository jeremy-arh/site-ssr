-- Migration pour ajouter les colonnes de catégories multilingues à la table services
-- Les catégories seront affichées dans la langue de l'utilisateur sur la homepage
-- La colonne category reste la valeur de référence pour le filtrage (ex: "translation", "certification")
-- Les colonnes category_fr, category_es, etc. contiennent les libellés traduits pour l'affichage

-- Étape 1: Créer la colonne category si elle n'existe pas déjà
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general';

-- Créer un index pour la colonne category si elle vient d'être créée
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Étape 2: Mettre à jour les services existants avec des catégories par défaut basées sur leur service_id
-- (seulement si category n'a pas encore de valeur)
UPDATE services 
SET category = CASE
  WHEN service_id LIKE '%translation%' OR service_id LIKE '%traduction%' THEN 'translation'
  WHEN service_id LIKE '%certified%' OR service_id LIKE '%certificat%' THEN 'certification'
  WHEN service_id LIKE '%power-of-attorney%' OR service_id LIKE '%affidavit%' OR service_id LIKE '%declaration%' THEN 'legal'
  WHEN service_id LIKE '%apostille%' THEN 'apostille'
  WHEN service_id LIKE '%signature%' THEN 'signature'
  ELSE 'general'
END
WHERE category IS NULL OR category = 'general';

-- Étape 3: Ajouter les colonnes pour les catégories multilingues
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category_fr VARCHAR(100),
ADD COLUMN IF NOT EXISTS category_es VARCHAR(100),
ADD COLUMN IF NOT EXISTS category_de VARCHAR(100),
ADD COLUMN IF NOT EXISTS category_it VARCHAR(100),
ADD COLUMN IF NOT EXISTS category_pt VARCHAR(100);

-- Créer des index pour améliorer les performances des requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_services_category_fr ON services(category_fr);
CREATE INDEX IF NOT EXISTS idx_services_category_es ON services(category_es);

-- Étape 4: Commentaires pour la documentation
COMMENT ON COLUMN services.category IS 'Service category reference value for filtering (e.g., "translation", "certification", "legal", "general") - used internally for filtering';
COMMENT ON COLUMN services.category_fr IS 'Service category label in French for display (e.g., "Traduction", "Certification", "Juridique")';
COMMENT ON COLUMN services.category_es IS 'Service category label in Spanish for display (e.g., "Traducción", "Certificación", "Legal")';
COMMENT ON COLUMN services.category_de IS 'Service category label in German for display (e.g., "Übersetzung", "Zertifizierung", "Rechtlich")';
COMMENT ON COLUMN services.category_it IS 'Service category label in Italian for display (e.g., "Traduzione", "Certificazione", "Legale")';
COMMENT ON COLUMN services.category_pt IS 'Service category label in Portuguese for display (e.g., "Tradução", "Certificação", "Legal")';

-- Étape 5: Mettre à jour les catégories existantes avec des traductions par défaut basées sur leur valeur category
UPDATE services 
SET 
  category_fr = CASE
    WHEN category = 'translation' THEN 'Traduction'
    WHEN category = 'certification' THEN 'Certification'
    WHEN category = 'legal' THEN 'Juridique'
    WHEN category = 'apostille' THEN 'Apostille'
    WHEN category = 'signature' THEN 'Signature'
    ELSE 'Général'
  END,
  category_es = CASE
    WHEN category = 'translation' THEN 'Traducción'
    WHEN category = 'certification' THEN 'Certificación'
    WHEN category = 'legal' THEN 'Legal'
    WHEN category = 'apostille' THEN 'Apostilla'
    WHEN category = 'signature' THEN 'Firma'
    ELSE 'General'
  END,
  category_de = CASE
    WHEN category = 'translation' THEN 'Übersetzung'
    WHEN category = 'certification' THEN 'Zertifizierung'
    WHEN category = 'legal' THEN 'Rechtlich'
    WHEN category = 'apostille' THEN 'Apostille'
    WHEN category = 'signature' THEN 'Unterschrift'
    ELSE 'Allgemein'
  END,
  category_it = CASE
    WHEN category = 'translation' THEN 'Traduzione'
    WHEN category = 'certification' THEN 'Certificazione'
    WHEN category = 'legal' THEN 'Legale'
    WHEN category = 'apostille' THEN 'Apostille'
    WHEN category = 'signature' THEN 'Firma'
    ELSE 'Generale'
  END,
  category_pt = CASE
    WHEN category = 'translation' THEN 'Tradução'
    WHEN category = 'certification' THEN 'Certificação'
    WHEN category = 'legal' THEN 'Legal'
    WHEN category = 'apostille' THEN 'Apostila'
    WHEN category = 'signature' THEN 'Assinatura'
    ELSE 'Geral'
  END
WHERE category IS NOT NULL;

