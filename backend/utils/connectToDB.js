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
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
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