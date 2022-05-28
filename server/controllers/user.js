const Joi = require('joi')
const axios = require('axios')
const PSW = require('../utils/password')
const DOMParser = require('dom-parser')
const { GITHUB } = require('../config')
var fs = require('fs')
const { decodeQuery } = require('../utils')
const { comparePassword, encrypt } = require('../utils/bcrypt')
const { createToken } = require('../utils/token')

const { user: UserModel, comment: CommentModel, reply: ReplyModel, ip: IpModel, sequelize } = require('../models')
const func = require('joi/lib/types/func')
const DomParser = require('dom-parser')

/**
 * 读取 github 用户信息
 * @param {String} username - github 登录名
 */
async function getGithubInfo(username) {
  const result = await axios.get(`${GITHUB.fetch_user}/${username}`)
  return result && result.data
}

async function getDateBetween(start, end) {
  var result = [];
  //使用传入参数的时间
  var startTime = new Date(start)
  var endTime = new Date(end)
  while (endTime - startTime >= 0) {
    let year = startTime.getFullYear();
    let month = startTime.getMonth();
    month = month < 9 ? '0' + (month + 1) : month + 1;
    let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    //加入数组
    result.push(year + "-" + month + "-" + day);
    //更新日期
    startTime.setDate(startTime.getDate() + 1);
  }
  return result;
}

async function getCommitCount(time) {
  //https://github.com/faultaddr?tab=overview&from=2021-09-01&to=2021-09-31
  //https://github.com/users/faultaddr/contributions?to=2021-12-31
  const response = await axios.get(`https://github.com/users/faultaddr/contributions?to=2021-12-31`);
  var parser = new DomParser();
  var doc = parser.parseFromString(response.data)
  var crArray = doc.getElementsByClassName('ContributionCalendar-day')
  var result = []
  crArray.forEach(element => {
    var count = element.getAttribute('data-count')
    if (count !== undefined && count != null && count !== "0") {
      result.push({ date: element.getAttribute('data-date'), count: parseInt(count) })
    }
  });
  finalResult = {
    data: result
  }
  return finalResult
}

class UserController {
  // ===== utils methods
  // 查找用户
  static find(params) {
    return UserModel.findOne({ where: params })
  }

