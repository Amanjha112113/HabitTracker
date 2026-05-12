import { supabase } from '../lib/supabase';

const API_URL = 'http://localhost:3001/api';

export const api = {
    // Habits
    getHabits: async () => {
        const res = await fetch(`${API_URL}/habits`);
        return await res.json();
    },
    saveHabit: async (habit: any) => {
        await fetch(`${API_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        });
    },
    deleteHabit: async (id: string) => {
        await fetch(`${API_URL}/habits/${id}`, { method: 'DELETE' });
    },

    // Journal
    getJournal: async () => {
        const res = await fetch(`${API_URL}/journal`);
        const data = await res.json();
        // Convert array to Record<string, JournalEntry>
        return data.reduce((acc: any, entry: any) => {
            acc[entry.date] = entry;
            return acc;
        }, {});
    },
    saveJournalEntry: async (entry: any) => {
        await fetch(`${API_URL}/journal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
    },

    // Notes
    getNotes: async () => {
        const res = await fetch(`${API_URL}/notes`);
        return await res.json();
    },
    saveNote: async (note: any) => {
        await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
    },
    deleteNote: async (id: string) => {
        await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
    },

    // Auth/User (Supabase)
    getUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Map Supabase user to App UserProfile
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

        // Return mapped user
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
                    // We can generate an avatar here or let getUser handle it
                }
            }
        });
        if (error) throw error;

        // Return mapped user
        // Note: If email confirmation is enabled, user might be null or session null.
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
        // Update Supabase metadata if needed
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
        const res = await fetch(`${API_URL}/settings`);
        return await res.json();
    },
    updateSettings: async (settings: any) => {
        await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
    }
};
