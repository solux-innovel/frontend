import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Thumbnail = sequelize.define('Thumbnail', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prompt: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export { Thumbnail };
