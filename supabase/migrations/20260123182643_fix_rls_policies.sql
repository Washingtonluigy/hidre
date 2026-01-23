/*
  # Fix RLS policies to allow authenticated users to perform operations

  1. Changes
    - Drop restrictive policies that require admin role from profiles table
    - Create simpler policies that allow any authenticated user to perform operations
    - Keep RLS enabled but make policies less restrictive

  2. Security
    - All tables still require authentication
    - Focus on allowing authenticated users to work without complex role checks
*/

-- Drop all existing policies and recreate simpler ones

-- Products policies
DROP POLICY IF EXISTS "Admin users can insert products" ON products;
DROP POLICY IF EXISTS "Admin users can update products" ON products;
DROP POLICY IF EXISTS "Admin users can delete products" ON products;
DROP POLICY IF EXISTS "Products can be managed by admins" ON products;

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Services policies  
DROP POLICY IF EXISTS "Services can be managed by admins" ON services;

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Profiles policies
DROP POLICY IF EXISTS "Profiles can be created by authenticated users" ON profiles;

CREATE POLICY "Authenticated users can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Financial transactions policies
DROP POLICY IF EXISTS "Admin users can view transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Admin users can insert transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Admin users can update transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Admin users can delete transactions" ON financial_transactions;

CREATE POLICY "Authenticated users can view transactions"
  ON financial_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON financial_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON financial_transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON financial_transactions FOR DELETE
  TO authenticated
  USING (true);

-- Bank accounts policies
DROP POLICY IF EXISTS "Bank accounts are viewable by admins" ON bank_accounts;
DROP POLICY IF EXISTS "Bank accounts can be managed by admins" ON bank_accounts;

CREATE POLICY "Authenticated users can view bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage bank accounts"
  ON bank_accounts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Company info policies
DROP POLICY IF EXISTS "Company info can be managed by admins" ON company_info;

CREATE POLICY "Authenticated users can manage company info"
  ON company_info FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Customers policies (keep existing simple ones)
-- Already has good policies

-- Sales complete policies  
DROP POLICY IF EXISTS "Admin users can update sales" ON sales_complete;
DROP POLICY IF EXISTS "Admin users can delete sales" ON sales_complete;

CREATE POLICY "Authenticated users can update sales"
  ON sales_complete FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sales"
  ON sales_complete FOR DELETE
  TO authenticated
  USING (true);

-- Quotations policies
DROP POLICY IF EXISTS "Admin users can delete quotations" ON quotations;

CREATE POLICY "Authenticated users can delete quotations"
  ON quotations FOR DELETE
  TO authenticated
  USING (true);

-- Maintenances policies
DROP POLICY IF EXISTS "Admin users can delete maintenances" ON maintenances;

CREATE POLICY "Authenticated users can delete maintenances"
  ON maintenances FOR DELETE
  TO authenticated
  USING (true);