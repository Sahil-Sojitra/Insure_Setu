export const createCustomerTableQuery = `
CREATE TABLE customer_details (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(20)  NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    vehical_number VARCHAR(255),
    customer_name VARCHAR(255),
    landmark VARCHAR(255),
    vehicle_type VARCHAR(100),
    business_type VARCHAR(100),
    insurance_company VARCHAR(255),
    policy_plan VARCHAR(255),
    insurance_start_date DATE,
    insurance_end_date DATE,
    final_premium DECIMAL(10, 2),
    payment_type VARCHAR(50),
    od_or_net VARCHAR(50),
    variant VARCHAR(100),
    policy_document VARCHAR(255),
    agent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL
);

`;


export const getAllCustomersQuery = `
SELECT * FROM customer_details ;
`;

export const AddCustomerQuery = `
INSERT INTO customer_details (
    customer_id,
    vehical_number,
    customer_name,
    mobile,
    landmark,
    vehicle_type,
    business_type,
    insurance_company,
    policy_plan,
    insurance_start_date,
    insurance_end_date,
    final_premium,
    payment_type,
    od_or_net,
    variant,
    policy_document,
    agent_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
RETURNING *;`;


export const getCustomerByIdQuery = `
SELECT * FROM customer_details WHERE id = $1;
`;

export const deleteCustomerByIdQuery = `
DELETE FROM customer_details WHERE id = $1 RETURNING *;
`;

export const updateCustomerByIdQuery = `
UPDATE customer_details SET
vehical_number = $1,
customer_name = $2,
mobile = $3,
landmark = $4,
vehicle_type = $5,
business_type = $6,
insurance_company = $7,
policy_plan = $8,
insurance_start_date = $9,
insurance_end_date = $10,
final_premium = $11,   
payment_type = $12,
od_or_net = $13,
variant = $14,
policy_document = $15,
agent_id = $16
WHERE id = $17 RETURNING *;
`;


export const createCustomerAuthTableQuery = `
CREATE TABLE customer_details_auth (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(20)  NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    vehicle_number VARCHAR(255),
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_details(customer_id) ON DELETE CASCADE
);
`;

// Query to insert customer auth data when customer is created
export const AddCustomerAuthQuery = `
INSERT INTO customer_details_auth (
    customer_id,
    mobile,
    vehicle_number,
    otp_hash,
    otp_expiry
) VALUES ($1, $2, $3, NULL, NULL)
RETURNING *;
`;

// Query to check if customer exists in auth table
export const getCustomerAuthByMobileQuery = `
SELECT * FROM customer_details_auth WHERE mobile = $1;
`;

// Query to check customer auth by customer_id
export const getCustomerAuthByIdQuery = `
SELECT * FROM customer_details_auth WHERE customer_id = $1;
`;

// Query to update OTP in auth table
export const updateCustomerOTPQuery = `
UPDATE customer_details_auth SET
otp_hash = $1,
otp_expiry = $2
WHERE customer_id = $3
RETURNING *;
`;

// Query to verify customer login credentials
export const verifyCustomerLoginQuery = `
SELECT ca.*, cd.customer_name, cd.vehical_number as vehicle_reg_number
FROM customer_details_auth ca
INNER JOIN customer_details cd ON ca.customer_id = cd.customer_id
WHERE ca.mobile = $1 AND ca.vehicle_number = $2;
`;

// Query to delete customer auth data
export const deleteCustomerAuthByMobileQuery = `
DELETE FROM customer_details_auth WHERE mobile = $1 RETURNING *;
`;

// Query to update customer auth data when customer details are updated
export const updateCustomerAuthQuery = `
UPDATE customer_details_auth SET
vehicle_number = $1
WHERE customer_id = $2
RETURNING *;
`;

// Query to get customer by customer_id
export const getCustomerByCustomerIdQuery = `
SELECT * FROM customer_details WHERE customer_id = $1;
`;

// Query to Create the Agent Table 
export const createAgentTableQuery = `
CREATE TABLE agents (
    agent_id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Query to add a new agent
export const addAgentQuery = `
INSERT INTO agents (agent_name, email, mobile)
VALUES ($1, $2, $3) RETURNING *;
`;

// Query to get agent by email
export const getAgentByEmailQuery = `
SELECT * FROM agents WHERE email = $1;
`;

// Query to get agent by ID
export const getAgentByIdQuery = `
SELECT * FROM agents WHERE agent_id = $1;
`;

// Query to get all agents
export const getAllAgentsQuery = `
SELECT * FROM agents;
`;

// Query to delete agent by ID
export const deleteAgentByIdQuery = `
DELETE FROM agents WHERE agent_id = $1 RETURNING *;
`;

// Query to update agent by ID
export const updateAgentByIdQuery = `
UPDATE agents SET 
agent_name = $1,
email = $2,
mobile = $3
WHERE agent_id = $4 RETURNING *;
`;

// Query to create agent authentication table
export const createAgentAuthTableQuery = `
CREATE TABLE agent_auth (
    id SERIAL PRIMARY KEY,
    agent_id INT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE
);
`;

// Query to add agent auth data automatically when agent is created
export const addAgentAuthQuery = `
INSERT INTO agent_auth (
    agent_id,
    mobile,
    otp_hash,
    otp_expiry
) VALUES ($1, $2, NULL, NULL)
RETURNING *;
`;

// Query to get agent auth by mobile
export const getAgentAuthByMobileQuery = `
SELECT * FROM agent_auth WHERE mobile = $1;
`;

// Query to update agent OTP
export const updateAgentOTPQuery = `
UPDATE agent_auth SET
otp_hash = $1,
otp_expiry = $2
WHERE agent_id = $3
RETURNING *;
`;

// Query to verify agent login credentials
export const verifyAgentLoginQuery = `
SELECT aa.*, a.agent_name, a.email
FROM agent_auth aa
INNER JOIN agents a ON aa.agent_id = a.agent_id
WHERE aa.mobile = $1;
`;

// Query to get customers by agent ID
export const getCustomersByAgentIdQuery = `
SELECT * FROM customer_details WHERE agent_id = $1 ORDER BY created_at DESC;
`;

// Query to get customer count by agent ID
export const getCustomerCountByAgentIdQuery = `
SELECT COUNT(*) as customer_count FROM customer_details WHERE agent_id = $1;
`;

// Query to add migration for existing customers (set default agent_id)
export const addAgentIdToExistingCustomersQuery = `
ALTER TABLE customer_details ADD COLUMN IF NOT EXISTS agent_id INT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

// Query to add foreign key constraint for agent_id
export const addAgentForeignKeyQuery = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'customer_details_agent_id_fkey') THEN
        ALTER TABLE customer_details 
        ADD CONSTRAINT customer_details_agent_id_fkey 
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL;
    END IF;
END $$;
`;