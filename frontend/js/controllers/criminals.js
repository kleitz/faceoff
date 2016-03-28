angular.module('InfamousCriminals')
.controller('CriminalsController', CriminalsController);

CriminalsController.$inject = [ 'Criminal'];
function CriminalsController(Criminal) {

	var self = this;

  // get: { method: 'GET'},
  // save: { method: 'POST'},
  // query: { method: 'GET', isArray: true },
  // remove: { method: 'DELETE'},
  // delete: { method: 'DELETE'}

  this.all = Criminal.query();
  //this.criminal = {};
  this.criminal = {};
  

  this.selectCriminal = function(criminal) {
  	self.criminal = Criminal.get({id: criminal._id});
  	console.log(criminal);
  	self.criminal = self.criminal;
  };

  this.addCriminal = function(criminal){
  	if (criminal._id) {
  		Criminal.update(criminal, function(){
  			self.criminal = {};
  			self.all = Criminal.query();
  		});
  	} else { Criminal.save(this.criminal, function(){
  		self.all.push(self.criminal);
  	});
  }
};

this.deleteCriminal = function(criminal){
	Criminal.delete({ id: criminal._id })
	var index = self.all.indexOf(criminal);
	self.all.splice(index, 1)
}

// this.editCriminal = function(criminal){
// 	self.criminal = criminal;
// 	Criminal.update(self.criminal, function(){
// 		self.criminal = {};
// 	});
// } 
}
