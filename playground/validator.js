const router = require('express').Router()
const {check,validationResult} = require('express-validator')
const Flash = require('../utils/Flash')
const upload = require('../middleware/uploadMiddleware')


router.get('/validator', (req,res,next)=>{
    // console.log(req.flash('fail'));
    // console.log(req.flash('success'));
     //console.log(Flash.getMessage(req));
    
    res.render('playground/signup',{title:'File upload'  ,flashMessage:{}})
} )
router.post('/validator',
// [
    // check('username')
    // .not()
    // .isEmpty()
    // .withMessage(`Username must be given`)
    // .isLength({max:15})
    // .withMessage(`Username can not be more than 15 chac`)
    // .trim(),
    // check('email')
    // .isEmail()
    // .withMessage(`please provide a email`)
    // .normalizeEmail(),
    // check('password').custom(value=>{
    //     if(value < 5){
    //         throw new Error('Password is short')
    //     }
    //     return true
    // }),
    // check('confirmPassword').custom((value,{req})=>{
    //     if(value !== req.body.password){
    //         throw new Error('Password does not matched')
    //     }
    //     return true
    // })
// ], 
upload.single('myFile'),
(req,res,next)=>{
    // let errors = validationResult(req)
    
    // if(!errors.isEmpty()){
    //     req.flash('fail','There is an error')
    // }else{
    //     req.flash('success','There is no error')
    // }
    // res.redirect('/playground/validator')
    if(req.file){
        console.log(req.file);
    }
    res.render('playground/signup',{title:'File upload', flashMessage:{}})
})




module.exports = router