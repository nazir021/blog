const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const moment = require('moment')

function generateDate(days){
    let date = moment().subtract(days,'days')
    return date.toDate()
}

function creatingFilterObject(filter){
    let filterObject = {}
    let order = 1

    switch(filter){
        case 'week': {
            filterObject={
                createdAt: {
                    $gt: generateDate(7)
                }
            }
            order = -1
            break;
        }
        case 'month': {
            filterObject={
                createdAt: {
                    $gt: generateDate(30)
                }
            }
            order = -1
            break;
        }
        case 'all': {
            order = -1
            break;
        }
    }
    return {
        order,
        filterObject
    }
}

exports.getExplorerController = async (req,res,next) =>{

    let filter = req.query.filter || 'latest'
    let currentPage = req.query.page || 1
    let itemPerPage = 2

    let {order,filterObject} = creatingFilterObject(filter)

    try{
        let posts = await Post.find(filterObject)
        .populate('author','username')
        .sort(order == 1 ? '-createdAt': 'createdAt')
        .skip((itemPerPage * currentPage)-itemPerPage)
        .limit(itemPerPage)

        let totalPost = await Post.countDocuments()
        let totalPage = totalPost / itemPerPage
        let bookmarks = []

        if(req.user){
            let profile = await Profile.findOne({user: req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer.ejs',{
            title:'Explore Posts',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            currentPage,
            itemPerPage,
            totalPage,
            bookmarks
        })
    }catch(err){
        next(err)
    }
}

exports.singlePostGetController = async (req,res,next) => {
    let { postId } = req.params

    try {
        let post = await Post.findById(postId)
        .populate('author','username profilePic')
        .populate({
            path : 'comments',  
            populate : {
                path : 'user',
                select: 'username profilePic'
            }
        })
        .populate({
            path : 'comments',  
            populate : {
                path: 'replies.user', 
                select : 'username profilePic'
            }

        })
        if(!post){
            let error = new Error('404 Page Not Found')
            error.status = 404
            throw error
        }
        let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user : req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePost',{
            title : post.title ,
            flashMessage : Flash.getMessage(req),
            post,
            bookmarks
        })

    } catch (e) {
        next(err)
    }
}