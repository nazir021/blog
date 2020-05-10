const {body} = require('express-validator')
const User = require('../../models/User')

module.exports = [
    body('username')
    .isLength({min:2,max:15}).withMessage('Username must be between 2 to 15')
    .custom(async username=>{
        let user = await User.findOne({username})
        if(user){
            return Promise.reject('Username already Exits')
        }
        return true
    })
    .trim(),
    body('email')
    .isEmail().withMessage('Please Provide a valid Email')
    .custom(async email=>{
        let user = await User.findOne({email})
        if(user){
            return Promise.reject('Email already Exits')
        }
    })
    .normalizeEmail(),
    body('password')
    .isLength({min:5}).withMessage('Password must be greater than 5 characters'),
    body('confirmPassword')
    .isLength({min:5}).withMessage('Password must be greater than 5 characters')
    .custom((confirmPassword,{req})=>{
        if(confirmPassword !== req.body.password ){
            throw new Error('Password Doee not match')
        }
        return true
    })
]