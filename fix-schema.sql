
    -- Check and fix product_variants table
    DO $$
    BEGIN
      -- Add sku_suffix column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'product_variants'
        AND column_name = 'sku_suffix'
      ) THEN
        ALTER TABLE product_variants ADD COLUMN sku_suffix TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added sku_suffix column';
      ELSE
        RAISE NOTICE 'sku_suffix column already exists';
      END IF;

      -- Fix unique constraint
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'product_variants_product_id_sku_suffix_key'
        AND table_name = 'product_variants'
      ) THEN
        ALTER TABLE product_variants DROP CONSTRAINT product_variants_product_id_sku_suffix_key;
      END IF;

      ALTER TABLE product_variants
        ADD CONSTRAINT product_variants_product_id_sku_suffix_key
        UNIQUE(product_id, sku_suffix);

      RAISE NOTICE 'Schema fix completed';
    END $$;
  