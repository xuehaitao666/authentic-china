const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const apiRoutes = require('./routes/api');
const { sequelize } = require('./models');
const setupSocketIO = require('./socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 开放静态资源目录 (本地上传的图片)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api/v1', apiRoutes);

// 初始化 Socket.IO 即时通讯核心
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 挂载消息中间件
setupSocketIO(io);

// 开启自执行建表策略与服务监听 (注意这里监听的是 server 而非 app)
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced seamlessly.');
  server.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
