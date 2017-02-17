index.controller('goodsDetailImgCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	(function init() {
		var url = $location.search().url;
		$scope.imgurl = url;
	})();
	


}]);