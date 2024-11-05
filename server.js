const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Nastavenie pripojenia k databáze
const pool = new Pool({
    user: 'your_username',      // Zmeň na svoje užívateľské meno PostgreSQL
    host: 'localhost',
    database: 'shopping_db',    // Názov tvojej databázy
    password: 'your_password',  // Zmeň na svoje heslo
    port: 5432,
});

app.use(express.json());

// Endpoint na získanie zoznamu z databázy
app.get('/api/shopping-list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_list');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba pri získavaní zoznamu' });
    }
});

// Endpoint na pridanie položky do zoznamu
app.post('/api/shopping-list', async (req, res) => {
    const { item } = req.body;
    try {
        await pool.query('INSERT INTO shopping_list (text) VALUES ($1)', [item]);
        res.json({ message: 'Položka pridaná!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba pri pridávaní položky' });
    }
});

// Endpoint na označenie položky ako dokončenej
app.put('/api/shopping-list/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('UPDATE shopping_list SET completed = NOT completed WHERE id = $1', [id]);
        res.json({ message: 'Položka aktualizovaná!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba pri aktualizácii položky' });
    }
});

// Endpoint na vymazanie celého zoznamu
app.delete('/api/shopping-list', async (req, res) => {
    try {
        await pool.query('DELETE FROM shopping_list');
        res.json({ message: 'Zoznam vymazaný!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba pri vymazávaní zoznamu' });
    }
});

app.listen(port, () => {
    console.log(`Server beží na http://localhost:${port}`);
});
