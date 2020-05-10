const {validationResult} = require('express-validator')
const Flash = require('../utils/Flash')
const Profile = require('../models/Profile')
const errorFormatter = require('../utils/ErrorValidation')

exports.dashboradGetController = async (req,res,next) =>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(profile){
            return res.render('pages/dashboard/dashboard', { 
                title:'My Dashboard',
                flashMessage: Flash.getMessage(req)
            })
        }
    }catch(err){
        next(err);
    }
    res.redirect('/dashboard/create-profile')
}

exports.createProfileGetController = async (req,res,next)=>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(profile){
            return res.redirect('/dashboard/edit-profile')
        }
        res.render('pages/dashboard/create-profile',{
            title:'Create your Profile',
            flashMessage: Flash.getMessage(req)
        })
    }catch(err){
        next(err);
    }
    
}

exports.createProfilePostController = (req,res,next)=>{
    let errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors);
    res.render('pages/dashboard/create-profile',{
        title:'Create your Profile',
        flashMessage: Flash.getMessage(req)
    })
    
}
exports.editProfileGetController = (req,res,next)=>{
    next()
}
exports.editProfilePostController = (req,res,next)=>{
    next()
}
