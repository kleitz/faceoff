
angular
  .module('uploader')
  .controller('MainController', MainController);

MainController.$inject = ['Upload', 'API_URL','$http'];
function MainController(Upload, API_URL,$http) {
  var self = this;

  self.file = null;
  self.files = null;
  self.beardshow = true;
  self.mustacheshow = true;
  self.fatface = {};

  
  this.uploadSingle = function() {
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
  }


  var responseFromServer = {};

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

     hatYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].y - (faceHeight * 0.5);
     hatXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     $(".hat").css("margin-top",hatYpos); 
     $(".hat").css("margin-left",hatXpos - (faceWidth * 0.2)); 
     $(".hat").css("width",faceWidth * 1.4); 
     $(".hat").css("height",faceHeight * 0.5); 



     hairYpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].y;
     hairXpos = responseFromServer.faceAnnotations[0].fdBoundingPoly.vertices[0].x
     $(".hair").css("margin-top",hairYpos - 100); 
     $(".hair").css("margin-left",hairXpos - (faceWidth * 0.2)); 
     $(".hair").css("width",faceWidth * 1.4); 
     $(".hair").css("height",faceHeight); 


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

