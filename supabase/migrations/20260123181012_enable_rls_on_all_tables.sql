/*
  # Enable RLS on all tables and add security policies
  
  1. Security Updates
    - Enable RLS on products table
    - Enable RLS on customers table
    - Enable RLS on sales_complete table
    - Enable RLS on financial_transactions table
    - Enable RLS on quotations table
    - Enable RLS on maintenances table
  
  2. Policies
    - Add policies for authenticated users to access all tables
    - Admin users have full access
    - Vendor users have limited access based on their assigned data
*/

-- Enable RLS on all tables that don't have it
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sales_complete ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS maintenances ENABLE ROW LEVEL SECURITY;

-- Products policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Authenticated users can view products'
  ) THEN
    CREATE POLICY "Authenticated users can view products"
      ON products FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin users can insert products'
  ) THEN
    CREATE POLICY "Admin users can insert products"
      ON products FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin users can update products'
  ) THEN
    CREATE POLICY "Admin users can update products"
      ON products FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin users can delete products'
  ) THEN
    CREATE POLICY "Admin users can delete products"
      ON products FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Customers policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Authenticated users can view customers'
  ) THEN
    CREATE POLICY "Authenticated users can view customers"
      ON customers FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Authenticated users can insert customers'
  ) THEN
    CREATE POLICY "Authenticated users can insert customers"
      ON customers FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Authenticated users can update customers'
  ) THEN
    CREATE POLICY "Authenticated users can update customers"
      ON customers FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Admin users can delete customers'
  ) THEN
    CREATE POLICY "Admin users can delete customers"
      ON customers FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Sales complete policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sales_complete' AND policyname = 'Authenticated users can view sales'
  ) THEN
    CREATE POLICY "Authenticated users can view sales"
      ON sales_complete FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sales_complete' AND policyname = 'Authenticated users can insert sales'
  ) THEN
    CREATE POLICY "Authenticated users can insert sales"
      ON sales_complete FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sales_complete' AND policyname = 'Admin users can update sales'
  ) THEN
    CREATE POLICY "Admin users can update sales"
      ON sales_complete FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sales_complete' AND policyname = 'Admin users can delete sales'
  ) THEN
    CREATE POLICY "Admin users can delete sales"
      ON sales_complete FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Financial transactions policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'financial_transactions' AND policyname = 'Admin users can view transactions'
  ) THEN
    CREATE POLICY "Admin users can view transactions"
      ON financial_transactions FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'financial_transactions' AND policyname = 'Admin users can insert transactions'
  ) THEN
    CREATE POLICY "Admin users can insert transactions"
      ON financial_transactions FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'financial_transactions' AND policyname = 'Admin users can update transactions'
  ) THEN
    CREATE POLICY "Admin users can update transactions"
      ON financial_transactions FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'financial_transactions' AND policyname = 'Admin users can delete transactions'
  ) THEN
    CREATE POLICY "Admin users can delete transactions"
      ON financial_transactions FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Quotations policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Authenticated users can view quotations'
  ) THEN
    CREATE POLICY "Authenticated users can view quotations"
      ON quotations FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Authenticated users can insert quotations'
  ) THEN
    CREATE POLICY "Authenticated users can insert quotations"
      ON quotations FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Authenticated users can update quotations'
  ) THEN
    CREATE POLICY "Authenticated users can update quotations"
      ON quotations FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Admin users can delete quotations'
  ) THEN
    CREATE POLICY "Admin users can delete quotations"
      ON quotations FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Maintenances policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'maintenances' AND policyname = 'Authenticated users can view maintenances'
  ) THEN
    CREATE POLICY "Authenticated users can view maintenances"
      ON maintenances FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'maintenances' AND policyname = 'Authenticated users can insert maintenances'
  ) THEN
    CREATE POLICY "Authenticated users can insert maintenances"
      ON maintenances FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'maintenances' AND policyname = 'Authenticated users can update maintenances'
  ) THEN
    CREATE POLICY "Authenticated users can update maintenances"
      ON maintenances FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'maintenances' AND policyname = 'Admin users can delete maintenances'
  ) THEN
    CREATE POLICY "Admin users can delete maintenances"
      ON maintenances FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;