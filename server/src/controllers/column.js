const Column = require('../models/Column');
const Board = require('../models/Board');

// Get all columns ของ Board นี้
const getColumns = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      owner: req.user.id
    });
    if (!board) {
      return res.status(404).json({ message: 'ไม่พบ Board นี้' });
    }
    const columns = await Column.find({ board: req.params.boardId }).sort({ order: 1 });
    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create column
const createColumn = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      owner: req.user.id
    });
    if (!board) {
      return res.status(404).json({ message: 'ไม่พบ Board นี้' });
    }
    const count = await Column.countDocuments({ board: req.params.boardId });
    const column = await Column.create({
      title: req.body.title,
      board: req.params.boardId,
      order: count
    });
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update column
const updateColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ message: 'ไม่พบ Column นี้' });
    }
    res.json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete column
const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) {
      return res.status(404).json({ message: 'ไม่พบ Column นี้' });
    }
    res.json({ message: 'ลบ Column สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getColumns, createColumn, updateColumn, deleteColumn };