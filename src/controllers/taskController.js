//controller
const taskModel = require('../models/task');

// Get all tasks
exports.getTasks = (req, res) => {
  try {
    const tasks = taskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// Create a new task
exports.createTask = (req, res) => {
  const { title } = req.body;
  const file = req.file;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' });
  }
  const filePath = file ? `/uploads/${file.originalname}` : null;
  const newTask = taskModel.createTask(title, filePath);
  res.status(201).json(newTask);
};
// Update an existing task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updatedTask = taskModel.updateTask(id, { title, completed });
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(updatedTask);
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  const deletedTask = taskModel.deleteTask(id);

  if (!deletedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted' }); 
};
