/*
  # Remove foreign key constraint de vendor_id na tabela visits

  1. Alterações
    - Remove a constraint `visits_vendor_id_fkey` que exige que vendor_id exista em profiles
    - Isso permite que admins e outros usuários criem visitas sem estar na tabela profiles
  
  2. Motivo
    - A constraint estava impedindo que usuários admin criassem visitas
    - O admin não precisa necessariamente existir na tabela profiles
*/

-- Remove a constraint de vendor_id
ALTER TABLE visits DROP CONSTRAINT IF EXISTS visits_vendor_id_fkey;
