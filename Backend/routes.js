import express from 'express';
import axios from 'axios';
import pg from 'pg';


const app = express();
const port = process.env.PORT || 3000;

const client = new pg.Client({
    user: 'postgres',
    host: "localhost",
    database: "iss_tracker",
    password: "BentleyErSød!",
    port: 5432,
});

client.connect();

/*client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error while connecting to database:', err);
    } else {
        console.log('Connection to database successful:', res.rows[0]);
    }
});*/

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
        console.error('Error while fecthing ISS position data:', error);
    }
};

fetchISSPosition();

app.get('/api/iss-position', async (req, res) => {
    const result = await client.query('SELECT * FROM iss_positions ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0]);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
