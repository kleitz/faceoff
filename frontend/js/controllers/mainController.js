angular
  .module('uploader')
  .controller('MainController', MainController);

MainController.$inject = ['Upload', 'API_URL','$http'];
function MainController(Upload, API_URL,$http) {
  var self = this;

  self.file = null;
  self.files = null;
  self.fatface = {};
  
  this.uploadSingle = function() {
    Upload.upload({
      url: API_URL + '/upload/single',
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

  this.processImage = function(){
    $http({
      method: 'PUT',
      url: 'http://localhost:3000/api/cloudvision',
      data: {image: self.fatface.filestore}
    }).then(function successCallback(response) {
      console.log(response);
      self.fatface.processed = response.data[0];
      
      }, function errorCallback(response) {
       console.log(response);
      });
    }


}