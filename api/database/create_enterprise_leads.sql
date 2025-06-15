-- SQL für die Tabelle enterprise_leads
CREATE TABLE IF NOT EXISTS enterprise_leads (
    id SERIAL PRIMARY KEY,
    organisation_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new', -- z.B. new, contacted, converted, rejected
    notes TEXT, -- Für interne Notizen
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Index für schnelle Suche nach E-Mail
CREATE INDEX IF NOT EXISTS idx_enterprise_leads_email ON enterprise_leads (contact_email);
