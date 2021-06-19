const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const profileValidator = require('../validator/dashboard/profileValidator')
const {
    dashboradGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarksGetController,
    commentsGetController,
    adminDashboradGetController,
    allUserGetController,
    admidEditProfileGetController,
    AdminEditProfilePostController,
    deleteUser,
    blockUser
} = require('../controllers/dashboardController')


router.get('/bookmarks',isAuthenticated,bookmarksGetController)
router.get('/comments',commentsGetController)

router.get('/create-profile',isAuthenticated,createProfileGetController)
router.post('/create-profile',isAuthenticated,profileValidator,createProfilePostController)

router.get('/edit-profile',isAuthenticated,editProfileGetController)
router.get('/adminEditUser/:id',isAuthenticated,admidEditProfileGetController)


router.post('/edit-profile',isAuthenticated,profileValidator,editProfilePostController)
router.post('/adminEditUser',isAuthenticated,profileValidator,AdminEditProfilePostController)


router.get('/',isAuthenticated, dashboradGetController)
router.get('/allUsers',isAuthenticated, allUserGetController)
router.get('/admin-dashboard',isAuthenticated, adminDashboradGetController)

router.get('/deleteUser/:id',isAuthenticated,deleteUser)
router.get('/blockUser/:id',isAuthenticated, blockUser)

module.exports  = router