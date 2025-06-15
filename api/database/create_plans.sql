-- filepath: /Users/julianstosse/Developer/zuma/api/database/create_plans.sql
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'free', 'pro'
    name VARCHAR(255) NOT NULL, -- e.g., 'Free Tier', 'Pro Plan'
    description TEXT NULL, -- Optional: a short description of the plan
    price_amount DECIMAL(10, 2) NOT NULL, -- e.g., 0.00, 49.00
    price_currency VARCHAR(10) NOT NULL DEFAULT 'USD', -- e.g., 'USD'
    frequency_per_unit VARCHAR(50) NULL, -- e.g., '/ month', '/ year'
    stripe_price_id VARCHAR(255) NULL, -- Stripe Price ID for paid plans
    
    -- Specific feature columns
    max_ai_agents INTEGER NULL, -- NULL for unlimited
    max_tasks_per_month INTEGER NULL, -- NULL for unlimited
    ai_model_tier VARCHAR(50) NULL, -- e.g., 'basic', 'advanced', 'custom'
    analytics_tier VARCHAR(50) NULL, -- e.g., 'basic', 'advanced', 'custom'
    support_level VARCHAR(50) NULL, -- e.g., 'community', 'priority_email', 'dedicated_manager'
    api_access BOOLEAN DEFAULT FALSE,
    
    button_text VARCHAR(100) NULL, -- Text for the plan selection button
    is_featured BOOLEAN DEFAULT FALSE, -- To highlight a specific plan
    display_order INTEGER DEFAULT 0, -- To control the display order in UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index on display_order if you query by it frequently
CREATE INDEX IF NOT EXISTS idx_plans_display_order ON plans(display_order);
