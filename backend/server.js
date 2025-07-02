const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

// ✅ Correct CORS setup here (only one time)
const corsOptions = {
    origin: ['https://to-do-list-h9gt.vercel.app'], // your Vercel deployed URL
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// ✅ MongoDB Schema
const taskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', taskSchema);

// ✅ Routes
app.get('/', (req, res) => {
    res.send('Backend server is running ✅');
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.json(newTask);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ✅ Correct Port Setup
app.listen(process.env.PORT || 4000, () => console.log(`Server running on port ${process.env.PORT || 4000}`));
