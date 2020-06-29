const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
    .not().isEmpty().withMessage('Title Can not be empty')
    .isLength({max:100}).withMessage('Title Can not be more Than 100 Characters')
    .trim()
    ,
    body('body')
    .not().isEmpty().withMessage('Body Can not be empty')
        .custom(value=>{
            const $ = cheerio.load(value)
            const text = $.text()
            if(text.length > 5000){
                throw new Error('Body Can not be more Than 5000 Characters')
            }
            return true
        })
]