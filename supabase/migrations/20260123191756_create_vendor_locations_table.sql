/*
  # Criar tabela de localizações dos vendedores

  1. Nova Tabela
    - `vendor_locations`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key to profiles)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `accuracy` (decimal, opcional)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Segurança
    - Habilitar RLS na tabela `vendor_locations`
    - Adicionar política para acesso público (leitura e escrita)
    - Índices para melhor performance

  3. Observações
    - Esta tabela armazena o histórico de localizações dos vendedores
    - Permite rastreamento em tempo real no mapa do Mapbox
*/

-- Criar tabela de localizações dos vendedores
CREATE TABLE IF NOT EXISTS vendor_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  accuracy decimal,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE vendor_locations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (acesso público para facilitar)
CREATE POLICY "Public access to vendor_locations"
  ON vendor_locations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_vendor_locations_vendor_id ON vendor_locations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_locations_timestamp ON vendor_locations(timestamp DESC);
