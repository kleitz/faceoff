angular.module('InfamousCriminals')
	.factory('Criminal', Criminal);

Criminal.$inject = ['$resource'];
function Criminal ($resource) {
	return $resource('http://localhost:3000/criminals/:id', { id: '@_id' },{
		update: { method: 'PATCH' }
	});
}