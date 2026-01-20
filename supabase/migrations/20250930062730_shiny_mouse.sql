/*
  # Remover foreign key constraint problemático da tabela maintenances

  1. Problema Identificado
    - Foreign key `maintenances_vendor_id_fkey` causa erro
    - Usuário padrão não existe na tabela `profiles`
    - Impede inserção de agendamentos de manutenção

  2. Solução
    - Remover constraint `maintenances_vendor_id_fkey`
    - Manter coluna `vendor_id` funcional
    - Permitir agendamentos sem dependência de profiles
*/

-- Remover foreign key constraint que está causando erro
ALTER TABLE maintenances 
DROP CONSTRAINT IF EXISTS maintenances_vendor_id_fkey;