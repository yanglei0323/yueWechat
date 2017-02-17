index.controller('selectDesignerCtrl',
	['$scope', '$http', '$window', '$location', '$routeParams', '$rootScope',
	function ($scope, $http, $window, $location, $routeParams, $rootScope) {

	var storeId = $routeParams.store_id;

	$scope.designerList = [];
	$scope.page = 1;

	// 获取发型师列表
	function getDesignerInfo () {
		var data;
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		data = {
			page: $scope.page,
			storeid: storeId
		};
		$http.post('/designer/list.json', data, postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				var starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png';
				var designerList = resp.data.data.designerlist;
				if (designerList.length > 0) {
					for (var i = 0; i < designerList.length; i++) {
						designerList[i].starUrl = [];
						designerList[i].avatar = picBasePath + designerList[i].avatar;
						designerList[i].imgurl = picBasePath + designerList[i].imgurl;
						for (var j = 0; j < designerList[i].score; j++) {
		                    designerList[i].starUrl.push({'path': starUrl1});
		                }
		                for (var k = j; k < 5; k++) {
		                    designerList[i].starUrl.push({'path': starUrl2});
		                }
		                $scope.designerList.push(designerList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					$scope.loaded = true;
				}
			}
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.getDesignerInfo = getDesignerInfo;

	// 选择发型师
	$scope.selectDesigner = function (designer) {
		$rootScope.designer = designer;
		// $window.history.go(-2);
		$location.path('go_pay');
	};
	$scope.tback = function () {
		$location.path('select_store');
	};
}]);