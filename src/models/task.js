// src/models/taskModel.js
let tasks = [];
let nextId = 1;

const getAllTasks = () => tasks;

const createTask = (title, completed = false) => {
  const newTask = { id: nextId++, title, completed };
  tasks.push(newTask);
  return newTask;
};

const updateTask = (id, updates) => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
};

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return null;

  return tasks.splice(taskIndex, 1)[0];
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
