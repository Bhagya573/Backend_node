//taskModel

const fs = require('fs');
const path = require('path');
const os = require('os'); // OS module

const tasksFilePath = path.join(__dirname, '../tasks.json');

// Helper function to read tasks from the JSON file
const readTasksFromFile = () => {
  try {
    if (!fs.existsSync(tasksFilePath)) {
      fs.writeFileSync(tasksFilePath, JSON.stringify([])); // Create the file if it doesn't exist
    }
    return JSON.parse(fs.readFileSync(tasksFilePath, 'utf8')); // Return parsed tasks from file
  } catch (error) {
    console.error("Error reading tasks from file:", error);
    throw new Error('Failed to read tasks');
  }
};

// Helper function to write tasks to the JSON file
const writeTasksToFile = (tasks) => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); // Write tasks to file
  } catch (error) {
    console.error("Error writing tasks to file:", error);
    throw new Error('Failed to write tasks');
  }
};

// Get all tasks
const getAllTasks = () => {
  return readTasksFromFile();
};

// Create a new task
const createTask = (title, filePath = null) => {
  console.log(filePath,"filePath")
  const tasks = readTasksFromFile();
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    filePath,
  };
  tasks.push(newTask);
  writeTasksToFile(tasks);
  return newTask;
};

// Update an existing task
const updateTask = (id, updates) => {
  const tasks = readTasksFromFile();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return { error: "Task not found" };
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  writeTasksToFile(tasks);
  return tasks[taskIndex];
};

// Delete a task
const deleteTask = (id) => {
  const tasks = readTasksFromFile();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return { error: "Task not found" };
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  writeTasksToFile(tasks);
  return deletedTask;
};
// Get system information (using OS module)
const getSystemInfo = () => {
    return {
      platform: os.platform(),
      arch: os.arch(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
    };
  };

module.exports = { getAllTasks, createTask, updateTask, deleteTask, getSystemInfo};
