const jwt = require('jsonwebtoken');

// Middleware to verify Supabase JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // We need SUPABASE_JWT_SECRET in .env
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
        console.error('SUPABASE_JWT_SECRET is missing from environment variables');
        return res.status(500).json({ error: 'Server misconfiguration: missing JWT secret' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user_id = decoded.sub; // 'sub' in Supabase JWT is the user UUID
        req.token = token; // Save the token for use with Supabase client
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    }
};

module.exports = verifyToken;
