module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name:  DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    document: DataTypes.STRING 
  });
  return Customer;
};