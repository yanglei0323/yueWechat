index.controller('changeRecordDetailCtrl',
	['$scope', '$http', '$location', '$window', '$q', '$rootScope', '$routeParams',
	function ($scope, $http, $location, $window, $q, $rootScope, $routeParams) {
	
	$scope.deferred = $q.defer();
	$scope.id = $location.search().id;
	$scope.type = $location.search().type;

	$scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});

	(function init() {
		var data = {
			id: $scope.id,
			type: $scope.type
		};
		$http.post('/integralshop/integral/record.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				var goods = resp.data;
				for (var i = 0; i < goods.imglist.length; i++) {
					goods.imglist[i].imgurl = picBasePath + goods.imglist[i].imgurl;
				}
				$scope.goods = goods;
				console.log(goods);
			}
			else if (-1 === resp.code) {
				$location.path('login');
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

}]);