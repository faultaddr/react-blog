const moment = require('moment')
// viewrecord表
module.exports = (sequelize, dataTypes) => {
  const Record = sequelize.define(
    'record',
    {
      id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
      articleId: {type: dataTypes.INTEGER(11)},
      userId: {type: dataTypes.INTEGER(11)},
      recordTime: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('recordTime')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
  )
  return Record
}
