const express = require('express');
const router = express.Router();
const { getSupabase } = require('../db');

// Get all notes
router.get('/', async (req, res) => {
    try {
        const supabase = getSupabase(req.token);
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', req.user_id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save or Update Note
router.post('/', async (req, res) => {
    const { id, title, type, content, createdAt } = req.body;
    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase
            .from('notes')
            .upsert({
                id,
                user_id: req.user_id,
                title,
                type,
                content,
                created_at: createdAt || new Date().toISOString()
            });
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Note
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const supabase = getSupabase(req.token);
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user_id);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
