const express = require('express');
const router = express.Router();
const { getBoards, getBoard, createBoard, updateBoard, deleteBoard } = require('../controllers/board');
const { protect } = require('../middleware/auth');

// ทุก Route ต้อง Login ก่อน (ใช้ protect middleware)
router.use(protect);

// GET /api/boards → ดู Board ทั้งหมด
router.get('/', getBoards);

// GET /api/boards/:id → ดู Board เดียว
router.get('/:id', getBoard);

// POST /api/boards → สร้าง Board ใหม่
router.post('/', createBoard);

// PUT /api/boards/:id → แก้ไข Board
router.put('/:id', updateBoard);

// DELETE /api/boards/:id → ลบ Board
router.delete('/:id', deleteBoard);

module.exports = router;