const Flash = require('../utils/Flash')
const {validationResult} = require('express-validator')
const errorFormatter = require('../utils/ErrorValidation')
const readingTime = require('reading-time')

const Post = require('../models/Post')
const Profile = require('../models/Profile')


exports.createPostGetController = (req,res,next)=>{
    res.render('pages/dashboard/post/createPost',{
        title:'Create Your Post', 
        error:{},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req,res,next)=>{
    let {title,body,tags} = req.body
    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        res.render('pages/dashboard/post/createPost',{
            title:'Create Your Post', 
            error:errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    }
    if(tags){
        tags = tags.split(',')
        tags = tags.map(t => t.trim())
    }
    let readTime = readingTime(body).text

    let post =  new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes:[],
        dislikes:[],
        comments:[]
    })

    if(req.file){
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try{
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$push: {'posts':createdPost._id}}
        )
        req.flash('success','Post Created Successfully')
        res.redirect(`/posts/edit/${createdPost._id}`)

    }catch(err){
        next(err)
    }
}

exports.editPostGetController =async (req,res,next) => {
    let postId = req.params.postId

    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})     
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost',{
            title : 'edit your post',
            error: {} ,
            flashMessage : Flash.getMessage(req),
            post
        })

    } catch (err) {
        next(err)
    }

}

exports.editPostPostController =async (req,res,next) => {
    let {title,body,tags} = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)
    
    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})            
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
    
    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        res.render('pages/dashboard/post/editPost',
        {
            title : 'Edit your Post' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),            
            post
        })
    }

    if(tags){
        tags=tags.split(',')
        tags = tags.map(t => t.trim())
    }
    let thumbnail = post.thumbnail
    if(req.file){
        thumbnail = `/uploads/${req.file.filename}`
    }
    await Post.findOneAndUpdate(
        {_id : post._id},
        {$set : {title,body,tags,thumbnail } } ,
        {new : true}
    )
    req.flash('success','Post Updated Successfully')
    res.redirect('/posts/edit/'+post._id)

    } catch (err) {
        next(err)
    }
    
}

exports.DeletePostGetController =async (req,res,next) => {
    let postId = req.params.postId

    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})            
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({_id : postId})
        await Profile.findOneAndUpdate(
            {user : req.user._id},
            {$pull : {"posts" : postId}}
        )

        req.flash('success',"Post Delete Successfully")
        res.redirect('/posts')
    } catch (err) {
        next(err)
    }
}

exports.GetAllPostController =async (req,res,next) => {
    try {
        let posts = await Post.find({author : req.user._id})
        res.render('pages/dashboard/post/posts',{
            title : 'My Post',
            posts,
            flashMessage : Flash.getMessage(req)
        })
    } catch (err) {
        next(err)
    }
}