const { EventEmitter } = require('events');
const TaskModel = require('../models/task');

// Create an instance of EventEmitter
const taskEvents = new EventEmitter();

// Event listeners for task events
taskEvents.on('taskCreated', (task) => console.log(`Task created: ${JSON.stringify(task)}`));
taskEvents.on('taskUpdated', (task) => console.log(`Task updated: ${JSON.stringify(task)}`));
taskEvents.on('taskDeleted', (taskId) => console.log(`Task deleted with ID: ${taskId}`));

// Utility function to simulate delay
const simulateDelay = (callback, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(callback());
        }, delay);
    });
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.getAllTasks();
        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTask = await simulateDelay(() => TaskModel.createTask(title, completed), 1000);
        taskEvents.emit('taskCreated', newTask);
        return res.status(201).json(newTask);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTask = await simulateDelay(() => TaskModel.updateTask(parseInt(id), updates), 1000);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        taskEvents.emit('taskUpdated', updatedTask);
        return res.json(updatedTask);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await simulateDelay(() => TaskModel.deleteTask(parseInt(id)), 1000);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        taskEvents.emit('taskDeleted', id);
        return res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
