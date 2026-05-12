const { createClient } = require('@supabase/supabase-js');

const getSupabase = (token) => {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
        throw new Error('Supabase URL or Key is missing from environment variables');
    }

    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};

module.exports = { getSupabase };
