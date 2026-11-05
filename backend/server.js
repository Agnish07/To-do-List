const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();

// ✅ CORS setup (Make sure this is your deployed Vercel frontend URL)
const corsOptions = {
    origin: [
        'https://to-do-list-ochre-alpha.vercel.app', // ✅ Your Vercel Frontend
        'http://localhost:5173',                     // ✅ Vite dev server
        'http://localhost:3000'                      // ✅ Local development
    ],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ JWT secret must be set, otherwise tokens would be forgeable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET in .env — add one before starting the server');
    process.exit(1);
}

// ✅ Prepared statements, reused on every request
const insertUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const listTasks = db.prepare('SELECT id, text FROM tasks WHERE user_id = ? ORDER BY id');
const insertTask = db.prepare('INSERT INTO tasks (text, user_id) VALUES (?, ?)');
const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');

// ✅ Auth middleware: reads "Authorization: Bearer <token>" and sets req.userId
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = Number(payload.sub);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function signToken(userId) {
    return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: '7d' });
}

// The frontend keys tasks off _id, so keep that shape
function toTask(row) {
    return { _id: String(row.id), text: row.text };
}

// ✅ Routes
app.get('/', (req, res) => res.send('Backend server is running ✅'));

app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        if (findUserByEmail.get(normalizedEmail)) {
            return res.status(409).json({ error: 'That email is already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const { lastInsertRowid } = insertUser.run(normalizedEmail, passwordHash);
        res.status(201).json({ token: signToken(lastInsertRowid), email: normalizedEmail });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = findUserByEmail.get(email.toLowerCase().trim());
        // Same message either way, so we don't leak which emails exist
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        res.json({ token: signToken(user.id), email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/auth/me', requireAuth, (req, res) => {
    try {
        const user = findUserById.get(req.userId);
        if (!user) return res.status(401).json({ error: 'Not logged in' });
        res.json({ email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks', requireAuth, (req, res) => {
    try {
        res.json(listTasks.all(req.userId).map(toTask));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', requireAuth, (req, res) => {
    try {
        const text = (req.body.text || '').trim();
        if (!text) return res.status(400).json({ error: 'Task text is required' });

        const { lastInsertRowid } = insertTask.run(text, req.userId);
        res.json(toTask({ id: lastInsertRowid, text }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', requireAuth, (req, res) => {
    try {
        // Scoped by user so nobody can delete someone else's task by guessing an id
        const { changes } = deleteTask.run(Number(req.params.id), req.userId);
        if (changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
