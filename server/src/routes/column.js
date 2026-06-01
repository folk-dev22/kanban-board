const express = require('express');
const router = express.Router({ mergeParams: true });
const { getColumns, createColumn, updateColumn, deleteColumn } = require('../controllers/column');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/boards/:boardId/columns → ดู Column ทั้งหมด
router.get('/', getColumns);

// POST /api/boards/:boardId/columns → สร้าง Column ใหม่
router.post('/', createColumn);

// PUT /api/boards/:boardId/columns/:id → แก้ไข Column
router.put('/:id', updateColumn);

// DELETE /api/boards/:boardId/columns/:id → ลบ Column
router.delete('/:id', deleteColumn);

module.exports = router;