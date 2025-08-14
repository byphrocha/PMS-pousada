module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount:    { type: DataTypes.FLOAT,   allowNull: false },
    method:    { type: DataTypes.STRING,  allowNull: false },   // ex.: 'credit', 'debit', 'cash'
    paidAt:    { type: DataTypes.DATE,    allowNull: false, defaultValue: DataTypes.NOW },
    reference: { type: DataTypes.STRING }                       // nº de transação
  });
  return Payment;
};