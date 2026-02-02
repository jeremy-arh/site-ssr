-- Migration pour ajouter les prix fixes en USD et GBP à la table services
-- base_price = prix en EUR (existant)
-- price_usd = prix fixe en USD
-- price_gbp = prix fixe en GBP

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS price_usd NUMERIC(10, 2) NULL;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS price_gbp NUMERIC(10, 2) NULL;

COMMENT ON COLUMN services.base_price IS 'Prix fixe en EUR';
COMMENT ON COLUMN services.price_usd IS 'Prix fixe en USD';
COMMENT ON COLUMN services.price_gbp IS 'Prix fixe en GBP';
