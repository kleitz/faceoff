
const vision = require('node-cloud-vision-api')
'use strict'

//const vision = require('./index')
// init with auth
vision.init({auth: 'AIzaSyCYiJr6lKqf9srvNfxpAk9aPZ4D0l1Hofo'})

  
////////////////////////////////// API ///////////////////

//GET
function visionGet(req, returnResponse) { // page request
console.log ("arrived in vision get, going to process the url image" + req.body.image);
var imageURL  = req.body.image; // create cloudvision request instance with the URL of the image from req.body

const request = new vision.Request({
  image: new vision.Image({
    url: imageURL //'https://scontent-nrt1-1.cdninstagram.com/hphotos-xap1/t51.2885-15/e35/12353236_1220803437936662_68557852_n.jpg'
  }),
  features: [
    new vision.Feature('FACE_DETECTION', 1),
    new vision.Feature('LABEL_DETECTION', 10),
    new vision.Feature('SAFE_SEARCH_DETECTION', 10),
    new vision.Feature('IMAGE_PROPERTIES', 10),
  ]
})


  vision.annotate(request).then((res) => {
    // handling response
    console.log(JSON.stringify(res.responses))
    return returnResponse.status(200).json(res.responses);
 //   returnResponse.status(201).json(res.responses);// send json to browser
  }, (e) => { 
    console.log('Error: ', e)
    return res.status(501).json('Error: ', e); // need an error message
  }) 
}


module.exports = {
  visionGet: visionGet
};