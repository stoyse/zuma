-- filepath: /Users/julianstosse/Developer/zuma/api/database/insert_plans_data.sql

-- Clear existing data to avoid conflicts if script is run multiple times
-- DELETE FROM plans;

-- Insert Free Tier Plan
INSERT INTO plans (
    id,
    name,
    description,
    price_amount,
    price_currency,
    frequency_per_unit,
    stripe_price_id,
    -- Specific features
    max_ai_agents,
    max_tasks_per_month,
    ai_model_tier,
    analytics_tier,
    support_level,
    api_access,
    button_text,
    is_featured,
    display_order
) VALUES (
    'free',
    'Free Tier',
    'Get started with our basic features for free.',
    0.00,
    'USD',
    '/ month',
    NULL, -- No Stripe Price ID for free plan
    -- Feature values
    1,
    100,
    'basic',
    'basic',
    'community',
    FALSE,
    'Select Free Plan',
    FALSE,
    1
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_amount = EXCLUDED.price_amount,
    price_currency = EXCLUDED.price_currency,
    frequency_per_unit = EXCLUDED.frequency_per_unit,
    stripe_price_id = EXCLUDED.stripe_price_id,
    max_ai_agents = EXCLUDED.max_ai_agents,
    max_tasks_per_month = EXCLUDED.max_tasks_per_month,
    ai_model_tier = EXCLUDED.ai_model_tier,
    analytics_tier = EXCLUDED.analytics_tier,
    support_level = EXCLUDED.support_level,
    api_access = EXCLUDED.api_access,
    button_text = EXCLUDED.button_text,
    is_featured = EXCLUDED.is_featured,
    display_order = EXCLUDED.display_order,
    updated_at = CURRENT_TIMESTAMP;

-- Insert Pro Plan
INSERT INTO plans (
    id,
    name,
    description,
    price_amount,
    price_currency,
    frequency_per_unit,
    stripe_price_id,
    -- Specific features
    max_ai_agents,
    max_tasks_per_month,
    ai_model_tier,
    analytics_tier,
    support_level,
    api_access,
    button_text,
    is_featured,
    display_order
) VALUES (
    'pro',
    'Pro Plan',
    'Unlock advanced features and higher limits for professionals.',
    49.00,
    'USD',
    '/ month',
    'price_1Ra8hOIgMlIzBuZNLLjAlT6T', -- ERSETZE DAS DURCH DEINE ECHTE STRIPE PRICE ID
    -- Feature values
    10,
    5000,
    'advanced',
    'advanced',
    'priority_email',
    TRUE,
    'Select Pro Plan',
    TRUE, -- Pro plan is featured
    2
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_amount = EXCLUDED.price_amount,
    price_currency = EXCLUDED.price_currency,
    frequency_per_unit = EXCLUDED.frequency_per_unit,
    stripe_price_id = EXCLUDED.stripe_price_id,
    max_ai_agents = EXCLUDED.max_ai_agents,
    max_tasks_per_month = EXCLUDED.max_tasks_per_month,
    ai_model_tier = EXCLUDED.ai_model_tier,
    analytics_tier = EXCLUDED.analytics_tier,
    support_level = EXCLUDED.support_level,
    api_access = EXCLUDED.api_access,
    button_text = EXCLUDED.button_text,
    is_featured = EXCLUDED.is_featured,
    display_order = EXCLUDED.display_order,
    updated_at = CURRENT_TIMESTAMP;

-- Note: For the Enterprise plan, you would typically set max_ai_agents and max_tasks_per_month to NULL (or a very high number)
-- to represent 'unlimited', and ai_model_tier, analytics_tier, support_level to 'custom' or 'dedicated_manager'.

SELECT * FROM plans ORDER BY display_order;
