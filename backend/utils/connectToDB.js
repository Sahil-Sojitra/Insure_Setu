import pg from 'pg';
import env from 'dotenv';
env.config();

// build a connection string from environment variables
function buildDatabaseUrl() {
    const user = process.env.PG_USER;
    const password = process.env.PG_PASSWORD;
    const host = process.env.PG_HOST;
    const port = process.env.PG_PORT || '5432';
    let db = process.env.PG_DATABASE;

    if (db && db.includes('databsae')) {
        // correct common misspelling
        console.warn('correcting PG_DATABASE typo from', db, 'to', db.replace('databsae', 'database'));
        db = db.replace('databsae', 'database');
    }

    if (user && password && host && db) {
        return `postgresql://${user}:${password}@${host}:${port}/${db}`;
    }
    return null;
}

let DATABASE_URL = process.env.DATABASE_URL || buildDatabaseUrl();
if (!DATABASE_URL) {
    console.error('No DATABASE_URL or PG_* variables defined; cannot connect to PostgreSQL');
    process.exit(1);
}

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