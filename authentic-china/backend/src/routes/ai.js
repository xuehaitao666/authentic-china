const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 定义AI聊天路由
router.post('/chat', aiController.chat);

module.exports = router;
