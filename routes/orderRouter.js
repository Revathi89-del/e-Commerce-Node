const express = require('express');
const router =  express.Router();
const {authenticateUser,authorizePermissions} =  require('../middleware/authentication');
const{getAllOrders,getSingleOrder,createOrder,updateOrder
    ,getCurrentUserOrders
} = require('../controller/orderController')

router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrders)

router.route('/')
.get(authenticateUser,authorizePermissions('admin'),getAllOrders)
.post(authenticateUser,createOrder);

router.route('/:id')
.get(authenticateUser,getSingleOrder)
.patch(authenticateUser,updateOrder)

module.exports = router;