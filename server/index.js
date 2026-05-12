const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Placeholders)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Import and use routes
app.use('/api/habits', require('./routes/habits'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
