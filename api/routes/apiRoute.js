const router = require('express').Router()
const { isAuthenticated } = require('../../middleware/authMiddleware')

const {
    createCommentPostController,
    replyPostController
} = require('../controllers/commentController')

const {
    getLikeController,
    getDislikeController
} = require('../controllers/likeDislikeController')

const {getBookmarksController} = require('../controllers/bookmarkController')

router.post('/comment/:postId',isAuthenticated,createCommentPostController)
router.post('/comment/replies/:commentId',isAuthenticated,replyPostController)

router.get('/like/:postId',isAuthenticated,getLikeController)
router.get('/dislike/:postId',isAuthenticated,getDislikeController)

router.get('/bookmarks/:postId',isAuthenticated,getBookmarksController)

module.exports = router