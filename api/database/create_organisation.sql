CREATE TABLE IF NOT EXISTS organisation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    organisation_slug VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    owner_id VARCHAR(64) NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(50) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    plan VARCHAR(50) DEFAULT 'free',
    payment_method VARCHAR(255) DEFAULT 'none',
    plan_expiry_date TIMESTAMP WITH TIME ZONE,
    plan_renewal_date TIMESTAMP WITH TIME ZONE,
    plan_status VARCHAR(20) DEFAULT 'active',
    plan_features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);