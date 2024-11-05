const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Základný endpoint
app.get('/', (req, res) => {
    res.send('Server je aktívny a funguje!');
});

// Endpoint pre získanie zoznamu
app.get('/api/shopping-list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_list');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching shopping list:', error);
        res.status(500).send('Server Error');
    }
});

// Spustenie servera
app.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
