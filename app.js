require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const mongoose = require('mongoose')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session);
// const flash = require('connect-flash')
const config = require('config')
const chalk = require('chalk')

//Import Middleware
const setMiddleware = require('./middleware/middleware')
// const {bindUserWithRequest} = require('./middleware/authMiddleware')
// const setLocals = require('./middleware/setLocals')

//Import Routes
const setRoutes = require('./routes/routes')
// const authRoutes = require('./routes/authRoute')
// const validatorRoutes = require('./playground/validator')
// const dashboardRoute = require('./routes/dashboardRoute')

const app = express()
const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-pprwo.mongodb.net/test?retryWrites=true&w=majority`

// const store = new MongoDBStore({
//     uri: MONGODB_URI,
//     collection: 'sessions',
//     expires: 1000*60*60*2
//   });

// EJS Engine
app.set('view engine', 'ejs')
app.set('views','views')

// All Middleware
// const middleWare = [
//     morgan('dev'),
//     express.static('public'),
//     express.urlencoded({extended: true}),
//     express.json(),
//     session({
//         secret: process.env.SECRET_KEY || 'SECRET_KEY',
//         resave: false,
//         saveUninitialized: false,
//         store: store
//     }),
//     bindUserWithRequest(),
//     setLocals(),
//     flash()
// ]

// Use middleware
setMiddleware(app)
// app.use(middleWare)
// app.use('/auth',authRoutes)
// // app.use('/playground',validatorRoutes)
// app.use('/dashboard', dashboardRoute)
// app.get('/',(req,res)=>{
//     res.json({
//         message: 'updating your site'
//     })
// })

// Use Main Route
setRoutes(app)

// Error Middleware

app.use((req,res,next)=>{
    let error = new Error('404 NOT FOUND')
    error.status = 404;
    next(error)
})
app.use((error,req,res,next)=>{
    if(error.status===404){
        return res.render('pages/error/404',{flashMessage:{}} )
    }
    console.log(chalk.red.inverse(error.message))
    console.log(error);
    res.render('pages/error/500',{flashMessage:{}} )
})

const PORT = process.env.PORT || 4000
mongoose.connect(MONGODB_URI,{useNewUrlParser:true , useUnifiedTopology: true })
    .then(()=>{
        console.log('Database Connected 2');
        app.listen(PORT,()=>{
            console.log(`Server is Running on PORT ${PORT} `);
        })
    })
    .catch(err=>{
        return  console.log(err);
    })

// mongodb+srv://nazir:<password>@cluster0-pprwo.mongodb.net/test?retryWrites=true&w=majority

// UAAjluELQlvhIJgy

//2QGz7ldv3uYRGo6T
//mongodb+srv://nazir021:2QGz7ldv3uYRGo6T@cluster0-a6orn.mongodb.net/test?retryWrites=true&w=majority
//      mongodb+srv://nazir021:<password>@cluster0-a6orn.mongodb.net/test?retryWrites=true&w=majority