const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// ===== Global error handlers (Shows real crash errors) =====
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE REJECTION:", err);
});


// ===== App Setup =====
const app = express();
app.use(cors());
app.use(express.json());


// ===== MongoDB Connection (FIXED) =====
mongoose.connect('mongodb://localhost:27017/taskdb')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));


// ===== Task Schema =====
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);


// ===== Routes =====

// Create Task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get One Task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===== Start Server =====
app.listen(5000, () => console.log('Server running on port 5000'));
