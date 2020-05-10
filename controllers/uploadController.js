const User = require('../models/User')
const Profile = require('../models/Profile')

exports.uploadProfilePics = async (req,res,next)=>{

    if(req.file){
        try{
            let profile = await Profile.findOne({user: req.user._id})
            let profilePic = `/uploads/${req.file.filename}`
            if(profile){
                await Profile.findOneAndUpdate(
                    {user:req.user._id},
                    {$set:{profilePic}}
                )
            }
                await User.findOneAndUpdate(
                    {_id:req.user._id},
                    {$set:{profilePic}}
                )
                res.status(200).json({
                    profilePic
                })
        }catch(err){
            res.status(500).json({
                profilePic: req.user.profilePic
            })
            console.log(err);
            
        }
    }else{
        try{
            res.status(500).json({
                profilePic: req.user.profilePic
            })
        }catch(err){
            console.log(err); 
        }
    }
}