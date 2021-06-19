const {validationResult} = require('express-validator')
const Flash = require('../utils/Flash')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Posts = require('../models/Post')
const errorFormatter = require('../utils/ErrorValidation')

exports.dashboradGetController = async (req,res,next) =>{
    try{
        
        let profile = await Profile.findOne({user: req.user._id})
        .populate({
            path : 'posts',
            select : 'title thumbnail'
        })
        .populate({
            path : 'bookmarks',
            select : 'title thumbnail'
        })
        // let status = profile.status
        if(profile){
            return res.render('pages/dashboard/dashboard', { 
                title:'My Dashboard',
                flashMessage: Flash.getMessage(req),
                posts : profile.posts.reverse().slice(0,3) ,
                bookmarks : profile.bookmarks.reverse().slice(0,3),
                // status
            })
        }
    }catch(err){
        next(err);
    }
    res.redirect('/dashboard/create-profile')
}
exports.adminDashboradGetController = async (req,res,next) =>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        .populate({
            path : 'posts',
            select : 'title thumbnail'
        })
        .populate({
            path : 'bookmarks',
            select : 'title thumbnail'
        })
        let users = await Profile.find()
        let allPosts = await Posts.find()

      
        if(profile){
             
            return res.render('pages/dashboard/admin-dashboard', { 
                title:'Admin Dashboard',
                flashMessage: Flash.getMessage(req),
                posts : profile.posts.reverse().slice(0,3) ,
                bookmarks : profile.bookmarks.reverse().slice(0,3),
                Totalusers : users.length,
                allPosts : allPosts.length
            })
        }
    }catch(err){
        next(err);
    }
    res.redirect('/dashboard/create-profile')
}

