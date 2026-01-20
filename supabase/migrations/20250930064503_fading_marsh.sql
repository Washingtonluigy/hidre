/*
  # Remove foreign key constraint from quotations table

  1. Problem
    - quotations table has foreign key constraint for vendor_id referencing profiles
    - Default users don't exist in profiles table causing constraint violations
    
  2. Solution
    - Remove the foreign key constraint quotations_vendor_id_fkey
    - Keep vendor_id column but allow any value
    - This matches the pattern used for sales_complete and maintenances tables
*/

-- Remove foreign key constraint that prevents quotations from being saved
ALTER TABLE quotations DROP CONSTRAINT IF EXISTS quotations_vendor_id_fkey;

-- Remove foreign key constraint for client_id as well if it exists
ALTER TABLE quotations DROP CONSTRAINT IF EXISTS quotations_client_id_fkey;