# 🏮 地道中国 (Authentic China)

> 一个具有人文温度的深度旅游平台

## 📖 核心灵魂与项目愿景

**“地道中国”** 致力于打破传统、无聊的“走马观花”式跟团游，重新定义旅行的意义。我们深信，旅行最动人的风景，是人与人之间的真实连接。

通过本平台，游客可以脱离商业化的喧嚣，直接对接当地居民，实现 **1 对 1 的深度导游体验**。在这里，你可以：
- 🛌 **住他家**：感受最真实的市井烟火与人情味。
- 🍲 **吃他做的饭**：品尝最原汁原味的当地家常美食。
- 🗣️ **听最地道的故事**：由当地人带路，探索只有老土著才知道的隐秘角落和非遗文化。

视觉设计上，我们秉持 **“中国风 + 现代简约”**，在保留古典色彩与留白艺术的同时，强调数字交互的沉浸感与现代用户的操作舒适度，打造既有文化底蕴、又不失前卫的体验。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端框架：** Vue 3 (Composition API) 
- **CSS 框架：** Tailwind CSS (用于快速构建和灵活的定制UI)
- **后端框架：** Node.js (Express)
- **数据库：** MySQL

---

## 🚀 快速开始 (Quick Start)

### 1. 环境准备 (Prerequisites)

