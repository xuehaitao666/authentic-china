const { sequelize, Group, GroupMember, GroupMessage, User } = require('../src/models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // 同步模型（注意：这可能会修改数据库表结构）
    // 在生产环境中应使用迁移工具
    // await sequelize.sync({ alter: true });
    // console.log('All models were synchronized successfully.');

    // 检查模型各字段
    console.log('Group attributes:', Object.keys(Group.rawAttributes));
    console.log('GroupMember attributes:', Object.keys(GroupMember.rawAttributes));
    console.log('GroupMessage attributes:', Object.keys(GroupMessage.rawAttributes));

    // 检查关联
    console.log('User associations:', Object.keys(User.associations));
    console.log('Group associations:', Object.keys(Group.associations));

    console.log('Model validation passed!');
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
  } finally {
    await sequelize.close();
  }
}

test();