  static async findUser(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        username: Joi.string().required(),
      }
    )
    if (validator) {
      const username = ctx.params.username
      const user = await UserModel.findOne({ where: { username } })
      ctx.status = 200
      if (user) {
        ctx.body = { id: user.id }
      } else {
        ctx.body = {}
      }
    }
  }

  // 创建用户
  static createGithubUser(data, role = 2) {
    const { id, login, email } = data
    return UserModel.create({
      id,
      username: login,
      role,
      email,
      github: JSON.stringify(data),
    })
  }

  // 更新用户信息
  static updateUserById(userId, data) {
    return UserModel.update(data, { where: { id: userId } })
  }
  // ===== utils methods

  // 登录
  static async login(ctx) {
    let code = ctx.request.body['code']
    if (!code) {
      code = ctx.query['code']
    }
    if (code) {
      await UserController.githubLogin(ctx, code)
    } else {
      await UserController.defaultLogin(ctx)
    }
  }

  // 站内用户登录
  // 使用
  static async defaultLogin(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      account: Joi.string().required(),
      password: Joi.string(),
    })
    if (validator) {
      const { account, password } = ctx.request.body

      const user = await UserModel.findOne({
        where: {
          // $or: { email: account, username: account }
          username: account,
        },
      })

      if (!user) {
        // ctx.client(403, '用户不存在')
        ctx.throw(403, '用户不存在')
      } else {
        const isMatch = await comparePassword(PSW.default.decrypt(password), user.password)
        if (!isMatch) {
          // ctx.client(403, '密码不正确')
          ctx.throw(403, '密码不正确')
        } else {
          const { id, role } = user
          const token = createToken({ username: user.username, userId: id, role }) // 生成 token
          // ctx.client(200, '登录成功', { username: user.username, role, userId: id, token })
          ctx.body = { username: user.username, role, userId: id, token, email: user.email }
        }
      }
    }
  }

  // github 登录
  static async githubLogin(ctx, code) {
    const result = await axios.post(GITHUB.access_token_url, {
      client_id: GITHUB.client_id,
      client_secret: GITHUB.client_secret,
      code,
    })

    const access_token = decodeQuery(result.data)
    if (access_token) {
      // 拿到 access_token 去获取用户信息
      // const result2 = await axios.get(`${GITHUB.fetch_user_url}?access_token=${access_token['access_token']}`)
      const result2 = await axios.get(`${GITHUB.fetch_user_url}`, {
        headers: { Authorization: `token ${access_token['access_token']}` },
      })
      const githubInfo = result2.data
      let target = await UserController.find({ id: githubInfo.id }) // 在数据库中查找该用户是否存在
      if (!target) {
        target = await UserModel.create({
          id: githubInfo.id,
          username: githubInfo.name || githubInfo.username,
          github: JSON.stringify(githubInfo),
          email: githubInfo.email,
        })
      } else {
        if (target.github !== JSON.stringify(githubInfo)) {
          // github 信息发生了变动
          // console.log(`${githubInfo.login}: github 信息发生改变， 更新 user....`)
          const { id, login, email } = githubInfo
          const data = {
            username: login,
            email,
            github: JSON.stringify(githubInfo),
          }
          await UserController.updateUserById(id, data)
        }
      }
      // username: user.username, role, userId: id, token
      const token = createToken({ userId: githubInfo.id, role: target.role }) // 生成 token

      ctx.body = {
        github: githubInfo,
        username: target.username,
        userId: target.id,
        role: target.role,
        token,
      }
    } else {
      ctx.throw(403, 'github 授权码已失效！')
    }
  }

  // 注册
  static async register(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    })

    if (validator) {
      const { username, password, email } = ctx.request.body
      const result = await UserModel.findOne({ where: { email } })
      if (result) {
        // ctx.client(403, '邮箱已被注册')
        ctx.throw(403, '邮箱已被注册')
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if (user && !user.github) {
          ctx.throw(403, '用户名已被占用')
        } else {
          const decryptPassword = PSW.default.decrypt(password)
          const saltPassword = await encrypt(decryptPassword)
          await UserModel.create({ username, password: saltPassword, email })
          // ctx.client(200, '注册成功')
          ctx.status = 204
          ctx.body = { status: 204 }
        }
      }
    }
  }

  /**
   * 获取用户列表
   */
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      username: Joi.string().allow(''),
      type: Joi.number(), // 检索类型 type = 1 github 用户 type = 2 站内用户 不传则检索所有
      'rangeDate[]': Joi.array(),
      page: Joi.string(),
      pageSize: Joi.number(),
    })

    if (validator) {
      const { page = 1, pageSize = 10, username, type } = ctx.query
      const rangeDate = ctx.query['rangeDate[]']
      const where = {
        role: { $not: 1 },
      }

      if (username) {
        where.username = {}
        where.username['$like'] = `%${username}%`
      }

      if (type) {
        where.github = parseInt(type) === 1 ? { $not: null } : null
      }

      if (Array.isArray(rangeDate) && rangeDate.length === 2) {
        where.createdAt = { $between: rangeDate }
      }

      const result = await UserModel.findAndCountAll({
        where,
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        row: true,
        order: [['createdAt', 'DESC']],
      })

      // ctx.client(200, 'success', result)
      ctx.body = result
    }
  }

  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      userId: Joi.number().required(),
    })

    if (validator) {
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${ctx.params.userId}`
      )
      await UserModel.destroy({ where: { id: ctx.params.userId } })
      // ctx.client(200)
      ctx.status = 204
    }
  }

  /**
   * 更新用户
   */
  static async updateUser(ctx) {
    const validator = ctx.validate(
      {
        ...ctx.params,
        ...ctx.request.body,
      },
      {
        userId: Joi.number().required(),
        notice: Joi.boolean(),
        disabledDiscuss: Joi.boolean(),
      }
    )

    if (validator) {
      const { userId } = ctx.params
      const { notice, disabledDiscuss } = ctx.request.body
      await UserController.updateUserById(userId, { notice, disabledDiscuss })
      if (typeof disabledDiscuss !== 'undefined') {
        await IpModel.update({ auth: !disabledDiscuss }, { where: { userId: parseInt(userId) } })
      }
      ctx.status = 204
    }
  }

  /**
   * 初始化用户
   * @param {String} githubLoginName - github name
   */
  static async initGithubUser(githubLoginName) {
    try {
      const github = await getGithubInfo(githubLoginName)
      const temp = await UserController.find({ id: github.id })
      if (!temp) {
        UserController.createGithubUser(github, 1)
      }
    } catch (error) {
      console.trace('create github user error ==============>', error.message)
    }
  }


  /**
   * 获取github contribution 信息
   * @param {String} userName - github name
   * https://github.com/faultaddr?tab=overview&from=2021-09-01&to=2021-09-31
   */
  static async getGithubContributions(ctx) {
    const validator = ctx.validate(
      {
        ...ctx.params,
        ...ctx.request.body,
      },
      {
        userName: Joi.string().allow(''),
      }
    )

    if (validator) {
      const { userName } = ctx.params
      var now = new Date()
      var result = []
      result = await getCommitCount(0)
      ctx.body = result
      ctx.status = 200
    }
  }


}

module.exports = UserController
