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

  static async deleteFragment(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      id: Joi.string()
    })
    if (validator) {
      const fragmentId = ctx.params.id
      await sequelize.query(
        `delete from fragment
        where fragment.id=${fragmentId}`
      )
      ctx.status = 204
    }
  }

  // 获取文章详情
  static async findFragmentById(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        id: Joi.number().required()
      }
    )
    if (validator) {
      const data = await FragmentModel.findOne({
        where: { id: ctx.params.id },
        row: true,
      })
      ctx.body = data
    }
  }

    // 修改文章
    static async updateFragment(ctx) {
      const validator = ctx.validate(
        {
          id: ctx.params.id,
          ...ctx.request.body,
        },
        {
          id: Joi.number().required(),
          content: Joi.string(),
        }
      )
      if (validator) {
        const { content} = ctx.request.body
        const fragmentId = parseInt(ctx.params.id)
        await FragmentModel.update({ content }, { where: { id: fragmentId } })
        ctx.body = {'result': 'success'}
      }
    }

}

module.exports = FragmentController
