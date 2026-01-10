-- Migration pour ajouter la colonne faqs à la table services
-- Cette colonne permet de stocker une FAQ dynamique spécifique à chaque service
-- Format JSONB : tableau d'objets avec question et answer pour chaque langue

-- Ajouter la colonne faqs (JSONB) pour stocker un tableau de FAQs
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Créer un index GIN pour améliorer les performances des requêtes sur les FAQs
CREATE INDEX IF NOT EXISTS idx_services_faqs ON services USING GIN (faqs);

-- Commentaire pour la documentation
COMMENT ON COLUMN services.faqs IS 'FAQ dynamique spécifique au service. Format JSONB: [{"question": "...", "question_fr": "...", "answer": "...", "answer_fr": "...", "order": 1}, ...]';

-- Exemple de structure attendue pour les FAQs :
-- [
--   {
--     "question": "Question en anglais",
--     "question_fr": "Question en français",
--     "question_es": "Question en espagnol",
--     "answer": "Réponse en anglais",
--     "answer_fr": "Réponse en français",
--     "answer_es": "Réponse en espagnol",
--     "order": 1
--   },
--   ...
-- ]

