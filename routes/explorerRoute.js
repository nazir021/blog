const router = require('express').Router()

const {
    getExplorerController,
    singlePostGetController

}  = require('../controllers/explorerController')

router.get('/',getExplorerController)
router.get('/:postId', singlePostGetController)

module.exports = router