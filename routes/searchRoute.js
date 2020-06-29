const router = require('express').Router()

const {
    searchResultGetController
} = require('../controllers/searchControlller')
 
router.get('/',searchResultGetController)

module.exports = router