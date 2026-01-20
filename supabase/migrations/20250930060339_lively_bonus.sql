/*
  # Corrigir tabela de vendas completas

  1. Tabelas
    - Garantir que `sales_complete` existe com estrutura correta
    - Adicionar `image_url` na tabela `products`
    - Verificar tabela `visits` para calendário

  2. Segurança
    - Habilitar RLS nas tabelas necessárias
    - Políticas para permitir vendas

  3. Correções
    - Estrutura correta para evitar erros de inserção
    - Campos obrigatórios com defaults
*/

-- Adicionar coluna image_url na tabela products se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN image_url text;
  END IF;
END $$;

-- Criar ou garantir tabela sales_complete com estrutura correta
CREATE TABLE IF NOT EXISTS sales_complete (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES customers(id),
  vendor_id uuid REFERENCES profiles(id),
  items jsonb DEFAULT '[]'::jsonb,
  subtotal numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  total numeric DEFAULT 0,
  payment_method text DEFAULT 'money',
  installments integer DEFAULT 1,
  observations text DEFAULT '',
  status text DEFAULT 'completed',
  sale_date text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE sales_complete ENABLE ROW LEVEL SECURITY;

-- Política para vendas
CREATE POLICY "Vendas podem ser visualizadas por usuários autenticados"
  ON sales_complete
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendas podem ser inseridas por usuários autenticados"
  ON sales_complete
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Garantir tabela visits existe
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_id uuid REFERENCES customers(id),
  vendor_id uuid REFERENCES profiles(id),
  scheduled_date timestamptz NOT NULL,
  status text DEFAULT 'scheduled',
  notes text DEFAULT '',
  follow_up_date timestamptz,
  rejection_reason text,
  maintenance_type text,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitas podem ser gerenciadas por usuários autenticados"
  ON visits
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);