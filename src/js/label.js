angular.module('label', []).controller('labelCtrl', ['$scope', '$http', function ($scope, $http) {
	var list = {
			name: "..."
		};
	$scope.addLabel = function () {
		var obj = { name: "..."};
		$scope.list.push(obj);
	};
}]);