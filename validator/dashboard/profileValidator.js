const {body} = require('express-validator')

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can not be empty')
        .isLength({max:50}).withMessage('Name cant be more than 50 Chars'),
    body('title')
        .not().isEmpty().withMessage('Title Can not be empty')
        .isLength({max:100}).withMessage('Title cant be more than 100 Chars'),
    body('bio')
        .not().isEmpty().withMessage('Bio Can not be empty')
        .isLength({max:500}).withMessage('Bio   cant be more than 500 Chars'),   
    body('website')
        .isURL().withMessage('Please provide valid Url'),    
    body('facebook')
        .isURL().withMessage('Please provide valid Url'),
    body('twitter')
        .isURL().withMessage('Please provide valid Url'),
    body('github')
        .isURL().withMessage('Please provide valid Url')     
]