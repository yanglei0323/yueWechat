index.controller('fashionInfoCtrl',
	['$scope', '$http', '$location', '$window', '$q',
	function ($scope, $http, $location, $window, $q) {
	
	$scope.deferred = $q.defer();
	$scope.page = 1;    // 页数
	$scope.type = 1;    // type值为1代表悦人物，2代表悦时尚
	$scope.fashionInfoList = [];

	$scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});

	// 时尚资讯轮播图
	$http.post('/home/fashionnews/home.json', postCfg)
	.success(function (resp) {
		if (1 === resp.code) {
			var fashionNewsList = resp.data.fashionnewslist;
			for (var i = 0; i < fashionNewsList.length; i++) {
				fashionNewsList[i].imgurl = picBasePath + fashionNewsList[i].imgurl;
			}
			$scope.fashionNewsList = fashionNewsList;
		}
	})
	.error(function (resp) {
		// alert('数据请求失败，请稍后再试！ ');
	});

	// 时尚资讯头条
	$http.post('/home/fashionnews/top.json', postCfg)
	.success(function (resp) {
		if (1 === resp.code) {
			var headline = resp.data.fashionnewslist[0];
			$scope.headline = headline;
		}
	})
	.error(function () {
		// alert('数据请求失败，请稍后再试！');
	});

	// 获取悦人物和悦时尚
	function getFashionInfo() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			type: $scope.type,
			page: $scope.page
		};
		$http.post('/home/fashionnews/search.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				var fashionInfoList = resp.data.fashionnewslist;
				if (fashionInfoList.length > 0) {
					for (var i = 0; i < fashionInfoList.length; i++) {
						fashionInfoList[i].imgurl = picBasePath + fashionInfoList[i].imgurl;
						$scope.fashionInfoList.push(fashionInfoList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					$scope.loaded = true;
				}
			}
		})
		.error(function () {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getFashionInfo = getFashionInfo;

	// 点击轮播图
	$scope.jump = function (item) {
		$window.location.href = item.jumpurl;
	};

	// 点击头条
	$scope.toHeadline = function () {
		$window.location.href = $scope.headline.jumpurl;
	};
	// 点击列表
	$scope.toFashionInfo = function (item) {
	    $window.location.href = item.jumpurl;
	};

	// 点击悦人物或悦资讯
	$scope.selectTab = function (type) {
		if (type == $scope.type) {
			return;
		}
		$scope.type = type;
		$scope.page = 1;
		$scope.loading = false;
		$scope.loaded = false;
		$scope.fashionInfoList = [];
		getFashionInfo();
	};

}]);