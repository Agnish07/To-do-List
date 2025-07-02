const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

// ✅ CORS setup
const corsOptions = {
    origin: [
        'https://to-do-list-h9gt.vercel.app', // Deployed frontend URL
        'http://localhost:3000'              // Local development
    ],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Debug URI
console.log('Mongo URI:', process.env.MONGODB_URI);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// ✅ Schema and Model
const taskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', taskSchema);

// ✅ Routes
app.get('/', (req, res) => res.send('Backend server is running ✅'));

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task({ text: req.body.text });
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
