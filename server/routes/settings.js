const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Settings
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT settings FROM users WHERE id = ?');
        const user = stmt.get(req.user_id);
        if (user && user.settings) {
            res.json(JSON.parse(user.settings));
        } else {
            // Default settings
            res.json({
                dailyReminders: true,
                weeklyReports: true,
                achievementNotifications: true,
                startWeekOn: 'Monday',
                theme: 'Light',
                timezone: 'Auto-detect',
                secureSession: false
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Settings
router.post('/', (req, res) => {
    const settings = req.body;
    try {
        // We lazily insert the user if they don't exist yet, then update settings
        const check = db.prepare('SELECT id FROM users WHERE id = ?').get(req.user_id);
        if (check) {
            const stmt = db.prepare('UPDATE users SET settings = ? WHERE id = ?');
            stmt.run(JSON.stringify(settings), req.user_id);
        } else {
            const stmt = db.prepare('INSERT INTO users (id, settings) VALUES (?, ?)');
            stmt.run(req.user_id, JSON.stringify(settings));
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
