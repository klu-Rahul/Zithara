const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

const connectionString = 'postgresql://postgres:Rahultelugu88*@localhost:5433/postgres';
const client = new Client({
  connectionString: connectionString,
});

client.connect();

// Define an API endpoint to retrieve customer data
// ...

app.use(cors());

// Define an API endpoint to retrieve customer data
app.get('/api/customer-data', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM customer_data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
