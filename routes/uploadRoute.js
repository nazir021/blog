const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
    uploadProfilePics,
    removeProfilePics,
    postImageUploadController
} = require('../controllers/uploadController')

router.post('/profilePic',isAuthenticated,upload.single('profilePic'),uploadProfilePics)


router.delete('/profilePic',isAuthenticated,removeProfilePics)

router.post('/postimage',isAuthenticated,upload.single('post-image'), postImageUploadController)


module.exports  = router