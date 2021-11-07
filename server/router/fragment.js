const Router = require('koa-router')
const router = new Router({prefix: '/fragment'})
const {fetchFragmentList, create, findFragmentById, deleteFragment, updateFragment} = require('../controllers/fragment')

router
  .get('/list', fetchFragmentList) // 获取所有碎语
  .get('/:id', findFragmentById) // 获取指定id碎语
  .post('/create', create)
  .delete('/:id', deleteFragment) // 删除指定碎语
  .put('/:id', updateFragment) // 修改碎语
module.exports = router
