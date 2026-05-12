const express = require('express');
const router = express.Router();
const { getSupabase } = require('../db');

const defaultSettings = {
    dailyReminders: true,
    weeklyReports: true,
    achievementNotifications: true,
    startWeekOn: 'Monday',
    theme: 'Light',
    timezone: 'Auto-detect',
    secureSession: false
};

// Get Settings
router.get('/', async (req, res) => {
    try {
        const supabase = getSupabase(req.token);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (user && user.user_metadata && user.user_metadata.settings) {
            res.json(user.user_metadata.settings);
        } else {
            res.json(defaultSettings);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Settings
router.post('/', async (req, res) => {
    const settings = req.body;
    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase.auth.updateUser({
            data: { settings: settings }
        });
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
