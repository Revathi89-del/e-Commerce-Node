
const express =  require('express');
const router = express.Router();

const {register,login,logout} = require('../controller/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);


module.exports = router;