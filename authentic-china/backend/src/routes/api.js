const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const cityController = require('../controllers/cityController'); // 引进城池画卷总管
const hostController = require('../controllers/hostController');
const uploadController = require('../controllers/uploadController');

// 鉴权通行模块
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// 名城大观查阅通道
router.get('/cities/:name', cityController.getCityDetail);

// 飞书与知音系统栈
const friendController = require('../controllers/friendController');
router.get('/social/search', friendController.searchUsers);
router.post('/social/friends', friendController.addFriend);
router.get('/social/friends/:userId', friendController.getFriends);
router.get('/social/messages/:userId/:friendId', friendController.getMessages);

// 预约与信用交易模块
router.post('/orders', orderController.createOrder);

// ========================
// Host Routes (主家府衙)
// ========================
router.put('/host/profile', hostController.upsertResidentProfile);
router.get('/host/profile', hostController.getMyResidentProfiles);

// ========================
// Upload Route (图片上传)
// ========================
router.post('/upload/image', uploadController.uploadImage);

module.exports = router;
