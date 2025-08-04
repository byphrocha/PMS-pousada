const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

(async () => {
  await sequelize.sync();
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@pms.com', passwordHash: hash, role: 'admin' });
  console.log('Usuário admin criado!');
  process.exit();
})();