exports.allUserGetController = async (req,res,next) =>{
    try{
       
        let users = await Profile.find()
        if(users){
             
            return res.render('pages/dashboard/allUsers', { 
                title:'All Users',
                flashMessage: Flash.getMessage(req),
                posts :users ,

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
            flashMessage: Flash.getMessage(req),
            error: {}
        })
    }catch(err){
        next(err);
    }
    
}

exports.createProfilePostController = async (req,res,next)=>{
    let errors = validationResult(req).formatWith(errorFormatter)
    // console.log(errors.mapped());
    if(!errors.isEmpty()){
        return res.render('pages/dashboard/create-profile',{
            title:'Create your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped()
        })
    }
    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body
    try{
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePic: req.user.profilePic,
            links:{
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
            posts:[],
            bookmarks:[]
        })
        let createdProfile = await profile.save()
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {profile: createdProfile._id}}
        )
        req.flash('success','Profile Created Succesfully')
        res.redirect('/dashboard')
    }catch(err){
        console.log(err);
        next(err);
    }
    res.render('pages/dashboard/create-profile',{
        title:'Create your Profile',
        flashMessage: Flash.getMessage(req),
        error: {}
    })
    
}
exports.editProfileGetController = async (req,res,next)=>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(!profile){
            return res.redirect('/dashboard/create-profile')
        }
        res.render('pages/dashboard/edit-profile',{
            title:'Edit Your Profile',
            error:{},
            flashMessage: Flash.getMessage(req),
            profile
        })
    }catch(err){
        next(err)
    }
}
exports.admidEditProfileGetController = async (req,res,next)=>{
    
    try{
        let profile = await Profile.findOne({_id: req.params.id})
        let userInfo = await User.findOne({_id:profile.user})
      
        if(!profile){
            return res.redirect('/dashboard/create-profile')
        }
        res.render('pages/dashboard/adminEditUser',{
            title:'Edit Your Profile',
            error:{},
            flashMessage: Flash.getMessage(req),
            profile,
            email :userInfo.email ,
        })
    }catch(err){
        next(err)
    }
}
exports.editProfilePostController = async (req,res,next)=>{
    let errors = validationResult(req).formatWith(errorFormatter)
    //console.log(errors.mapped());

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
     } = req.body

    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        return res.render('pages/dashboard/create-profile',
        {
            title : 'Create your profile' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),
            profile : {
                name,
                title,
                bio,
                links : {
                    website,
                    facebook,
                    twitter,
                    github
                }
            }
        })
    }
    try {
        let profile = {
            name,
            title,
            bio,
            links : {
                website:website || '',
                facebook : facebook || '' ,
                twitter : twitter || '' ,
                github : github || ''
            }
        }
        let updatedProfile = await Profile.findOneAndUpdate(
            { user : req.user._id},
            { $set : profile}, 
            { new : true}
        )
        
        req.flash('success','Profile Updated Successfully')
        res.render('pages/dashboard/edit-profile',{
            title : 'Edit your profile' ,
            error : {},
            flashMessage : Flash.getMessage(req) ,            
            profile: updatedProfile
        })

    } catch (e) {      
        next(e)
    }
}
exports.AdminEditProfilePostController = async (req,res,next)=>{
    let errors = validationResult(req).formatWith(errorFormatter)
    //console.log(errors.mapped());

    let {
        name,
        title,
        id,
        bio,
        website,
        facebook,
        twitter,
        github
     } = req.body

    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        return res.render('pages/dashboard/create-profile',
        {
            title : 'Create your profile' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),
            profile : {
                name,
                title,
                bio,
                links : {
                    website,
                    facebook,
                    twitter,
                    github
                }
            }
        })
    }
    try {
        let profile = {
            name,
            title,
            id,
            bio,
            links : {
                website:website || '',
                facebook : facebook || '' ,
                twitter : twitter || '' ,
                github : github || ''
            }
        }
        let updatedProfile = await Profile.findOneAndUpdate(
            { _id : id},
            { $set : profile}, 
            { new : true}
        )
        
        req.flash('success','Profile Updated Successfully')
        // res.render('pages/dashboard/adminEditUser',{
        //     title : 'Edit your profile' ,
        //     error : {},
        //     flashMessage : Flash.getMessage(req) ,            
        //     profile: updatedProfile
        // })
        res.redirect('/dashboard/admin-dashboard')

    } catch (e) {      
        next(e)
    }
}
// block user
exports.blockUser = async (req,res,next)=>{
   
       let pro = await Profile.findOne({ _id : req.params.id})
       if(pro.status == 'Unblocked'){
        await Profile.findOneAndUpdate(
            { _id : req.params.id},
            { 'status' : "Blocked"}, 
           
        )
       }else{
         await Profile.findOneAndUpdate(
            { _id : req.params.id},
            { 'status' : "Unblocked"}, 
           
        )
       }

        req.flash('success','Profile Updated Successfully')
        // res.render('pages/dashboard/adminEditUser',{
        //     title : 'Edit your profile' ,
        //     error : {},
        //     flashMessage : Flash.getMessage(req) ,            
        //     profile: updatedProfile
        // })
        res.redirect('/dashboard/admin-dashboard')

  
}




exports.bookmarksGetController =async (req,res,next) =>{
    try {
        let profile = await Profile.findOne({ user : req.user._id})
            .populate({
                path : 'bookmarks',
                select : 'title thumbnail'
            })           
        res.render('pages/dashboard/bookmark',{
            title : 'My Bookmarks' ,
            flashMessage : Flash.getMessage(req),
            posts : profile.bookmarks
        })
    } catch (e) {
       next(e) 
    }
}
exports.deleteUser =async (req,res,next) =>{
    try {
        await Profile.remove({ _id : req.params.id})
        await User.remove({ _id : req.params.id})
         res.redirect('/dashboard/admin-dashboard')  
    } catch (e) {
       next(e) 
    }
}


exports.commentsGetController =async (req,res,next) =>{
    try {
        let profile = await Profile.findOne({ user : req.user._id})
        let comments = await Comment.find({ post : { $in: profile.posts} })
            .populate({
                path : 'post' ,
                select : 'title'
            })
            .populate({
                path : 'user' ,
                select : 'username profilePic'
            })
            .populate({
                path : 'replies.user',
                select : 'username profilePic'
            })

        //res.json(comments)
        res.render('pages/dashboard/comment',{
            title : "My Recent Comments" ,
            flashMessage : Flash.getMessage(req),
            comments
        })

    } catch (e) {
        next(e)
    }
}
