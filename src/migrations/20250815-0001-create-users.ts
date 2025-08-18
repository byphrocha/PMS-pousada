import { QueryInterface, DataTypes } from 'sequelize';

export async function up(query: QueryInterface) {
  await query.createTable('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
}

export async function down(query: QueryInterface) {
  await query.dropTable('users');
}