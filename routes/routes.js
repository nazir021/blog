const authRoute = require('./authRoute')
const validatorRoutes = require('../playground/validator')
const dashboardRoute = require('./dashboardRoute')
const uploadRoute = require('./uploadRoute')

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
        path:'/playground',
        handler: validatorRoutes
    },
    {
        path:'/',
        handler: (req,res)=>{
            res.json({
                message: 'updating your site'
            })
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
