const Joi = require('joi')
const {fragment: FragmentModel, sequelize} = require('../models')

class FragmentController {
  static async fetchFragmentList(ctx) {
    const data = await FragmentModel.findAndCountAll({
      attributes: ['id', 'author', 'content', 'createdAt'],
      row: true,
      order: [['createdAt', 'DESC']],
    })
    ctx.body = data
  }

  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      author: Joi.string(),
      content: Joi.string(),
      createAt: Joi.string()
    })

    if (validator) {
      const {author, content, createAt} = ctx.request.body
      const data = await FragmentModel.create(
        {author, content, createAt},
      )
      ctx.body = data
    }
  }
}

module.exports = FragmentController
