var express = require('express');
var multer = require('multer');
var s3 = require('multer-s3');
var uuid = require('uuid');
var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/faceoff2');

app.use(cors());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require('./config/routes');




var upload = multer({
  storage: s3({
    // the folder within the bucket
    dirname: 'uploads',
    // set this to your bucket name
    bucket: 'faceoffhackathon',
    // your AWS keys
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    // the region of your bucket
    region: 'eu-west-1',
    // IMPORTANT: set the mime type to that of the file
    contentType: function(req, file, next) {
      next(null, file.mimetype);
    },
    // IMPORTANT: set the file's filename here
    // ALWAYS CHANGE THE FILENAME TO SOMETHING RANDOM AND UNIQUE
    // I'm using uuid (https://github.com/defunctzombie/node-uuid)
    filename: function(req, file, next) {
      // Get the file extension from the original filename
      var ext = '.' + file.originalname.split('.').splice(-1)[0];
      // create a random unique string and add the file extension
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

// This will upload a single file.
app.post('/upload/single', upload.single('file'), function(req, res) {
  res.status(200).json({ filename: req.file.key });
});

app.use(routes);

app.listen(3000);