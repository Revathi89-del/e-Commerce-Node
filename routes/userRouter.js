
const express =  require('express');
const router = express.Router();
const {authenticateUser,authorizePermissions} =  require('../middleware/authentication');

const {getAllUsers,getSingleUser,updateUser,showCurrentUser,updatePassword} = require('../controller/userController');

router.route('/').get(authenticateUser,authorizePermissions('owner','admin'),getAllUsers);
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/:id').get(authenticateUser,getSingleUser);

router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/updatePassword').patch(authenticateUser,updatePassword);



module.exports = router;