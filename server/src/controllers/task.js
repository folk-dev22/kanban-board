const Task = require('../models/Task');

// Get all tasks ของ Column นี้
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ column: req.params.columnId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const count = await Task.countDocuments({ column: req.params.columnId });
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      column: req.params.columnId,
      board: req.params.boardId,
      order: count
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'ไม่พบ Task นี้' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'ไม่พบ Task นี้' });
    }
    res.json({ message: 'ลบ Task สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Move task (เปลี่ยน column)
const moveTask = async (req, res) => {
  try {
    const { columnId, order } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { column: columnId, order },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'ไม่พบ Task นี้' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, moveTask };