const cheerio = require('cheerio')
const moment = require('moment')

module.exports = () =>{
    return (req,res,next)=>{
        res.locals.user = req.user
        res.locals.isLoggedIn = req.session.isLoggedIn
        res.locals.truncate = body =>{
            let post = cheerio.load(body)
            let text = post.text()

            text = text.replace(/(\r\r|\n|\r)/gm,'')
            if(text.length < 100) return text 
            return text.substr(0,99) + '...'
        }
        res.locals.moment = time => moment(time).fromNow()
        next()
    }
}