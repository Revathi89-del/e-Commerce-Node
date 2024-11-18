const express = require('express');
const router =  express.Router();
const{authenticateUser,authorizePermissions} =require('../middleware/authentication');
const{createReview,updateReview,deleteReview,getSingleReview,getAllReviews} = require('../controller/reviewController');

router.route('/').get(getAllReviews).post(authenticateUser,createReview);
router.route('/:id').get(getSingleReview)
.delete(authenticateUser,deleteReview)
.patch(authenticateUser,updateReview);

module.exports = router;