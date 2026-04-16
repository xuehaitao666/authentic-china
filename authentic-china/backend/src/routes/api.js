const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const cityController = require('../controllers/cityController'); // 引进城池画卷总管
const hostController = require('../controllers/hostController');
const uploadController = require('../controllers/uploadController');
const postController = require('../controllers/postController');
const provinceController = require('../controllers/provinceController');
const groupController = require('../controllers/groupController');

// 鉴权通行模块
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.patch('/auth/profile', authController.updateProfile);

// 名城大观查阅通道
router.get('/cities', cityController.getAllCities);
router.get('/cities/:name', cityController.getCityDetail);

// 飞书与知音系统栈
const friendController = require('../controllers/friendController');
router.get('/social/search', friendController.searchUsers);
router.post('/social/friends', friendController.addFriend);
router.get('/social/friends/:userId', friendController.getFriends);
router.get('/social/messages/:userId/:friendId', friendController.getMessages);
router.get('/social/groups/:id/messages', groupController.getGroupMessages);
router.get('/social/groups/:id/members', groupController.getGroupMembers);
router.get('/social/groups/user/:userId', groupController.getUserGroups);
router.post('/social/groups', groupController.createGroup);

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

// ========================
// Social Post Routes (锦囊故事)
// ========================
router.post('/social/posts', postController.createPost);
router.get('/social/posts', postController.getPosts);
router.delete('/social/posts/:id', postController.deletePost);
router.post('/social/posts/like', postController.toggleLike);
router.post('/social/posts/comments', postController.addComment);
router.get('/social/posts/:postId/comments', postController.getComments);
router.delete('/social/comments/:id', postController.deleteComment);

// ========================
// Provincial Routes (卷轴舆地)
// ========================
router.get('/provinces/:name/geojson', provinceController.getGeoJSON);
router.get('/provinces/:name/cities', provinceController.getProvinceCities);

module.exports = router;
