const Post = require('../../models/Post')

exports.getLikeController = async (req,res,next) => {
    let {postId} = req.params
    let userId = req.user._id
    let liked = null

    if(!req.user){
        return res.status(403).json({
            error:'You are not authenticated'
        })
    }

    try{
        let post = await Post.findById(postId)

        if(post.dislikes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull: {'dislikes': userId}}
            )
        }
        if(post.likes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'likes':userId}}
            )
            liked = false
        }else{
            await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{'likes':userId}}
            )
            liked = true
        }

        let updatedPost = await Post.findById(postId)
        res.status(200).json({
            liked,
            totalLike: updatedPost.likes.length,
            totalDisLike: updatedPost.dislikes.length
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

exports.getDislikeController = async (req,res,next) => {
    let {postId} = req.params
    let disliked = null
    let userId = req.user._id
    
    if(!req.user){
        return res.status(403).json({
            error:'You are not authenticated'
        })
    }

    

    try{
        let post = await Post.findById(postId)

        if(post.likes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull: {'likes': userId}}
            )
        }
        if(post.dislikes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'dislikes':userId}}
            )
            disliked = false
        }else{
            await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{'dislikes':userId}}
            )
            disliked = true
        }

        let updatedPost = await Post.findById(postId)
        res.status(201).json({
            disliked,
            totalLike: updatedPost.likes.length,
            totalDisLike: updatedPost.dislikes.length
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}