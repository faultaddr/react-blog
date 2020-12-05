const moment = require('moment')
// article 表
module.exports = (sequelize, dataTypes) => {
  const Fragment = sequelize.define('fragment', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: dataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: dataTypes.STRING(100),
      allowNull: true,
    },
    createdAt: {
      type: dataTypes.STRING(100),
      allowNull: false,
    },
  })
  return Fragment
}
