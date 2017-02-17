index.controller('fashionInformationCtrl',
    ['$scope', '$http', '$location', '$window',
    function ($scope, $http, $location, $window) {
	

	$scope.loading = false;
    $scope.loaded = false;
    $scope.page = 1;
    $scope.type = 'recommend';
    $scope.fashionInfoList = [];

	// 跳转到时尚资讯
	$scope.toFashionNews = function (news) {
		$window.location.href = news.jumpurl;
	};

	function getFashionInfo() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		// 时尚发型列表
		$http.post('/home/fashionnews.json', {'page': $scope.page, sort: $scope.type}, postCfg)
		.then(function (resp) {
			console.log(resp);
			if (1 === resp.data.code) {
				var fashionInfoList = resp.data.data.fashionnewslist;
				if (fashionInfoList.length > 0) {
					for (var i = 0, j = fashionInfoList.length; i < j; i++) {
						fashionInfoList[i].bigimg = picBasePath + fashionInfoList[i].bigimg;
						$scope.fashionInfoList.push(fashionInfoList[i]);
					}
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
	$scope.getFashionInfo = getFashionInfo;

	// 时尚发型按类型排序
	$scope.sort = function (type) {
		if ($scope.type && $scope.type === type) {
			return;
		}
		$scope.type = type;
		$scope.fashionInfoList = [];
		$scope.page = 1;
		$scope.loaded = false;
		$scope.loading = false;
		getFashionInfo();
	};
}]);