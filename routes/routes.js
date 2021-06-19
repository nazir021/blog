const authRoute = require('./authRoute')
const validatorRoutes = require('../playground/validator')
const dashboardRoute = require('./dashboardRoute')
const uploadRoute = require('./uploadRoute')
const postRoute = require('./postRoute')
const explorerRoute = require('./explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')

const apiRoutes = require('../api/routes/apiRoute')

const routes = [
    {
        path:'/auth',
        handler: authRoute
    },
    {
        path:'/dashboard',
        handler: dashboardRoute
    },
  
    {
        path:'/uploads',
        handler: uploadRoute
    },
    {
        path:'/posts',
        handler: postRoute
    },
    {
        path:'/api',
        handler: apiRoutes
    },
    {
        path:'/explorer',
        handler: explorerRoute
    },
    {
        path:'/search',
        handler: searchRoute
    },
    {
        path:'/author',
        handler: authorRoute
    },
    {
        path:'/playground',
        handler: validatorRoutes
    },
    {
        path:'/',
        handler: (req,res)=>{
            res.redirect('/explorer')
        }
    }
]

module.exports = app =>{
    routes.forEach(r=> {
        if(r.path==='/'){
            app.get(r.path,r.handler)
        }else{
            app.use(r.path,r.handler)
        }
    })
}
