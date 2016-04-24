responseFromServer = {};

angular
  .module('App')
  .controller('MainController', MainController);

MainController.$inject = ['API_URL','$http', '$window', '$timeout', '$scope'];
function MainController( API_URL,$http, $window, $timeout, $scope) {
  var self = this;

  self.file = null;
  self.files = null;
  self.beardshow = true;
  self.mustacheshow = true;
  self.fatface = {};
  self.fatface.filestore = "./public/placeholder.jpg"
  self.webcamCountDownText = "Take Photo?";
  self.showVideo = false;
  self.webcamRequestLogo = true;
  self.snapShotShow = false;
  self.showLoadingSpinner = false;


    self.chart = [
        {
            value: 0,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Nose % "
        },
        {
            value: 0,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Eyes %"
        },
        {
            value: 0,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Mouth %"
        }
    ]
console.log(self.chart)
HelloWorld = self.chart

  this.getVideo = function(){
    self.showVideo = true;
    self.webcamCountDownText = "5 second/s left"

    console.log("get video function called");
  
    video = document.querySelector("#videoElement");
     
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
     
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
     
    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
        

          function timesUpTakePhoto() {
              console.log("5 seconds past, take photo");
              self.takephoto();
              self.showVideo = false;
              self.webcamRequestLogo = false;
              self.snapShotShow = true;
          }

          function countdownUpdate(){
            if (i < 5){
              console.log( i + "second/s passed");
              self.webcamCountDownText = (5 - i) + " second/s left";
              $timeout(countdownUpdate, 1000);
              i++;
            } else {
              self.showLoadingSpinner = true;
              timesUpTakePhoto();
            }
          }

        var i = 0;
        $timeout(countdownUpdate, 1000);
  
  }
  
    function videoError(e) {
        // do something
    }
    
  }
  
  this.takephoto = function() {
      var context = canvas.getContext('2d');
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);


       // var imgData = canvas.toDataURL("img/png");
       data = data.replace('data:image/png;base64,', '');

/*      Upload.upload({
         url: '/upload/single',
         data: data
       })*/

    $http({
         method: 'POST',
         url: '/imageupload',
         data: {file: data}
       }).then(function successCallback(response) {
           console.log(response);
           console.log(response.data.filename);
           self.snapShotShow = false; // clear canvas
           self.showLoadingSpinner = false; // get rid of spinner.
           self.fatface.filestore = "https://s3-eu-west-1.amazonaws.com/faceoffhackathon/" + response.data.filename;
           console.log(self.fatface.filestore);
           self.processImage()
         }, function errorCallback(response) {
           console.log(response);
         });
       
      } else {
       // clearphoto();
     console.log("something ERROR happened");
   }
  }
  

  
  /*this.uploadSingle = function() {
    Upload.upload({
      url: '/upload/single',
      data: { file: self.file }
    })
    .then(function(res) {
      console.log("Success!");
      console.log(res);
      console.log(res.data.filename);
      self.fatface.filestore = "https://s3-eu-west-1.amazonaws.com/faceoffhackathon/" + res.data.filename;
      console.log(self.fatface.filestore);
      self.processImage()
    })
    .catch(function(err) {
      console.error(err);
    });
  }*/

  this.processImage = function(){
    $http({
      method: 'PUT',
      url: '/api/cloudvision',
      data: {image: self.fatface.filestore}
    }).then(function successCallback(response) {
      console.log(response);
      self.fatface.processed = response.data[0];
      responseFromServer = response.data[0]



    faceWidth = (responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[1].x) - (responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x);
     faceHeight = (responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[3].y) - (responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[1].y);
     noselengthpixels = (responseFromServer.faceAnnotations[0].landmarks[7].position.y) - (responseFromServer.faceAnnotations[0].landmarks[6].position.y)
     noseLengthPercentage = (noselengthpixels / faceHeight) * 100;
     self.fatface.nose = noseLengthPercentage;

     eyesWidthpixels = (responseFromServer.faceAnnotations[0].landmarks[22].position.x) - (responseFromServer.faceAnnotations[0].landmarks[19].position.x);
     eyesWidthPercentage = (eyesWidthpixels / faceWidth) * 100;
     self.fatface.eyes = eyesWidthPercentage;


     mouthWidthpixels = (responseFromServer.faceAnnotations[0].landmarks[11].position.x) - (responseFromServer.faceAnnotations[0].landmarks[10].position.x);
     mouthWidthPercentage = (mouthWidthpixels / faceWidth) * 100;
     self.fatface.mouth = mouthWidthPercentage;


     self.chart[0].value = self.fatface.nose; // set chart
     self.chart[2].value = self.fatface.mouth; // set chart
     self.chart[1].value = self.fatface.eyes; // set chart

     hatYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].y - (faceHeight * 0.5);
     hatXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     $(".hat").css("margin-top",hatYpos); 
     $(".hat").css("margin-left",hatXpos - (faceWidth * 0.2)); 
     $(".hat").css("width",faceWidth * 1.4); 
     $(".hat").css("height",faceHeight * 0.6); 



     hairYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].y;
     hairXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     $(".hair").css("margin-top",hairYpos - (faceHeight * 0.5)); 
     $(".hair").css("margin-left",hairXpos - (faceWidth * 0.1)); 
     $(".hair").css("width",faceWidth * 1.2); 
     $(".hair").css("height",faceHeight * 0.9); 


     afroYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].y;
     afroXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     $(".afro").css("margin-top",afroYpos - (faceHeight * 1)); 
     $(".afro").css("margin-left",afroXpos - (faceWidth * 0.5)); 
     $(".afro").css("width",faceWidth * 2); 
     $(".afro").css("height",faceHeight * 1.4); 



     necklaceXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     necklaceYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[2].y

     $(".necklace").css("margin-top",necklaceYpos); 
     $(".necklace").css("margin-left",necklaceXpos - (faceWidth * 0.1)); 
     $(".necklace").css("width",faceWidth * 1.2); 
     $(".necklace").css("height",faceHeight * 0.5); 

    var beardYpos = responseFromServer.faceAnnotations[0].landmarks[28].position.y;
    var beardXpos = (responseFromServer.faceAnnotations[0].landmarks[28].position.x);
    $(".beard").css("margin-top",beardYpos); 
    $(".beard").css("margin-left",beardXpos); 
    $(".beard").css("width",faceWidth); 

    var mustacheXpos = (responseFromServer.faceAnnotations[0].landmarks[8].position.x) - noselengthpixels;
    var mustacheYpos = (responseFromServer.faceAnnotations[0].landmarks[8].position.y) - 20;


    $(".mustache").css("margin-left",mustacheXpos); 
    $(".mustache").css("margin-top",mustacheYpos); 
    $(".mustache").css("width",noselengthpixels * 2); 

    var glassesXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
    var glassesYpos = responseFromServer.faceAnnotations[0].landmarks[26].position.y;

    $(".glasses").css("margin-left",glassesXpos); 
    $(".glasses").css("margin-top",glassesYpos); 
   $(".glasses").css("height", faceHeight * 0.4);
   $(".glasses").css("width", faceWidth);


      }, function errorCallback(response) {
       console.log(response);
      });
    }


}
