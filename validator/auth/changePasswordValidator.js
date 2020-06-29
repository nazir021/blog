const {body} = require('express-validator')

module.exports = [
    body('oldPassword')     
    .not()
    .isEmpty()
    .withMessage("Your Old Password Must Be Given"),    
    
    body('newPassword')    
    .isLength({min : 4})
    .withMessage("Password should be minimum then 8 characters"),    
    
    body('confirmPassword')  
    .custom((confirmPassword,{req})=>{
        if(confirmPassword!=req.body.newPassword){
            throw new Error("Password does not match")
        }
        return true
    })
]