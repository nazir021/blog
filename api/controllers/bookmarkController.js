const Profile = require('../../models/Profile')

exports.getBookmarksController = async (req,res,next) => {
    let {postId} = req.params
    
    if(!req.user){
        return res.status(403).json({
            error:'You are not authenticated'
        })
    }

    let userId =  req.user._id
    let bookmark = null
    try{
        let profile = await Profile.findOne({user:userId})

        if(profile.bookmarks.includes(postId)){
            await Profile.findOneAndUpdate(
                {user: userId},
                {$pull: {'bookmarks': postId}}
            )
            bookmark = false
        }else{
            await Profile.findOneAndUpdate(
                {user: userId},
                {$push:{'bookmarks': postId}}
            )
            bookmark = true
        }
        res.status(201).json({
            bookmark
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}