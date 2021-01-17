const Router = require('koa-router')
const router = new Router({prefix: '/fragment'})
const {fetchFragmentList, create} = require('../controllers/fragment')

router
  .get('/', fetchFragmentList) // 创建评论或者回复 articleId 文章 id
  .post('/create', create)
//   .delete('/comment/:commentId', deleteComment) // 删除一级评论
//   .delete('/reply/:replyId', deleteReply) // 删除回复

module.exports = router
