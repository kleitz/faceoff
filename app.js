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
var fs = require('fs')

app.set("views", __dirname + "/frontend");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/frontend"));
 
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




app.use(cors());
app.use(express.static('public'));


app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var routes = require('./config/routes');






var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './frontend/public/uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


var upload = multer({ storage: storage })


app.get('/api/imageupload'), function(req,res){
  console.log("trying to process image");

  return res.status(200).json("test");
}

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

     LocalFile = "./frontend/public/uploads/" + req.file.filename;
     LocalFileCropped = req.file.destination + req.file.filename + '-cropped.jpg';

    

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

     // delete local files
     fs.exists(LocalFileCropped, function(exists) {
       if(exists) {
         console.log('File exists. Deleting now ...');
         fs.unlink(LocalFileCropped);
       } else {
         console.log('File not found, so not deleting.');
       }
     });

     fs.exists(LocalFile, function(exists) {
       if(exists) {
         console.log('File exists. Deleting now ...');
         fs.unlink(LocalFile);
       } else {
         console.log('File not found, so not deleting.');
       }
     });


	   res.status(200).json({ filename: req.file.filename + '-cropped.jpg' });

	 });


	}); // end of image magic callback


});

////////////// Webcam Upload
app.post('/imageupload', function(req, res, next) {
  console.log("trying to process image");
  var base64Data = req.body.file
    require("fs").writeFile("image", base64Data, 'base64', (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
    var randomFilename = (Math.random()) * 10;

      im.resize({
        srcPath: "image",
        dstPath: "image" + randomFilename + '-cropped.png',
        width: 900,
        height: 0, // height is irrelevant
        quality: 1
       // gravity: "North" dont know what it means
      }, function(err, stdout, stderr){ if (err) throw err;
      console.log('SUCCESS cropped ' + "image" + ' .png to fit within 800x600px');

      // delete local file
      fs.exists("image", function(exists) {
        if(exists) {
          console.log('File exists. Deleting now ...');
          fs.unlink("image");
        } else {
          console.log('File not found, so not deleting.');
        }
      });

      //////////// UPLOAD TO AMAZON
      var params = {
        localFile: "image" + randomFilename + '-cropped.png', //"some/local/file",
        s3Params: {
          Bucket: "faceoffhackathon",
          Key: "image" + randomFilename + '-cropped.png', //"some/remote/file",
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

        // delete local file
        fs.exists("image" + randomFilename + '-cropped.png', function(exists) {
          if(exists) {
            console.log('File exists. Deleting now ...');
            fs.unlink("image" + randomFilename + '-cropped.png');
          } else {
            console.log('File not found, so not deleting.');
          }
        });

        // response back to frontend
        res.status(200).json({ filename: "image" + randomFilename + '-cropped.png' });
      });
    
    });

  });
});

app.get('/', function(req, res, next) {
  res.render('index');
});

app.use(routes);

app.listen(process.env.PORT || 3000);