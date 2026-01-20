/*
  # Add address field to customers table

  1. Changes
    - Add `address` column to `customers` table
    - This field stores the customer's address information

  2. Notes
    - Field is nullable to support existing records
    - No data migration needed as it's a new field
*/

-- Add address column to customers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'address'
  ) THEN
    ALTER TABLE customers ADD COLUMN address text;
  END IF;
END $$;
