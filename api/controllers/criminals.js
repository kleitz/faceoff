var Criminal = require('../models/Criminal');

// GET
function getAll(request, response) {
  Criminal.find(function(error, criminals) {
    if(error) response.status(404).send(error);
    response.status(200).send(criminals);
  }).select('-__v');
}

// POST
function createCriminal(request, response) {
  var criminal = new Criminal(request.body);

  criminal.save(function(error) {
    if(error) response.status(500).send(error);
    response.status(201).send(criminal);
  });
}

// GET
function getCriminal(request, response) {
  var id = request.params.id;

  Criminal.findById({_id: id}, function(error, criminal) {
    if(error) response.status(404).send(error);
    response.status(200).send(criminal);
  }).select('-__v');
}

function updateCriminal(request, response) {
  var id = request.params.id;

  Criminal.findById({_id: id}, function(error, criminal) {
    if(error) response.status(404).send(error);

    if(request.body.name) criminal.name = request.body.name;
    if(request.body.location) criminal.location = request.body.location;
    if(request.body.status) criminal.status = request.body.status;

    criminal.save(function(error) {
      if(error) response.status(500).send(error);

      response.status(200).send(criminal);
    });
  }).select('-__v');
}

function removeCriminal(request, response) {
  var id = request.params.id;

  Criminal.remove({_id: id}, function(error) {
    if(error) response.status(404).send(error);

    response.status(204).send();
  }).select('-__v');
}

module.exports = {
  getAll: getAll,
  createCriminal: createCriminal,
  getCriminal: getCriminal,
  updateCriminal: updateCriminal,
  removeCriminal: removeCriminal
};
