const express = require('express');
const router = express.Router();
const { getSupabase } = require('../db');

// Get all journal entries
router.get('/', async (req, res) => {
    try {
        const supabase = getSupabase(req.token);
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', req.user_id);
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save Journal Entry
router.post('/', async (req, res) => {
    const { date, mood, gratitude, highlights, challenges, learning, goals, notes, lastUpdated } = req.body;

    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase
            .from('journal_entries')
            .upsert({
                user_id: req.user_id,
                date,
                mood_text: mood, // Map frontend mood to mood_text
                gratitude,
                highlights,
                challenges,
                learning,
                goals,
                notes,
                last_updated: lastUpdated || new Date().toISOString()
            });
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
