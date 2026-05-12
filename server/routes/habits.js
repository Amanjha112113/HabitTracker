const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all habits
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM habits');
        const habits = stmt.all();
        // Parse completions from JSON string
        const parsed = habits.map(h => ({ ...h, completions: JSON.parse(h.completions || '[]') }));
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update or Create Habit (Sync one habit)
router.post('/', (req, res) => {
    const { id, name, emoji, category, completions } = req.body;
    try {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO habits (id, name, emoji, category, completions)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(id, name, emoji, category, JSON.stringify(completions));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// Delete Habit
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM habits WHERE id = ?');
        stmt.run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
