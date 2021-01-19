const Router = require('koa-router')
const router = new Router({prefix: '/record'})
const {fetchRecordByDay} = require('../controllers/record')

router
  .get('/', fetchRecordByDay) 
module.exports = router
