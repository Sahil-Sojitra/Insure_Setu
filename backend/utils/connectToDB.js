import pg from 'pg';
import env from 'dotenv';
env.config();

const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT'];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        
        throw new Error(`Environment variable ${varName} is not set.`);
        process.exit(1);  
    }
});


const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
    ssl: {
        rejectUnauthorized: false
    }
})



db.connect()
    .then(() => {
        console.log('Connected to the database successfully.');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    });


db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});


export const query = (text, params) => db.query(text, params);