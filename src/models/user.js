module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name:  { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role:  { 
      type: DataTypes.ENUM('admin', 'reception', 'housekeeping'),
      defaultValue: 'reception'
    }
  });
  return User;
};