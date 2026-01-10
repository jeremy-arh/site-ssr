-- Migration pour ajouter la colonne category à la table services
-- Cette colonne permet de catégoriser les services pour le filtrage

-- Ajouter la colonne category
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general';

-- Créer un index pour améliorer les performances des requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Commentaire pour la documentation
COMMENT ON COLUMN services.category IS 'Service category for filtering (e.g., "certification", "translation", "legal", "general")';

-- Mettre à jour les services existants avec des catégories par défaut basées sur leur service_id
UPDATE services 
SET category = CASE
  WHEN service_id LIKE '%translation%' OR service_id LIKE '%traduction%' THEN 'translation'
  WHEN service_id LIKE '%certified%' OR service_id LIKE '%certificat%' THEN 'certification'
  WHEN service_id LIKE '%power-of-attorney%' OR service_id LIKE '%affidavit%' OR service_id LIKE '%declaration%' THEN 'legal'
  WHEN service_id LIKE '%apostille%' THEN 'apostille'
  WHEN service_id LIKE '%signature%' THEN 'signature'
  ELSE 'general'
END
WHERE category = 'general' OR category IS NULL;

