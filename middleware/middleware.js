const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config')
const flash = require('connect-flash')

const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocals')

const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-pprwo.mongodb.net/test?retryWrites=true&w=majority`
const store = new MongoDBStore({
    uri: `mongodb://localhost/blog`,
    collection: 'sessions',
    expires: 1000*60*60*2
  });

const middleWare = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended: true}),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]

module.exports = app =>{
    middleWare.forEach(m=> app.use(m))
}