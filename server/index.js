const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json()); // Allows server to read JSON data sent in body
app.use(cors());         // CRITICAL: Allows React to communicate with this server

// TEST ROUTE
app.get('/', (req, res) => {
    res.send("Hello from the Backend!");
});

// MOCK API ENDPOINT (We will replace this with Database later)
app.get('/api/test', (req, res) => {
    res.json({ message: "Axios is working!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

