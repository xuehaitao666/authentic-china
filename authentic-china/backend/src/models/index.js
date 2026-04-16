const sequelize = require('../config/database');
const User = require('./User');
const City = require('./City');
const Resident = require('./Resident');
const Experience = require('./Experience');
const Order = require('./Order');
const Friendship = require('./Friendship');
const Message = require('./Message');
const Post = require('./Post');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const GroupMessage = require('./GroupMessage');
const PostLike = require('./PostLike');
const PostComment = require('./PostComment');

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

// City <-> Post
City.hasMany(Post, { foreignKey: 'city_id', as: 'moments' });
Post.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// Post <-> PostLike
Post.hasMany(PostLike, { foreignKey: 'post_id', as: 'likes', onDelete: 'CASCADE' });
PostLike.belongsTo(Post, { foreignKey: 'post_id' });
User.hasMany(PostLike, { foreignKey: 'user_id', as: 'postLikes' });
PostLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Post <-> PostComment
Post.hasMany(PostComment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });
PostComment.belongsTo(Post, { foreignKey: 'post_id' });
User.hasMany(PostComment, { foreignKey: 'user_id', as: 'postComments' });
PostComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// PostComment self-association (Multi-level replies)
PostComment.hasMany(PostComment, { foreignKey: 'parent_id', as: 'replies', onDelete: 'CASCADE' });
PostComment.belongsTo(PostComment, { foreignKey: 'parent_id', as: 'parent' });

// --- Counter Cache Hooks ---
const updatePostPerformance = async (postId) => {
  const post = await Post.findByPk(postId);
  if (post) {
    // Simple Score Formula: Likes * 10 + Comments * 20
    post.performance_score = (post.likes_count * 10) + (post.comments_count * 20);
    await post.save();
  }
};

// Likes Hooks
PostLike.afterCreate(async (like) => {
  await Post.increment('likes_count', { where: { id: like.post_id } });
  await updatePostPerformance(like.post_id);
});
PostLike.afterDestroy(async (like) => {
  await Post.decrement('likes_count', { where: { id: like.post_id } });
  await updatePostPerformance(like.post_id);
});

// Comments Hooks
PostComment.afterCreate(async (comment) => {
  await Post.increment('comments_count', { where: { id: comment.post_id } });
  await updatePostPerformance(comment.post_id);
});
PostComment.afterDestroy(async (comment) => {
  await Post.decrement('comments_count', { where: { id: comment.post_id } });
  await updatePostPerformance(comment.post_id);
});

// --- 新增: 雅集 (Group Chat) 关联 ---

// User <-> Group (Creator)
User.hasMany(Group, { foreignKey: 'creator_id', as: 'createdGroups', onDelete: 'CASCADE' });
Group.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// User <-> Group (Membership through GroupMember)
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id', otherKey: 'group_id', as: 'memberGroups', onDelete: 'CASCADE' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id', otherKey: 'user_id', as: 'members', onDelete: 'CASCADE' });

// GroupMember associations for direct querying
GroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// Group <-> GroupMessage
Group.hasMany(GroupMessage, { foreignKey: 'group_id', as: 'messages', onDelete: 'CASCADE' });
GroupMessage.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// User <-> GroupMessage (Sender)
User.hasMany(GroupMessage, { foreignKey: 'sender_id', as: 'groupMessagesSent', onDelete: 'CASCADE' });
GroupMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = {
  sequelize,
  User,
  City,
  Resident,
  Experience,
  Order,
  Friendship,
  Message,
  Post,
  PostLike,
  PostComment,
  Group,
  GroupMember,
  GroupMessage
};
