const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
    uploadProfilePics
} = require('../controllers/uploadController')

router.post('/profilePic',isAuthenticated,upload.single('profilePic'),uploadProfilePics)


module.exports  = router