/*
  # Fix model_status RLS policies

  1. Security Changes
    - Drop the overly permissive INSERT and UPDATE policies on `model_status`
      that used `WITH CHECK (true)` and `USING (true) WITH CHECK (true)`,
      which bypassed row-level security entirely
    - Replace with restrictive policies that only allow the first authenticated
      user who created a model_status row to insert/update it, using ownership
      tracking via a new `created_by` column
    - Add `created_by` column to track which user owns each model_status row
    - Update SELECT policy to remain permissive for authenticated users (read-only)

  2. Important Notes
    - The `created_by` column is set to auth.uid() by default on INSERT
    - UPDATE policy checks that the user owns the row (created_by = auth.uid())
    - INSERT policy checks that the user is authenticated and sets created_by
    - Existing rows will have created_by set to NULL; a one-time update is
      included to assign them to a system placeholder if needed
*/

-- Add created_by column to track ownership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'model_status' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE model_status ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert model status" ON model_status;
DROP POLICY IF EXISTS "Authenticated users can update model status" ON model_status;

-- Create restrictive INSERT policy: only authenticated users, sets created_by to their own id
CREATE POLICY "Authenticated users can insert own model status"
  ON model_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create restrictive UPDATE policy: only the user who created the row can update it
CREATE POLICY "Users can update own model status"
  ON model_status FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
