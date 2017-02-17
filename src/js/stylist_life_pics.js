index.controller('stylistLifePicsCtrl',
	['$scope', '$http', '$location', '$window', '$timeout',
	function ($scope, $http, $location, $window, $timeout) {
	

	(function init() {
		var params = $location.search();
		$scope.lifePicList = JSON.parse(params.imgArr);
		$scope.index = parseInt(params.index);
		$timeout(function () {
			$scope.commonSwiper.slideTo($scope.index, 0, false);
		});
	})();
	
}]);