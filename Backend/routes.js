import express from 'express';
import axios from 'axios';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});


client.connect();

app.use(cors());

const fetchISSPosition = async () => {
    try {
        const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
        console.log('API Response:', response.data);

        const latitude = response.data.latitude;
        const longitude = response.data.longitude;
        const timestamp = new Date();

        await client.query('INSERT INTO iss_positions(latitude, longitude, timestamp) VALUES($1, $2, $3)', [latitude, longitude, timestamp]);

        console.log('ISS data saved in database:', latitude, longitude, timestamp);
    } catch (error) {
        console.error('Error while fetching ISS position data:', error);
    }
};

fetchISSPosition();


app.get('/api/iss-position', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM iss_positions ORDER BY timestamp DESC LIMIT 1');
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching the latest ISS position from database:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});