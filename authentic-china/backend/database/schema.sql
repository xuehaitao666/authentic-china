-- 创建数据库
CREATE DATABASE IF NOT EXISTS `authentic_china` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `authentic_china`;

-- 1. 用户表 (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希值',
  `email` VARCHAR(100) UNIQUE COMMENT '邮箱',
  `phone` VARCHAR(20) UNIQUE COMMENT '手机号',
  `role` ENUM('tourist', 'host', 'admin') DEFAULT 'tourist' COMMENT '角色: 游客/地主/管理员',
  `avatar_url` VARCHAR(255) COMMENT '头像URL',
  `real_name_verified` BOOLEAN DEFAULT FALSE COMMENT '是否实名认证',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础表';

-- 2. 城市表 (Cities)
CREATE TABLE IF NOT EXISTS `cities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT '城市拼音编码，如: quanzhou',
  `name` VARCHAR(50) NOT NULL COMMENT '城市名称',
  `province` VARCHAR(50) NOT NULL COMMENT '所属省份',
  `latitude` DECIMAL(10, 6) COMMENT '纬度',
  `longitude` DECIMAL(10, 6) COMMENT '经度',
  `description` TEXT COMMENT '城市文化一句话简介',
  `cover_url` VARCHAR(255) COMMENT '画卷封面图',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市画卷表';

-- 3. 地主扩展表 (Residents) - 支持多城挂牌
CREATE TABLE IF NOT EXISTS `residents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT '关联用户的ID',
  `city_id` INT NOT NULL COMMENT '主理的城市ID',
  `can_host_stay` BOOLEAN DEFAULT FALSE COMMENT '是否提供住宿',
  `specialty_food` VARCHAR(255) COMMENT '擅长/提供的地道美食',
  `daily_price` DECIMAL(10, 2) DEFAULT 0.00 COMMENT '每日接待基础定价',
  `reputation_score` INT DEFAULT 100 COMMENT '温度值（信誉积分，初始100）',
  `bio` TEXT COMMENT '地主自白/招待说明',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT,
  UNIQUE KEY `uk_user_city` (`user_id`, `city_id`) COMMENT '同一个用户在同一个城市只能有一个地主身份'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地主(多城挂牌)信息表';

-- 4. 城市图文画卷表 (Experiences)
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `city_id` INT NOT NULL COMMENT '所属城市ID',
  `author_id` INT NOT NULL COMMENT '发布者用户ID',
  `author_group` ENUM('official_host', 'tourist') NOT NULL COMMENT '发布者维度：官方与地主一类，普通游客一类',
  `type` ENUM('story', 'food', 'sightseeing') NOT NULL COMMENT '图文类型：人文故事/地道美食/小众风景',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '详细图文内容',
  `image_urls` JSON COMMENT '图片URL数组',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市记录与经历表';
