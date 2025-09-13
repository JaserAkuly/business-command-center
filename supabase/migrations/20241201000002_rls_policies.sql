-- Enable RLS on all tables
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_envelope_tx ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_sales_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE staffing_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles_wages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create function to get user's org_id
CREATE OR REPLACE FUNCTION auth.get_user_org_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'org_id')::UUID,
    -- Fallback for demo purposes - in real app, this would be properly set
    '00000000-0000-0000-0000-000000000001'::UUID
  );
$$;

-- Orgs policies
CREATE POLICY "Users can view their own org"
  ON orgs FOR SELECT
  USING (id = auth.get_user_org_id());

CREATE POLICY "Users can update their own org"
  ON orgs FOR UPDATE
  USING (id = auth.get_user_org_id());

-- Venues policies
CREATE POLICY "Users can view venues in their org"
  ON venues FOR SELECT
  USING (org_id = auth.get_user_org_id());

CREATE POLICY "Users can insert venues in their org"
  ON venues FOR INSERT
  WITH CHECK (org_id = auth.get_user_org_id());

CREATE POLICY "Users can update venues in their org"
  ON venues FOR UPDATE
  USING (org_id = auth.get_user_org_id());

CREATE POLICY "Users can delete venues in their org"
  ON venues FOR DELETE
  USING (org_id = auth.get_user_org_id());

-- Growth goals policies
CREATE POLICY "Users can view growth goals for their org"
  ON growth_goals FOR SELECT
  USING (org_id = auth.get_user_org_id());

CREATE POLICY "Users can insert growth goals for their org"
  ON growth_goals FOR INSERT
  WITH CHECK (org_id = auth.get_user_org_id());

CREATE POLICY "Users can update growth goals for their org"
  ON growth_goals FOR UPDATE
  USING (org_id = auth.get_user_org_id());

-- Cash envelopes policies
CREATE POLICY "Users can view cash envelopes for their venues"
  ON cash_envelopes FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert cash envelopes for their venues"
  ON cash_envelopes FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update cash envelopes for their venues"
  ON cash_envelopes FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Cash envelope transactions policies
CREATE POLICY "Users can view cash envelope tx for their venues"
  ON cash_envelope_tx FOR SELECT
  USING (envelope_id IN (
    SELECT ce.id FROM cash_envelopes ce 
    JOIN venues v ON ce.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can insert cash envelope tx for their venues"
  ON cash_envelope_tx FOR INSERT
  WITH CHECK (envelope_id IN (
    SELECT ce.id FROM cash_envelopes ce 
    JOIN venues v ON ce.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

-- POS sales daily policies
CREATE POLICY "Users can view pos sales for their venues"
  ON pos_sales_daily FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert pos sales for their venues"
  ON pos_sales_daily FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update pos sales for their venues"
  ON pos_sales_daily FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Staffing targets policies
CREATE POLICY "Users can view staffing targets for their venues"
  ON staffing_targets FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert staffing targets for their venues"
  ON staffing_targets FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update staffing targets for their venues"
  ON staffing_targets FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Roles wages policies
CREATE POLICY "Users can view roles wages for their venues"
  ON roles_wages FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert roles wages for their venues"
  ON roles_wages FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update roles wages for their venues"
  ON roles_wages FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Shifts policies
CREATE POLICY "Users can view shifts for their venues"
  ON shifts FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert shifts for their venues"
  ON shifts FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update shifts for their venues"
  ON shifts FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can delete shifts for their venues"
  ON shifts FOR DELETE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- SKUs policies
CREATE POLICY "Users can view skus for their venues"
  ON skus FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert skus for their venues"
  ON skus FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update skus for their venues"
  ON skus FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can delete skus for their venues"
  ON skus FOR DELETE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Inventory counts policies
CREATE POLICY "Users can view inventory counts for their venues"
  ON inventory_counts FOR SELECT
  USING (sku_id IN (
    SELECT s.id FROM skus s 
    JOIN venues v ON s.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can insert inventory counts for their venues"
  ON inventory_counts FOR INSERT
  WITH CHECK (sku_id IN (
    SELECT s.id FROM skus s 
    JOIN venues v ON s.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can update inventory counts for their venues"
  ON inventory_counts FOR UPDATE
  USING (sku_id IN (
    SELECT s.id FROM skus s 
    JOIN venues v ON s.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

-- Purchase orders policies
CREATE POLICY "Users can view purchase orders for their venues"
  ON purchase_orders FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert purchase orders for their venues"
  ON purchase_orders FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can update purchase orders for their venues"
  ON purchase_orders FOR UPDATE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can delete purchase orders for their venues"
  ON purchase_orders FOR DELETE
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- PO lines policies
CREATE POLICY "Users can view po lines for their purchase orders"
  ON po_lines FOR SELECT
  USING (po_id IN (
    SELECT po.id FROM purchase_orders po 
    JOIN venues v ON po.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can insert po lines for their purchase orders"
  ON po_lines FOR INSERT
  WITH CHECK (po_id IN (
    SELECT po.id FROM purchase_orders po 
    JOIN venues v ON po.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can update po lines for their purchase orders"
  ON po_lines FOR UPDATE
  USING (po_id IN (
    SELECT po.id FROM purchase_orders po 
    JOIN venues v ON po.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

CREATE POLICY "Users can delete po lines for their purchase orders"
  ON po_lines FOR DELETE
  USING (po_id IN (
    SELECT po.id FROM purchase_orders po 
    JOIN venues v ON po.venue_id = v.id 
    WHERE v.org_id = auth.get_user_org_id()
  ));

-- AI insights policies
CREATE POLICY "Users can view ai insights for their venues"
  ON ai_insights FOR SELECT
  USING (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

CREATE POLICY "Users can insert ai insights for their venues"
  ON ai_insights FOR INSERT
  WITH CHECK (venue_id IN (SELECT id FROM venues WHERE org_id = auth.get_user_org_id()));

-- Plans and feature flags are read-only for all users
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans"
  ON plans FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view feature flags"
  ON feature_flags FOR SELECT
  USING (true);