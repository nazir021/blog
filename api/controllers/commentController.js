const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.createCommentPostController = async (req,res,next) =>{
    let {postId} = req.params
    let {body} = req.body

    if(!req.user){
        return res.status(403).json({
            error:'You are not authenticated'
        })
    }

    let comment = new Comment({
        post:postId,
        user:req.user._id,
        body,
        replies:[]
    })

    try{
        let createdComment = await comment.save()

        await Post.findOneAndUpdate(
            {_id:postId},
            {$push : {'comments': createdComment._id}}
        )

        let commentJSON = await Comment.findById(createdComment._id).populate({
            path:'user',
            select:'username profilePic'
        })

        return res.status(201).json(commentJSON)
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

exports.replyPostController = async (req,res,next)=>{
    let {commentId} = req.params
    let {body} = req.body

    if(!req.user){
        return res.status(403).json({
            error:'You are not authenticated'
        })
    }

    let replies = {
        body,
        user: req.user._id
    }

    try{
        await Comment.findOneAndUpdate(
            {_id:commentId},
            {$push: {'replies':replies}}
        )

        res.status(201).json({
            ...replies,
            profilePic: req.user.profilePic
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}