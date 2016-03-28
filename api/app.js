var express = require('express');
var multer = require('multer');
var s3 = require('multer-s3');
var uuid = require('uuid');
var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var im = require('imagemagick');
var AWS = require('aws-sdk');
var s3 = require('s3');
 
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/faceoff2');

app.use(cors());
app.use(express.static('public'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require('./config/routes');




var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../frontend/public/uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


var upload = multer({ storage: storage })



// This will upload a single file.
app.post('/upload/single', upload.single('file'), function(req, res) {

console.log(req.file);
	im.resize({
	  srcPath: req.file.path,
	  dstPath: req.file.destination + req.file.filename + '-cropped.jpg',
	  width: 900,
	  height: 0, // height is irrelevant
	  quality: 1
	 // gravity: "North" dont know what it means
	}, function(err, stdout, stderr){
  if (err) throw err;
  console.log('SUCCESS cropped ' + req.file.filename + ' .jpg to fit within 800x600px');

 // croppedFileAddress = req.file.destination + req.file.filename + '-cropped.jpg';


	 var params = {
	   localFile: req.file.destination + req.file.filename + '-cropped.jpg', //"some/local/file",
	   s3Params: {
	     Bucket: "faceoffhackathon",
	     Key: req.file.filename + '-cropped.jpg', //"some/remote/file",
	     // other options supported by putObject, except Body and ContentLength. 
	     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
	   },
	 };
	 var uploader = client.uploadFile(params);
	 uploader.on('error', function(err) {
	   console.error("unable to upload:", err.stack);
	 });
	 uploader.on('progress', function() {
	   console.log("progress", uploader.progressMd5Amount,
	             uploader.progressAmount, uploader.progressTotal);
	 });
	 uploader.on('end', function() {
	   console.log("done uploading");
	   res.status(200).json({ filename: req.file.filename + '-cropped.jpg' });

	 });
/*  var params = {
     Bucket: 'faceoffhackathon',
     Key: req.file.destination + req.file.filename + '-cropped.jpg',
     Body: "Nothing needed here"
   };

   s3.putObject(params, function (perr, pres) {
     if (perr) {
       console.log("Error uploading data: ", perr);
     } else {
       console.log("Successfully uploaded data to myBucket/myKey");

       res.status(200).json({ filename: "hello world" });
     }
   });
});*/

	}); // end of image magic callback

});




app.use(routes);

app.listen(3000);