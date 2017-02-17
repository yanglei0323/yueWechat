index.controller('stylistWorkDetailCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams', '$rootScope',
	function ($scope, $http, $location, $window, $routeParams, $rootScope) {

	var workId = $routeParams.id;
	$scope.title = $location.search().name;
	$scope.workPage = 1;
	$scope.workPicList = [];
	$rootScope.newdesignzp = true;

	(function init() {
		// var data = {
		// 	designerworkid: workId,
		// 	page: $scope.page
		// };
		// // 获取发型师作品列表
		// $http.post('/designer/workpic.json', data, postCfg)
		// .success(function (data) {
		// 	if (1 === data.code) {
		// 		var workPicList = data.data.designerworkpiclist;
		// 		for (var i = 0; i < workPicList.length; i++) {
		// 			workPicList[i].imgurl = picBasePath + workPicList[i].imgurl;
		// 			$scope.workPicList.push(workPicList[i]);
		// 		}
		// 	}
		// })
		// .error(function (data) {
		// 	alert('数据请求失败，请稍后再试！');
		// });
	})();

	$scope.getWorks = getWorks;
	
	// 获取发型师作品
	function getWorks() {
		if ($scope.workLoading) {
			return;
		}
		$scope.workLoading = true;
		var data = {
			designerworkid: workId,
			page: $scope.workPage
		};
		$http.post('/designer/workpic.json', data, postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				var workPicList = resp.data.data.designerworkpiclist;
				if (workPicList.length > 0) {
					for (var i = 0; i < workPicList.length; i++) {
						workPicList[i].imgurl = picBasePath + workPicList[i].imgurl;
						$scope.workPicList.push(workPicList[i]);
					}
					$scope.workLoading = false;
					$scope.workPage += 1;
				}
				else {
					$scope.workLoaded = true;
				}
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

}]);