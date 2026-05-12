const express = require('express');
const router = express.Router();
const { getSupabase } = require('../db');

// Get all habits
router.get('/', async (req, res) => {
    try {
        const supabase = getSupabase(req.token);
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', req.user_id);
        
        if (error) throw error;
        
        // Supabase handles JSONB automatically, so completions is already an array
        const parsed = data.map(h => ({ ...h, completions: h.completions || [] }));
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update or Create Habit (Sync one habit)
router.post('/', async (req, res) => {
    const { id, name, emoji, category, completions } = req.body;
    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase
            .from('habits')
            .upsert({
                id,
                user_id: req.user_id,
                name,
                emoji,
                category,
                completions
            });
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Habit
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user_id); // Extra safety
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
