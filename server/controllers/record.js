const Joi = require('joi')
const { lte } = require('semver')
const { record: RecordModel, sequelize } = require('../models')

class RecordController {
  static async fetchRecordByDay(ctx) {
    let data = await RecordModel.findAll({
      attributes: [
        'articleId',
        [sequelize.fn('DATE', sequelize.col('recordTime')), 'time'],
        [sequelize.fn('count', sequelize.col('recordTime')), 'cnt'],
      ],
      group: ['articleId', sequelize.fn('DATE', sequelize.col('recordTime'))],
      // where: { articleId: ctx.params.id },
      order: ['articleId'],
    })
    data.map(v => {
      v.articleId = v.articleId.toString()
    })
    ctx.body = data
  }
}

module.exports = RecordController
