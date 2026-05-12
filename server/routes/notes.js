const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notes
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM notes ORDER BY createdAt DESC');
        const notes = stmt.all();
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
      INSERT OR REPLACE INTO notes (id, title, type, content, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(id, title, type, content, createdAt);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Note
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
        stmt.run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
