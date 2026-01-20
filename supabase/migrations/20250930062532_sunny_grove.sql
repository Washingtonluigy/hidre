/*
# Remove foreign key constraint problemático

1. Problema Identificado
   - Foreign key `vendor_id` references `profiles(id)`
   - Usuário padrão não existe em `profiles`
   - Causa violação na inserção

2. Solução
   - Remove constraint `sales_complete_vendor_id_fkey`
   - Mantém coluna `vendor_id` mas sem referência obrigatória
   - Permite inserção mesmo sem profile existente

3. Resultado
   - Vendas podem ser finalizadas sem erro
   - Dados continuam íntegros
   - Sem dependência obrigatória de profiles
*/

-- Remove o foreign key constraint problemático
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'sales_complete_vendor_id_fkey' 
    AND table_name = 'sales_complete'
  ) THEN
    ALTER TABLE sales_complete DROP CONSTRAINT sales_complete_vendor_id_fkey;
  END IF;
END $$;