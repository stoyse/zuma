-- SQL für die Tabelle promo_codes
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL, -- Der Code, den Benutzer eingeben
    discount_percentage DECIMAL(5,2) NOT NULL, -- z.B. 25.00 für 25% (für Ihre Referenz)
    stripe_coupon_id VARCHAR(255) NOT NULL, -- Die ID des entsprechenden Coupons in Stripe
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Index für schnelle Suche nach Code
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes (code);

-- Beispiel-Einträge (Kommentare entfernen und anpassen, um sie zu verwenden)

INSERT INTO promo_codes (code, discount_percentage, stripe_coupon_id, description)
VALUES ('HACKCLUB', 100.00, 'Ls0Eh57M', '100% off for Hack Club members');

