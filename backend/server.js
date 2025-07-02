const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/todolist')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// MongoDB Schema
const taskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', taskSchema);

// Home Route (Optional but recommended)
app.get('/', (req, res) => {
    res.send('Backend server is running ✅');
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add a task
app.post('/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.json(newTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(4000, () => console.log('Server running on port 4000'));
