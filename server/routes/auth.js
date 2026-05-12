const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// Helper: Hash password
// Using scrypt for simple, secure hashing standard in Node crypto
const hashPassword = (password, salt) => {
    return crypto.scryptSync(password, salt, 64).toString('hex');
};

const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Register
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        // Format: salt:hash
        const salt = generateSalt();
        const hash = hashPassword(password, salt);
        const passwordStored = `${salt}:${hash}`;
        const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=14b8a6&color=fff`;

        const stmt = db.prepare('INSERT INTO users (firstName, lastName, email, password, avatar) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(firstName, lastName, email, passwordStored, avatar);

        // Return the new user (without password)
        const user = {
            id: info.lastInsertRowid,
            firstName,
            lastName,
            email,
            avatar,
            settings: null
        };

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const [salt, storedHash] = user.password.split(':');
        const hash = hashPassword(password, salt);

        if (hash !== storedHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Success
        // In a real app, generate JWT here. For this MVP, we just return the user info.
        // The client will store it as the "session".
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Profile
router.post('/profile', (req, res) => {
    const { id, firstName, lastName, email, avatar } = req.body;
    try {
        const stmt = db.prepare('UPDATE users SET firstName = ?, lastName = ?, email = ?, avatar = ? WHERE id = ?');
        stmt.run(firstName, lastName, email, avatar, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User (Mock/Session Check)
// For now, client caches user. We might use this to re-fetch fresh data.
router.get('/me', (req, res) => {
    // If implementing cookies/headers, valid here.
    // For now, just a placeholder or could take an ID param if we trusted the client (we shouldn't).
    // Let's leave it as a simple health check or fetch by ID if passed in header 'x-user-id'.
    const userId = req.headers['x-user-id'];
    if (userId) {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (user) {
            const { password: _, ...safeUser } = user;
            return res.json(safeUser);
        }
    }
    res.status(401).json({ error: 'Not authenticated' });
});

module.exports = router;
