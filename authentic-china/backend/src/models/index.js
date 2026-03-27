const sequelize = require('../config/database');
const User = require('./User');
const City = require('./City');
const Resident = require('./Resident');
const Experience = require('./Experience');
const Order = require('./Order');
const Friendship = require('./Friendship');
const Message = require('./Message');
const Post = require('./Post');

// User <-> Friendship
User.hasMany(Friendship, { foreignKey: 'user_id', as: 'initiatedFriendships' });
User.hasMany(Friendship, { foreignKey: 'friend_id', as: 'receivedFriendships' });
Friendship.belongsTo(User, { foreignKey: 'user_id', as: 'initiator' });
Friendship.belongsTo(User, { foreignKey: 'friend_id', as: 'friend' });

// User <-> Message
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// User <-> Resident (One-to-Many): 一个用户可以在多个城市挂牌为地主
User.hasMany(Resident, { foreignKey: 'user_id', as: 'residentProfiles' });
Resident.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// City <-> Resident (One-to-Many): 一个城市有多个地主
City.hasMany(Resident, { foreignKey: 'city_id', as: 'hosts' });
Resident.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// City <-> Experience (One-to-Many): 一个城市有多个画卷内容
City.hasMany(Experience, { foreignKey: 'city_id', as: 'experiences' });
Experience.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// User <-> Experience (One-to-Many): 一个用户可以发布多个画卷内容
User.hasMany(Experience, { foreignKey: 'author_id', as: 'publishedExperiences' });
Experience.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// --- 新增: 订单交易关联 ---

// Tourist (User) <-> Order
User.hasMany(Order, { foreignKey: 'tourist_id', as: 'tripOrders' });
Order.belongsTo(User, { foreignKey: 'tourist_id', as: 'tourist' });

// Host (User) <-> Order 
User.hasMany(Order, { foreignKey: 'host_id', as: 'receivedOrders' });
Order.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

// City <-> Order
City.hasMany(Order, { foreignKey: 'city_id', as: 'orders' });
Order.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// User <-> Post (Traveler Stories)
User.hasMany(Post, { foreignKey: 'user_id', as: 'stories' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = {
  sequelize,
  User,
  City,
  Resident,
  Experience,
  Order,
  Friendship,
  Message,
  Post
};
