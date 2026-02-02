-- Migration pour ajouter une image de certificat dynamique par service
-- Cette image est affichée dans la section "What You Receive After Your Notary Appointment"

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS certificate_image TEXT NULL;

COMMENT ON COLUMN services.certificate_image IS 'URL de l''image du certificat/document pour ce service (section What You Receive)';

-- Valeur par défaut pour les services existants (image actuelle)
-- UPDATE services SET certificate_image = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/3f9a44ae-57fe-4ec8-6f73-f936dd190a00/f=webp,q=80' WHERE certificate_image IS NULL;
