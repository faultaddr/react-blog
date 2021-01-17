const Joi = require('joi')
const {fragment: FragmentModel, sequelize} = require('../models')

class FragmentController {
  static async fetchFragmentList(ctx) {
    const data = await FragmentModel.findAndCountAll({
      attributes: ['id', 'author', 'content', 'createdAt'],
      row: true,
      order: [['createdAt', 'DESC']],
    })
    console.log(data)
    ctx.body = data
  }

  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      id: Joi.number().required(),
      author: Joi.String(),
      content: Joi.string(),
      createAt: Joi.String()
    })

    if (validator) {
      const {id, author, content, createAt} = ctx.request.body
      const data = await FragmentModel.create(
        {id, author, content, createAt},
      )
      ctx.body = data
    }
  }
}

module.exports = FragmentController
