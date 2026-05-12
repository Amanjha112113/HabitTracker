const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all habits
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM habits WHERE user_id = ?');
        const habits = stmt.all(req.user_id);
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
      INSERT OR REPLACE INTO habits (id, user_id, name, emoji, category, completions)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        stmt.run(id, req.user_id, name, emoji, category, JSON.stringify(completions));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// Delete Habit
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM habits WHERE id = ? AND user_id = ?');
        stmt.run(id, req.user_id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
