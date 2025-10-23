

export const addPolicyDocumentColumnQuery = `
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customer_details' 
        AND column_name = 'policy_document'
    ) THEN
        ALTER TABLE customer_details 
        ADD COLUMN policy_document VARCHAR(255);
    END IF;
END $$;
`;

// Migration to implement customer_id based relationship
export const implementCustomerIdRelationshipQuery = `
DO $$
BEGIN
    -- Step 1: Update customer_details table structure
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_details') THEN
        
        -- Add customer_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'customer_details' AND column_name = 'customer_id'
        ) THEN
            ALTER TABLE customer_details ADD COLUMN customer_id VARCHAR(20);
            
            -- Generate customer_id for existing records
            UPDATE customer_details SET 
                customer_id = SUBSTRING(mobile, 1, 4) || 
                             RIGHT(REGEXP_REPLACE(UPPER(vehical_number), '[^A-Z0-9]', '', 'g') || '000000', 6)
            WHERE customer_id IS NULL AND mobile IS NOT NULL AND vehical_number IS NOT NULL;
            
            -- Make customer_id NOT NULL and UNIQUE
            ALTER TABLE customer_details ALTER COLUMN customer_id SET NOT NULL;
            
            -- Add unique constraint only if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.table_constraints 
                WHERE table_name = 'customer_details' 
                AND constraint_name = 'customer_details_customer_id_unique'
                AND constraint_type = 'UNIQUE'
            ) THEN
                ALTER TABLE customer_details ADD CONSTRAINT customer_details_customer_id_unique UNIQUE (customer_id);
            END IF;
        END IF;
        
        -- Ensure id column exists as SERIAL PRIMARY KEY
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'customer_details' 
            AND column_name = 'id' 
            AND data_type = 'integer'
        ) THEN
            ALTER TABLE customer_details ADD COLUMN id SERIAL PRIMARY KEY;
        END IF;
    END IF;
    
    -- Step 2: Handle customer_details_auth table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_details_auth') THEN
        -- Drop foreign key constraints first
        ALTER TABLE customer_details_auth DROP CONSTRAINT IF EXISTS customer_details_auth_mobile_fkey;
        ALTER TABLE customer_details_auth DROP CONSTRAINT IF EXISTS customer_details_auth_customer_id_fkey;
        
        -- Add customer_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'customer_details_auth' AND column_name = 'customer_id'
        ) THEN
            ALTER TABLE customer_details_auth ADD COLUMN customer_id VARCHAR(20);
        END IF;
        
        -- Update customer_id in auth table based on mobile number match
        UPDATE customer_details_auth 
        SET customer_id = cd.customer_id
        FROM customer_details cd 
        WHERE customer_details_auth.mobile = cd.mobile 
        AND customer_details_auth.customer_id IS NULL;
        
        -- Make customer_id NOT NULL and UNIQUE
        DELETE FROM customer_details_auth WHERE customer_id IS NULL;
        ALTER TABLE customer_details_auth ALTER COLUMN customer_id SET NOT NULL;
        
        -- Add unique constraint only if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE table_name = 'customer_details_auth' 
            AND constraint_name = 'customer_details_auth_customer_id_unique'
            AND constraint_type = 'UNIQUE'
        ) THEN
            ALTER TABLE customer_details_auth ADD CONSTRAINT customer_details_auth_customer_id_unique UNIQUE (customer_id);
        END IF;
        
        -- Add foreign key constraint
        ALTER TABLE customer_details_auth 
        ADD CONSTRAINT customer_details_auth_customer_id_fkey 
        FOREIGN KEY (customer_id) REFERENCES customer_details(customer_id) ON DELETE CASCADE;
        
    END IF;
END $$;
`;
// Migration to ensure mobile-based relationship between tables
export const ensureMobileRelationshipQuery = `
DO $$
BEGIN
    -- Check if customer_details table exists and ensure mobile column has unique constraint
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_details') THEN
        
        -- Add id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'customer_details' AND column_name = 'id'
        ) THEN
            ALTER TABLE customer_details ADD COLUMN id SERIAL PRIMARY KEY;
        END IF;
        
        -- Ensure mobile column has unique constraint
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = 'customer_details' 
            AND kcu.column_name = 'mobile'
            AND tc.constraint_type = 'UNIQUE'
        ) THEN
            -- First make sure mobile values are actually unique (remove duplicates if any)
            DELETE FROM customer_details 
            WHERE ctid NOT IN (
                SELECT MIN(ctid) 
                FROM customer_details 
                GROUP BY mobile
            );
            
            -- Add unique constraint only if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.table_constraints 
                WHERE table_name = 'customer_details' 
                AND constraint_name = 'customer_details_mobile_unique'
                AND constraint_type = 'UNIQUE'
            ) THEN
                ALTER TABLE customer_details ADD CONSTRAINT customer_details_mobile_unique UNIQUE (mobile);
            END IF;
        END IF;
        
        -- Ensure mobile column is NOT NULL
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'customer_details' 
            AND column_name = 'mobile' 
            AND is_nullable = 'YES'
        ) THEN
            UPDATE customer_details SET mobile = 'UNKNOWN_' || id WHERE mobile IS NULL;
            ALTER TABLE customer_details ALTER COLUMN mobile SET NOT NULL;
        END IF;
    END IF;
END $$;
`;

// Migration to allow multiple policies per mobile number
export const allowMultiplePoliciesPerMobileQuery = `
DO $$
BEGIN
    -- Remove unique constraint on mobile to allow multiple policies per mobile number
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'customer_details' 
        AND constraint_name = 'customer_details_mobile_unique'
        AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE customer_details DROP CONSTRAINT customer_details_mobile_unique;
        RAISE NOTICE 'Removed unique constraint on mobile column to allow multiple policies per mobile number';
    END IF;
    
    -- Ensure vehicle number has unique constraint (one policy per vehicle)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'customer_details' 
        AND kcu.column_name = 'vehical_number'
        AND tc.constraint_type = 'UNIQUE'
    ) THEN
        -- First remove any duplicate vehicle numbers (keep the latest one)
        DELETE FROM customer_details 
        WHERE id NOT IN (
            SELECT MAX(id) 
            FROM customer_details 
            WHERE vehical_number IS NOT NULL 
            GROUP BY vehical_number
        ) AND vehical_number IS NOT NULL;
        
        -- Add unique constraint on vehicle number
        ALTER TABLE customer_details ADD CONSTRAINT customer_details_vehical_number_unique UNIQUE (vehical_number);
        RAISE NOTICE 'Added unique constraint on vehical_number to ensure one policy per vehicle';
    END IF;
    
END $$;
`;