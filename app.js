var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var organisation = require('./routes/organisation')
var register = require('./routes/register')

var app = express();
var db = require('./db')
var url = 'mongodb://localhost:27017/test'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect(url, function (err) {
    if (err){
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        console.log('Connected to db');
        db.fillDatabase();
        db.getOrgaByName('popopo', function(err, orga) {
            if (err)
            console.log('no such orga');
            else
            console.log(orga);
        });
        db.getUserByAddress('0x00000004', function(err, user) {
            if (err)
            console.log('no such user');
            else
            console.log(user);
        });
        app.use(function(req,res,next){
            req.db = db;
            next();
        });
    }
})

app.use('/', index);
app.use('/users', users);
app.use('/organisation', organisation);
app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
