const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all journal entries
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM journal_entries');
        const entries = stmt.all();
        // Convert object to record map keyed by date, or array depending on frontend need.
        // Frontend expects a Record<string, JournalEntry>.
        // Let's return an array and let frontend convert, or convert here.
        // For API standard, returning array is better.
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save Journal Entry
router.post('/', (req, res) => {
    const { date, mood, gratitude, highlights, challenges, learning, goals, notes, lastUpdated } = req.body;

    // Handl mood: frontend sends string (e.g. 'happy'), db stores TEXT.
    // Validate mood if necessary, or trust frontend.

    try {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO journal_entries (date, mood_text, gratitude, highlights, challenges, learning, goals, notes, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        // We map frontend 'mood' to 'mood_text' column
        stmt.run(date, mood, gratitude, highlights, challenges, learning, goals, notes, lastUpdated);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
