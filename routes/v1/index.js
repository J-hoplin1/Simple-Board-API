const Router = require('express').Router
const auth = require('./auth')
const user = require('./user')

const router = Router();
router.use('/auth',auth);
router.use('/user',user)

module.exports = router