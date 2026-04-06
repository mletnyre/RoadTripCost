const express = require('express');
const cors = require('cors'); // import cors
const app = express();
const PORT = 5000;

app.use(cors()); // allow all origins (you can restrict later)
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// example API route
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});