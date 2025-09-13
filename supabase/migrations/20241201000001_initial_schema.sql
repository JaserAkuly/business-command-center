-- Enable necessary extensions (gen_random_uuid is built-in)

-- Create custom types
CREATE TYPE venue_type AS ENUM ('restaurant', 'bar', 'lounge');
CREATE TYPE shift_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE insight_category AS ENUM ('cash', 'growth', 'labor', 'inventory', 'risk', 'opportunity');
CREATE TYPE insight_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE plan_type AS ENUM ('starter', 'premium');

-- Organizations table
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    type plan_type NOT NULL,
    price_monthly DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (name, type, price_monthly) VALUES 
('Starter', 'starter', 99.00),
('Premium', 'premium', 299.00);

-- Feature flags table
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    enabled_for_starter BOOLEAN DEFAULT FALSE,
    enabled_for_premium BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert feature flags
INSERT INTO feature_flags (name, description, enabled_for_starter, enabled_for_premium) VALUES
('cash_autopilot', 'Automated cash envelope allocation', FALSE, TRUE),
('real_time_labor_guardrail', 'Real-time labor cost monitoring', FALSE, TRUE),
('vendor_case_pack_optimization', 'Advanced inventory case-pack optimization', FALSE, TRUE),
('ai_insights', 'AI-powered business insights', FALSE, TRUE),
('advanced_reporting', 'Advanced analytics and custom reports', FALSE, TRUE);

-- Venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type venue_type NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Chicago',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth goals table
CREATE TABLE growth_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    target_units INTEGER NOT NULL,
    horizon_years DECIMAL(3,1) NOT NULL,
    estimated_cost_per_unit DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash envelopes table
CREATE TABLE cash_envelopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    target_pct DECIMAL(5,2) NOT NULL,
    current_balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, name)
);

-- Cash envelope transactions table
CREATE TABLE cash_envelope_tx (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    envelope_id UUID NOT NULL REFERENCES cash_envelopes(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS sales daily table
CREATE TABLE pos_sales_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    business_date DATE NOT NULL,
    gross_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
    comps DECIMAL(12,2) NOT NULL DEFAULT 0,
    discounts DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_collected DECIMAL(12,2) NOT NULL DEFAULT 0,
    guests INTEGER NOT NULL DEFAULT 0,
    check_count INTEGER NOT NULL DEFAULT 0,
    labor_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    labor_hours DECIMAL(8,2) NOT NULL DEFAULT 0,
    cogs_food DECIMAL(12,2) NOT NULL DEFAULT 0,
    cogs_liquor DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, business_date)
);

-- Staffing targets table
CREATE TABLE staffing_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    target_labor_pct DECIMAL(5,2) NOT NULL DEFAULT 32.5,
    min_on_shift INTEGER NOT NULL DEFAULT 2,
    max_on_shift INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id)
);

-- Roles and wages table
CREATE TABLE roles_wages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    hourly_wage DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, role_name)
);

-- Shifts table
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    scheduled_hours DECIMAL(5,2) NOT NULL,
    scheduled_cost DECIMAL(8,2) NOT NULL,
    status shift_status DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SKUs table
CREATE TABLE skus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- food, liquor, nonfood
    uom VARCHAR(20) NOT NULL, -- unit of measure (lb, bottle, case, etc)
    par INTEGER NOT NULL,
    lead_time_days INTEGER NOT NULL DEFAULT 1,
    safety_stock INTEGER NOT NULL DEFAULT 0,
    cost_per_uom DECIMAL(10,2) NOT NULL,
    case_pack_qty INTEGER,
    case_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory counts table
CREATE TABLE inventory_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
    business_date DATE NOT NULL,
    on_hand INTEGER NOT NULL DEFAULT 0,
    waste INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sku_id, business_date)
);

-- Purchase orders table
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_cost DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase order lines table
CREATE TABLE po_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI insights table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    business_date DATE NOT NULL,
    category insight_category NOT NULL,
    message TEXT NOT NULL,
    severity insight_severity DEFAULT 'medium',
    action_data JSONB, -- structured data for UI actions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_venues_org_id ON venues(org_id);
CREATE INDEX idx_pos_sales_venue_date ON pos_sales_daily(venue_id, business_date);
CREATE INDEX idx_cash_envelopes_venue_id ON cash_envelopes(venue_id);
CREATE INDEX idx_cash_envelope_tx_envelope_id ON cash_envelope_tx(envelope_id);
CREATE INDEX idx_cash_envelope_tx_date ON cash_envelope_tx(transaction_date);
CREATE INDEX idx_shifts_venue_start ON shifts(venue_id, start_time);
CREATE INDEX idx_skus_venue_id ON skus(venue_id);
CREATE INDEX idx_inventory_counts_sku_date ON inventory_counts(sku_id, business_date);
CREATE INDEX idx_po_lines_po_id ON po_lines(po_id);
CREATE INDEX idx_ai_insights_venue_date ON ai_insights(venue_id, business_date);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON orgs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_growth_goals_updated_at BEFORE UPDATE ON growth_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cash_envelopes_updated_at BEFORE UPDATE ON cash_envelopes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pos_sales_daily_updated_at BEFORE UPDATE ON pos_sales_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staffing_targets_updated_at BEFORE UPDATE ON staffing_targets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_wages_updated_at BEFORE UPDATE ON roles_wages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skus_updated_at BEFORE UPDATE ON skus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();