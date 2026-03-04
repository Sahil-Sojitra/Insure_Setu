import pg from 'pg';
import env from 'dotenv';
env.config();

const DATABASE_URL = process.env.DATABASE_URL ;

console.log('Attempting to connect to database with URL:', DATABASE_URL);

const db = new pg.Pool({
    connectionString: DATABASE_URL,
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