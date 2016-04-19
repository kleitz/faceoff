var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var cloudvisionController = require("../controllers/cloudvision");



/// Cloud Vision Test Get
router.route('/api/cloudvision')
  .put(cloudvisionController.visionGet);



module.exports = router