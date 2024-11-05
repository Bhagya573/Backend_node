
//taskController

const taskModel = require('../models/task');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

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
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Check file type if uploaded
  if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, or PDF are allowed.' });
  }

  const filePath = file ? `/uploads/${file.originalname}` : null;
  
  try {
    const newTask = taskModel.createTask(title, filePath);
    // Emit an event after task creation
    eventEmitter.emit('taskCreated', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};
// Listen to task created events for logging
eventEmitter.on('taskCreated', (task) => {
  console.log(`Task created: ${task.title}`);
});
// Update an existing task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updatedTask = taskModel.updateTask(id, { title, completed });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = taskModel.deleteTask(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};
