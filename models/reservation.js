module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    guestName:   DataTypes.STRING,
    guestEmail:  DataTypes.STRING,
    guestPhone:  DataTypes.STRING,

    // Datas planejadas
    checkIn:     DataTypes.DATEONLY,
    checkOut:    DataTypes.DATEONLY,

    // Datas reais
    actualCheckIn:  DataTypes.DATE,
    actualCheckOut: DataTypes.DATE,

    totalPrice:  DataTypes.FLOAT,

    status: {
      type: DataTypes.ENUM('booked', 'checked_in', 'checked_out', 'cancelled'),
      defaultValue: 'booked'
    },

    // Origem da reserva: booking, airbnb, manual
    source: {
      type: DataTypes.STRING,
      defaultValue: 'manual'
    }
  });   

  return Reservation;
};