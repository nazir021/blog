const {body} = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcrypt')

module.exports = [
    
    body('email')
    .not().isEmpty().withMessage('Please enter your  Email')
    // .custom(async email=>{
    //     let user = await User.findOne({email})
    //     if(!user){
    //         return Promise.reject('Email does not match')
    //     }
    // })
    ,
    body('password')
    .not().isEmpty().withMessage('Please enter your  Password')
]