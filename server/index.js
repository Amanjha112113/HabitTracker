const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'HabitTracker Backend is running!', usage: 'Use /api endpoints to access data.' });
});

// Silence Chrome DevTools request to prevent 404
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.json({});
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const auth = require('./middleware/auth');

// Import and use routes
app.use('/api/habits', auth, require('./routes/habits'));
app.use('/api/journal', auth, require('./routes/journal'));
app.use('/api/notes', auth, require('./routes/notes'));
app.use('/api/settings', auth, require('./routes/settings'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Diagnostic keep-alive
setInterval(() => {
    // console.log('Keep alive');
}, 1000);