在运行本程序之前，请确保您的电脑上已经安装了以下环境：
- [Node.js](https://nodejs.org/zh-cn/) (推荐 v16.x 或更高版本)
- [MySQL](https://www.mysql.com/) (建议 v5.7 或 v8.0+)
- **Git**

### 2. 克隆项目

```bash
git clone https://github.com/your-username/authentic-china.git
cd authentic-china/authentic-china
```
*(注意：项目主要代码实际存放在内层的 `authentic-china` 目录下。您也可以直接在此根目录使用。)*

### 3. 后端服务配置与启动 (Backend)

进入后端项目目录：
```bash
cd backend
```

**安装后端依赖：**
```bash
npm install
```

**配置环境变量：**
由于 `.env` 包含敏感信息（如数据库账号密码、JWT密钥），因此已经被 `.gitignore` 过滤，不会上传到 GitHub。
刚克隆完项目时，您需要在 `backend` 根目录下手动创建一个 `.env` 文件，并根据您的本地配置填入以下内容：
```env
PORT=3000
DB_HOST=127.0.0.1
DB_NAME=authentic_china
DB_USER=root            # <- 修改为你的 MySQL 用户名
DB_PASS=123456          # <- 修改为你的 MySQL 密码
JWT_SECRET=authentic_china_secret_key_2026_top_secret
```

**初始化数据库：**
确保您的 MySQL 服务正在运行。在 `backend` 目录下执行自动建库脚本：
```bash
node setup_db.js
```
*(如果终端提示 `Database authentic_china verified/created successfully.` 说明建立成功)*

**启动后端服务：**
```bash
npm start
```
*(此时后台服务将运行在 http://localhost:3000 )*

### 4. 前端服务配置与启动 (Frontend)

重新打开一个新的终端窗口，进入前端目录：
```bash
cd ../frontend
```

**安装前端依赖：**
```bash
npm install
```

**启动前端开发环境：**
```bash
npm run dev
```

成功运行后，终端会输出前端的访问地址（通常为 `http://localhost:5173/`），在浏览器中打开即可开始体验。

---

## 🧩 核心功能模块

### 1. 🗺️ 地图导航 (Map Navigation)
- **非商业化标注**：基于地图的深度定制，抛弃烂俗的网红打卡点，采用“本地人视角”标注隐秘的宝藏地点（例如：巷子深处的苍蝇小馆、不知名的古老街区）。
- **个性化漫步**：支持按照文化主题（如：古建寻幽、非遗手作、市井味觉）生成独家漫步路线。

### 2. 📜 城市画卷 (City Portrait)
- **沉浸式呈现**：每个城市不仅是一个坐标，而是一幅动态的文化画卷。通过高质感的图文、短视频或国风插画，展现其独特的灵魂。
- **互动展示**：配合微渐变、动态视差等现代Web交互手段，让用户在访问前就对目的地产生强烈共鸣。

### 3. 🍲 地道社交 (Authentic Social)
- **主人帖发布**：当地居民（地主）可以发布定制化的招待服务——可能是一顿家宴、一间客房，也可能是一次半日的私人向导。
- **匹配与交流**：游客可以根据自身兴趣进行浏览和筛选，平台提供内置通讯，让双方在真正见面之前就能通过有温度的聊天建立信任。

### 4. ⚖️ 交易信誉系统 (Transaction Trust & Reputation)
- **温度值系统**：打破冰冷的“星级评分”，平台引入“温度值”作为信用的体现。友善的行为、无爽约记录和优质的评价，都会转化为温度值。
- **安全保障**：包含押金托管、实名认证等机制，确保“住他家、吃他做的饭”在体验人文关怀的同时，安全无忧。

---

## 📂 项目目录结构

```text
authentic-china/
├── frontend/               # 前端项目 (Vue 3 + Tailwind CSS)
│   ├── public/             # 静态资源 (不经过构建处理)
│   ├── src/
│   │   ├── assets/         # 样式、图片等资源
│   │   ├── components/     # 复用的通用组件 (如：公共按钮、卡片)
│   │   ├── router/         # Vue Router 路由配置
│   │   ├── store/          # 状态管理 (Pinia)
│   │   ├── views/          # 业务视图页面 (如：地图导航、城市画卷)
│   │   ├── App.vue         # 根组件
│   │   └── main.js/ts      # 前端入口文件
│   └── package.json
│
├── backend/                # 后端项目 (Node.js + Express)
│   ├── setup_db.js         # 自动初始化数据库脚本
│   ├── .env                # 环境变量配置 (Git忽略，使用前需自建)
│   ├── src/
│   │   ├── config/         # 配置文件 (数据库连接、环境变量解析)
│   │   ├── controllers/    # 业务逻辑控制器 (按模块划分)
│   │   ├── middleware/     # 中间件 (如：登录拦截、错误处理、请求日志)
│   │   ├── models/         # 数据库模型 / DAO层
│   │   ├── routes/         # 路由分发定义
│   │   └── app.js/ts       # 后端主入口文件
│   └── package.json
│
└── README.md               # 项目说明文档 (本文档)
```

---

## 🔌 后端接口规范 (RESTful API)

### 1. 基础规范
- 所有 API 均以 `/api/v1` 作为前缀。
- 请求数据和响应数据格式统一为 `application/json`。

**标准响应体格式：**
```json
{
  "code": 200,      // 业务状态码：200为成功，4xx/5xx为错误
  "message": "请求成功", // 提示信息
  "data": {}        // 具体的数据载荷
}
```

### 2. 核心 API 概览

#### **👤 用户模块 (User)**
- `POST /api/v1/user/register`：用户注册 (支持手机号/邮箱等)
- `POST /api/v1/user/login`：用户登录 (返回 JWT Token)
- `GET  /api/v1/user/profile/:id`：获取目标用户的公共信息（包括最重要的 **温度值**）
- `PUT  /api/v1/user/auth`：提交用户实名认证信息

#### **📸 城市画卷 (City)**
- `GET  /api/v1/cities`：长列表：获取所有已开通的“城市画卷”概览
- `GET  /api/v1/cities/:cityCode`：获取特定城市的深度文化资料、媒体资源与定制路线节点

#### **🗣️ 社交与主人帖 (Social & Post)**
- `GET  /api/v1/posts`：发现主人帖（支持带查询参数：如 `?city=quanzhou&type=meal`过滤）
- `POST /api/v1/posts`：发布新的主人帖（提供食宿、导游说明）
- `GET  /api/v1/posts/:id`：查看特定的主人帖详细内容

#### **🤝 交易与订单 (Order)**
- `POST /api/v1/orders`：发起交流/预订申请（包含押金托管逻辑）
- `PUT  /api/v1/orders/:id/status`：订单状态更新（如：地主确认接待、体验完成）
- `POST /api/v1/orders/:id/review`：完成体验后，双方提交评价，平台将据此结算双方的 **温度值**
