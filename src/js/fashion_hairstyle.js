index.controller('fashionHairStyleCtrl',
    ['$scope', '$http', '$location', function ($scope, $http, $location) {


    $scope.loading = false;
    $scope.loaded = false;
    $scope.page = 1;
    $scope.type = 'default';
    $scope.fashionHairList = [];

	// 跳转到时尚发型详情
	$scope.showHairInfo = function (hair) {
		$location.path('fashion_hair_info').search({page: hair.page, index: hair.index});
	};

	function getFashionHair() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		// 时尚发型列表
		$http.post('/home/fashionhair.json', {'page': $scope.page, sort: $scope.type}, postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				var fashionHairList = resp.data.data.fashionhairlist;
				if (fashionHairList.length > 0) {
					for (var i = 0, j = fashionHairList.length; i < j; i++) {
						fashionHairList[i].page = $scope.page;
						fashionHairList[i].index = i;
						fashionHairList[i].imgurl = picBasePath + fashionHairList[i].imgurl;
						$scope.fashionHairList.push(fashionHairList[i]);
					}
					// $scope.fashionHairList = fashionHairList;
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					// 加载完成
					$scope.loaded = true;
				}
				
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}
	$scope.getFashionHair = getFashionHair;

	// 时尚发型按类型排序
	$scope.sort = function (type) {
		if ($scope.type && $scope.type === type) {
			return;
		}
		$scope.type = type;
		$scope.fashionHairList = [];
		$scope.page = 1;
		$scope.loaded = false;
		$scope.loading = false;
		getFashionHair();
	};
}]);