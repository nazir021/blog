const User = require('../models/User')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const errorFormatter = require('../utils/ErrorValidation')
const Flash = require('../utils/Flash')


exports.signupGetController = (req,res,next) =>{
    
    res.render('pages/auth/signup', { 
        title:'Create An Account', 
        error:{},
        value:{},
        flashMessage: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req,res,next) =>{

    let {username,email,password} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    
    if(!errors.isEmpty()){
        //return console.log(errors.mapped()) 
        req.flash('fail','Please Fill up the form Correctly')
        res.render('pages/auth/signup', { 
            title:'Create An Account' ,
            error:errors.mapped(),
            value:{
                username,email,password
            },
            flashMessage: Flash.getMessage(req)
        } )
    }
    try{
        let hashedPassword = await bcrypt.hash(password,12)
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        //const createdUser = await user.save()
        //console.log('User Created Successfully', createdUser);
        await user.save()
        // res.render('pages/auth/signup', {title:'Create An Account'})
        req.flash('success','User created Successfully')
        res.redirect('/auth/login')
    }catch(err){
        // console.log(err);
        next(err)
    }
}
// admin login
exports.signupAdminPostController = async (req,res,next) =>{
 console.log("....................",req.body);
 let {email,password} = req.body

 // let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
 //res.render('pages/auth/login', {title:'Login to your Account' ,error:{}})

 let errors = validationResult(req).formatWith(errorFormatter)
 
 if(!errors.isEmpty()){
     //return console.log(errors.mapped()) 
     req.flash('fail','Please Fill up the form Correctly')
     return res.render('pages/auth/login', { 
         title:'Login to your Account' ,
         error:errors.mapped(),
         flashMessage: Flash.getMessage(req)
     } )
 }

 try{
    console.log("....................",email);
     let user = await User.findAll()
     console.log('user admin',user);
     if(!user){
         req.flash('fail','Please Provide Correct Mail')
         return res.render('pages/auth/adminLogin', { 
             title:'Login to your Account' ,
             error:{},
             flashMessage: Flash.getMessage(req)
         } )
     }
    //  let matchedPassword = await bcrypt.compare(password, user.password)
    //  if(!matchedPassword){
    //      req.flash('fail','Please Provide Correct Password')
    //      return res.render('pages/auth/login', { 
    //          title:'Login to your Account' ,
    //          error:{},
    //          flashMessage: Flash.getMessage(req)
    //      } )
    //  }
     //res.setHeader('Set-Cookie', 'isLoggedIn=true')
     // Session must be REQ Method
     req.session.isLoggedIn = true
     req.session.user=user
     req.session.save(err=>{
         if(err){
             console.log(err);
             return next(err)
         }
         req.flash('success','Succesfully Logged In')
         res.redirect('/dashboard')
     })
     
 }catch(err){
     // console.log(err);
     next(err)
 }
 
}
exports.loginGetController = (req,res,next) =>{
    //let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    // console.log(req.session.isLoggedIn,req.session.user);
    
    res.render('pages/auth/login', { 
        title:'Login to your Account' ,
        error:{},
        flashMessage: Flash.getMessage(req)
    })
}
exports.loginPostController = async (req,res,next) =>{
    let {email,password} = req.body

    // let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    //res.render('pages/auth/login', {title:'Login to your Account' ,error:{}})

    let errors = validationResult(req).formatWith(errorFormatter)
    
    if(!errors.isEmpty()){
        //return console.log(errors.mapped()) 
        req.flash('fail','Please Fill up the form Correctly')
        return res.render('pages/auth/login', { 
            title:'Login to your Account' ,
            error:errors.mapped(),
            flashMessage: Flash.getMessage(req)
        } )
    }

    try{
        let user = await User.findOne({email})
        if(!user){
            req.flash('fail','Please Provide Correct Mail')
            return res.render('pages/auth/login', { 
                title:'Login to your Account' ,
                error:{},
                flashMessage: Flash.getMessage(req)
            } )
        }
        let matchedPassword = await bcrypt.compare(password, user.password)
        if(!matchedPassword){
            req.flash('fail','Please Provide Correct Password')
            return res.render('pages/auth/login', { 
                title:'Login to your Account' ,
                error:{},
                flashMessage: Flash.getMessage(req)
            } )
        }
        //res.setHeader('Set-Cookie', 'isLoggedIn=true')
        // Session must be REQ Method
        req.session.isLoggedIn = true
        req.session.user=user
        req.session.save(err=>{
            if(err){
                console.log(err);
                return next(err)
            }
            if(user.isAdmin){
                
                req.flash('success','Succesfully Logged In')
                res.redirect('/dashboard/admin-dashboard')
            }else{
                req.flash('success','Succesfully Logged In')
                res.redirect('/dashboard')
            }
           
        })
        
    }catch(err){
        // console.log(err);
        next(err)
    }
    
}
exports.logoutController = (req,res,next) =>{
    req.session.destroy(err=>{
        if(err){
            // console.log(err);
            return next(err)
        }
        //req.flash('success','Loggout Successfully')
        res.redirect('/auth/login')
    })
}

exports.changePasswordGetController = async (req,res,next) => {
    res.render('pages/auth/changePassword',{
        title : "Change My Password" ,
        flashMessage : Flash.getMessage(req),
        error : {}
    })
}

exports.changePasswordPostController = async (req,res,next) => {

    let {oldPassword,newPassword,confirmPassword} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)       

    if(!errors.isEmpty()){
        req.flash('fail','Please check your form')        
       return res.render('pages/auth/changePassword',
       {
           title : 'Change My Password' ,
           error : errors.mapped(),
           flashMessage : Flash.getMessage(req)         
        })        
    }    

    if(newPassword != confirmPassword){
        req.flash('fail','Password Does not Match')
        return res.redirect('/auth/change-password')
    }
    try {
        let match = await bcrypt.compare(oldPassword,req.user.password)
        if(!match){
            req.flash('fail',"Invalid Old Pasword")
            return res.redirect('/auth/change-password')
        }
        let hash = await bcrypt.hash(newPassword,11)
        await User.findOneAndUpdate(
            {_id : req.user._id},
            {$set : {password : hash}}
        )

        req.flash('success','Password Updated Successfully')
        return res.redirect('/auth/change-password')  

    } catch (e) {
       next(e) 
    }    
}
// admin login
exports.signupAdminController = (req,res,next) =>{
    
    res.render('pages/auth/admin-dashboard', { 
        title:'Create An Account', 
        error:{},
        value:{},
        flashMessage: Flash.getMessage(req)
    })
}