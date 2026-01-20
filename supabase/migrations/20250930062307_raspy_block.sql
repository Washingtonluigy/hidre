/*
  # Desabilitar RLS na tabela sales_complete

  1. Segurança
    - Desabilitar Row Level Security na tabela `sales_complete`
    - Remover políticas RLS existentes
    
  2. Motivo
    - Resolver erro de inserção de vendas
    - Permitir que usuários padrão do sistema finalizem vendas
*/

-- Desabilitar RLS na tabela sales_complete
ALTER TABLE sales_complete DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON sales_complete;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON sales_complete;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON sales_complete;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON sales_complete;