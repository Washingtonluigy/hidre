/*
  # Remove authentication restrictions from RLS policies

  1. Changes
    - Drop all existing restrictive policies
    - Create public access policies for all tables
    - Allow both authenticated and anonymous users to perform all operations

  2. Security
    - RLS remains enabled but allows public access
    - No authentication required for any operations
*/

-- Drop all existing policies on all tables
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Products are viewable by authenticated users" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

DROP POLICY IF EXISTS "Services are viewable by authenticated users" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
DROP POLICY IF EXISTS "Admin users can delete customers" ON customers;

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Authenticated users can view transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Authenticated users can delete transactions" ON financial_transactions;

DROP POLICY IF EXISTS "Authenticated users can view bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Authenticated users can manage bank accounts" ON bank_accounts;

DROP POLICY IF EXISTS "Company info is viewable by authenticated users" ON company_info;
DROP POLICY IF EXISTS "Authenticated users can manage company info" ON company_info;

DROP POLICY IF EXISTS "Authenticated users can view sales" ON sales_complete;
DROP POLICY IF EXISTS "Authenticated users can insert sales" ON sales_complete;
DROP POLICY IF EXISTS "Authenticated users can update sales" ON sales_complete;
DROP POLICY IF EXISTS "Authenticated users can delete sales" ON sales_complete;
DROP POLICY IF EXISTS "Vendas podem ser visualizadas por usuários autenticados" ON sales_complete;
DROP POLICY IF EXISTS "Vendas podem ser inseridas por usuários autenticados" ON sales_complete;

DROP POLICY IF EXISTS "Sales are viewable by authenticated users" ON sales;
DROP POLICY IF EXISTS "Sales can be managed by authenticated users" ON sales;

DROP POLICY IF EXISTS "Authenticated users can view quotations" ON quotations;
DROP POLICY IF EXISTS "Authenticated users can insert quotations" ON quotations;
DROP POLICY IF EXISTS "Authenticated users can update quotations" ON quotations;
DROP POLICY IF EXISTS "Authenticated users can delete quotations" ON quotations;

DROP POLICY IF EXISTS "Authenticated users can view maintenances" ON maintenances;
DROP POLICY IF EXISTS "Authenticated users can insert maintenances" ON maintenances;
DROP POLICY IF EXISTS "Authenticated users can update maintenances" ON maintenances;
DROP POLICY IF EXISTS "Authenticated users can delete maintenances" ON maintenances;

DROP POLICY IF EXISTS "Visitas podem ser gerenciadas por usuários autenticados" ON visits;

-- Create public access policies for all tables

-- Products
CREATE POLICY "Public access to products"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Services
CREATE POLICY "Public access to services"
  ON services FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Customers
CREATE POLICY "Public access to customers"
  ON customers FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Profiles
CREATE POLICY "Public access to profiles"
  ON profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Financial transactions
CREATE POLICY "Public access to financial_transactions"
  ON financial_transactions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Bank accounts
CREATE POLICY "Public access to bank_accounts"
  ON bank_accounts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Company info
CREATE POLICY "Public access to company_info"
  ON company_info FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Sales complete
CREATE POLICY "Public access to sales_complete"
  ON sales_complete FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Sales
CREATE POLICY "Public access to sales"
  ON sales FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Quotations
CREATE POLICY "Public access to quotations"
  ON quotations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Maintenances
CREATE POLICY "Public access to maintenances"
  ON maintenances FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Visits
CREATE POLICY "Public access to visits"
  ON visits FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);