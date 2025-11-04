import { winstonLogger } from '@veckovn/growvia-shared';
import { Logger } from 'winston';
import { config } from '@order/config';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderService', 'debug');
const isDocker = config.RUNNING_IN_DOCKER === '1';


const pool:Pool = new Pool({
    user: `${config.POSTGRESQL_USER}`,
    password: `${config.POSTGRESQL_PASSWORD}`,
    host: isDocker ? config.POSTGRESQL_HOST : '',
    port: 5432,
    database: `${config.POSTGRESQL_NAME}`,
})

pool.on('error', (err: Error) => {
    log.log("error", "Client PG(PostgreSQL) error: ", err.message);
    process.exit(-1); 
})

//order_ID is UUID

const orderTable = `
    -- Create the extension for UUID generation if it's not already enabled
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS public.orders (
        order_id UUID DEFAULT uuid_generate_v4(),  -- UUID for unique order ID
        farmer_id TEXT NOT NULL,  -- Farmer ID from User Serivce
        farmer_username TEXT,
        farm_name TEXT, 
        customer_id TEXT NOT NULL,  -- Customer id from User Service
        customer_username TEXT, 
        customer_email TEXT,  -- Form 'email' doesn't have to match User Service 'email'
        customer_first_name TEXT,  -- Form 'customer_first_name' doesn't have to match User Service 'first_name'
        customer_last_name TEXT, -- Form 'customer_last_name' doesn't have to match User Service 'last_name'
        customer_phone TEXT,  -- Form 'customer_phone' doesn't have to match User Service 'phone'
        farmer_email TEXT,
        invoice_id TEXT,
        total_price DECIMAL(10, 2) NOT NULL,
        payment_status VARCHAR(50),
        order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_intent_id VARCHAR(255),
        payment_method VARCHAR(225),
        payment_method_id VARCHAR(255),
        payment_type VARCHAR(50),
        shipping_address TEXT, -- Contian address and city together 'Address,City'
        shipping_postal_code TEXT,
        billing_address TEXT,
        delivery_date TIMESTAMP,
        payment_expires_at TIMESTAMP,
        tracking_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (order_id)
    );
    
    -- Order items table links the order to the product using product_id (from the Product Service)
    CREATE TABLE IF NOT EXISTS public.order_items (
        order_item_id UUID DEFAULT uuid_generate_v4(),  -- UUID for unique order item ID
        order_id UUID NOT NULL,  -- Foreign key to the order
        product_id TEXT NOT NULL,  -- Product ID from Product Service
        product_name TEXT NOT NULL, --Save for snapshot (at the time of order creation)
        product_image_url TEXT NOT NULL, -- Save for snapshot (at the time of order creation)
        product_unit TEXT NOT NULL, -- Save for snapshot
        product_description TEXT, -- Save for snapshot
        quantity INT NOT NULL,  -- Number of products in the order
        unit_price DECIMAL(10, 2) NOT NULL,  -- Price of the product at the time of purchase
        total_price DECIMAL(10, 2) NOT NULL,  -- total price for this item (quantity * unit_price)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (order_item_id),
        FOREIGN KEY (order_id) REFERENCES public.orders(order_id)
    );

    DO $$
    BEGIN
        -- Create index on order_status if it does not exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname = 'idx_order_status'
        ) THEN
            CREATE INDEX idx_order_status ON public.orders (order_status);
        END IF;

        -- Create index on username if it does not exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname = 'idx_payment_status'
        ) THEN
            CREATE INDEX idx_payment_status ON public.orders (payment_status);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname = 'idx_customer_id'
        ) THEN
            CREATE INDEX idx_customer_id ON public.orders (customer_id);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname = 'idx_farmer_id'
        ) THEN
            CREATE INDEX idx_farmer_id ON public.orders (farmer_id);
        END IF;
    END $$;
`

 async function connectPool():Promise<void> {
    try{
        await pool.connect();
        await pool.query(orderTable);
        log.info("Order Service connected to postgreSQL DB");
    }
    catch(error){
        log.error("Order Service can't connect to postgreSQL DB");
        log.log("error", "Order Service postgreSQL connection failed: ", error);
    }
} 

export {connectPool, pool};