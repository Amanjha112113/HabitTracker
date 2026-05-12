const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notes
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY createdAt DESC');
        const notes = stmt.all(req.user_id);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save or Update Note
router.post('/', (req, res) => {
    const { id, title, type, content, createdAt } = req.body;
    try {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO notes (id, user_id, title, type, content, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        stmt.run(id, req.user_id, title, type, content, createdAt);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Note
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
        stmt.run(id, req.user_id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
