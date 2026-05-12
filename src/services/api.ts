import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // Habits
    getHabits: async () => {
        const res = await fetch(`${API_URL}/habits`, { headers: await getHeaders() });
        return await res.json();
    },
    saveHabit: async (habit: any) => {
        await fetch(`${API_URL}/habits`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(habit),
        });
    },
    deleteHabit: async (id: string) => {
        await fetch(`${API_URL}/habits/${id}`, { method: 'DELETE', headers: await getHeaders() });
    },

    // Journal
    getJournal: async () => {
        const res = await fetch(`${API_URL}/journal`, { headers: await getHeaders() });
        const data = await res.json();
        // Convert array to Record<string, JournalEntry>
        return data.reduce((acc: any, entry: any) => {
            acc[entry.date] = { ...entry, mood: entry.mood_text }; // Map mood_text back to mood for frontend
            return acc;
        }, {});
    },
    saveJournalEntry: async (entry: any) => {
        await fetch(`${API_URL}/journal`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(entry),
        });
    },

    // Notes
    getNotes: async () => {
        const res = await fetch(`${API_URL}/notes`, { headers: await getHeaders() });
        return await res.json();
    },
    saveNote: async (note: any) => {
        await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(note),
        });
    },
    deleteNote: async (id: string) => {
        await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE', headers: await getHeaders() });
    },

    // Auth/User (Supabase)
    getUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        return {
            firstName: user.user_metadata?.firstName || 'User',
            lastName: user.user_metadata?.lastName || '',
            email: user.email || '',
            avatar: user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${user.user_metadata?.firstName}+${user.user_metadata?.lastName}&background=14b8a6&color=fff`
        };
    },

    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const user = data.user;
        return {
            firstName: user?.user_metadata?.firstName || 'User',
            lastName: user?.user_metadata?.lastName || '',
            email: user?.email || '',
            avatar: user?.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${user?.user_metadata?.firstName}+${user?.user_metadata?.lastName}&background=14b8a6&color=fff`
        };
    },

    register: async (user) => {
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            }
        });
        if (error) throw error;

        const createdUser = data.user;
        if (!createdUser) return null;

        return {
            firstName: createdUser.user_metadata.firstName,
            lastName: createdUser.user_metadata.lastName,
            email: createdUser.email,
            avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=14b8a6&color=fff`
        };
    },

    updateUser: async (user: any) => {
        await supabase.auth.updateUser({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
            }
        });
    },

    // Settings
    getSettings: async () => {
        const res = await fetch(`${API_URL}/settings`, { headers: await getHeaders() });
        return await res.json();
    },
    updateSettings: async (settings: any) => {
        await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(settings),
        });
    },

    // Extra Feature: Get Random Quote
    getQuote: async () => {
        const res = await fetch(`${API_URL}/quotes`);
        return await res.json();
    }
};
