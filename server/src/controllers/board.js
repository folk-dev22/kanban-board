const Board = require('../models/Board');

// Get all boards ของ User นี้
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get board by ID
const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!board) {
      return res.status(404).json({ message: 'ไม่พบ Board นี้' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create board
const createBoard = async (req, res) => {
  try {
    const { title, description, background } = req.body;
    const board = await Board.create({
      title,
      description,
      background,
      owner: req.user.id
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update board
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!board) {
      return res.status(404).json({ message: 'ไม่พบ Board นี้' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete board
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!board) {
      return res.status(404).json({ message: 'ไม่พบ Board นี้' });
    }
    res.json({ message: 'ลบ Board สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBoards, getBoard, createBoard, updateBoard, deleteBoard };