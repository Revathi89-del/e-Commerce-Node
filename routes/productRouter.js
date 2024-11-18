const express = require('express');
const router =  express.Router();
const {authenticateUser,authorizePermissions} =  require('../middleware/authentication');
const{getAllProducts,getSingleProduct,createProduct,updateProducts
    ,deleteProducts,uploadImage,getSingleProductReview
} = require('../controller/productController');

router.route('/').get(getAllProducts).post([authenticateUser,authorizePermissions('admin')],createProduct);
router.route('/:id').get(getSingleProduct)
.delete([authenticateUser,authorizePermissions('admin')],deleteProducts)
.patch([authenticateUser,authorizePermissions('admin')],updateProducts);
router.route('/:id/reviews').get(getSingleProductReview)
router.route('/uploadImage').post([authenticateUser,authorizePermissions('admin')],uploadImage);

module.exports =router;