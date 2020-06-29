const {body} = require('express-validator')
const validator = require('validator')

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can not be empty')
        .isLength({max:50}).withMessage('Name cant be more than 50 Chars')
        .trim(),
    body('title')
        .not().isEmpty().withMessage('Title Can not be empty')
        .isLength({max:100}).withMessage('Title cant be more than 100 Chars')
        .trim(),
    body('bio')
        .not().isEmpty().withMessage('Bio Can not be empty')
        .isLength({max:500}).withMessage('Bio   cant be more than 500 Chars')
        .trim(),   
    body('website')
        .custom(value=>{
            if(value){
                if(!validator.isURL(value)){
                    throw new Error('Please provide valid Url')
                }
            }
            return true
        }),   
    body('facebook')
    .custom(value=>{
        if(value){
            if(!validator.isURL(value)){
                throw new Error('Please provide valid Url')
            }
        }
        return true
    }),   
    body('twitter')
    .custom(value=>{
        if(value){
            if(!validator.isURL(value)){
                throw new Error('Please provide valid Url')
            }
        }
        return true
    }),   
    body('github')
    .custom(value=>{
        if(value){
            if(!validator.isURL(value)){
                throw new Error('Please provide valid Url')
            }
        }
        return true
    })  
]