var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var mongoose = require("mongoose");
var mongoDB;
if(process.env.NODE_ENV === 'test') {
  mongoDB = "mongodb+srv://admin:sSIqaEnhN9pQ4r3T@studentskaprehrana.acigcoy.mongodb.net/test?retryWrites=true&w=majority&appName=studentskaPrehrana"
} else {
  mongoDB = "mongodb+srv://admin:sSIqaEnhN9pQ4r3T@studentskaprehrana.acigcoy.mongodb.net/data?retryWrites=true&w=majority&appName=studentskaPrehrana";
}

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var usersRouter = require('./routes/userRoutes.js');
var restaurantsRouter = require('./routes/restaurantRoutes.js');
var menusRouter = require('./routes/menuRoutes.js');
var photosRouter = require('./routes/photoRoutes.js');
var tagsRouter = require('./routes/tagRoutes.js');

var app = express();

var cors = require('cors');
var allowedOrigins = [`http://${process.env.SERVER_IP}:3000`, `http://${process.env.SERVER_IP}:3001`, `http://127.0.0.1:3000`,];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // Allow requests with no origin (mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/menus', menusRouter);
app.use('/photos', photosRouter);
app.use('/tags', tagsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  var errorResponse = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };

  // send the error in JSON format
  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;
