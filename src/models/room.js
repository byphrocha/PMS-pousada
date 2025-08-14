module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name:       DataTypes.STRING,
    type:       DataTypes.STRING,
    capacity:   DataTypes.INTEGER,
    basePrice:  DataTypes.FLOAT,

    // Disponibilidade comercial
    status: {
      type:       DataTypes.ENUM('available', 'reserved', 'maintenance'),
      defaultValue: 'available'
    },

    // Limpeza
    cleaningStatus: {
      type:       DataTypes.ENUM('clean', 'dirty', 'maintenance'),
      defaultValue: 'clean'
    }
  });
  return Room;
};