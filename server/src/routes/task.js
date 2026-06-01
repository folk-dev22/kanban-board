const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask, updateTask, deleteTask, moveTask } = require('../controllers/task');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/boards/:boardId/columns/:columnId/tasks → ดู Task ทั้งหมด
router.get('/', getTasks);

// POST /api/boards/:boardId/columns/:columnId/tasks → สร้าง Task ใหม่
router.post('/', createTask);

// PUT /api/boards/:boardId/columns/:columnId/tasks/:id → แก้ไข Task
router.put('/:id', updateTask);

// PUT /api/boards/:boardId/columns/:columnId/tasks/:id/move → ย้าย Task
router.put('/:id/move', moveTask);

// DELETE /api/boards/:boardId/columns/:columnId/tasks/:id → ลบ Task
router.delete('/:id', deleteTask);

module.exports = router;