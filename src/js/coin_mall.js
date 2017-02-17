index.controller('coinMallCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	$scope.page = 1;
	$scope.goodsList = [];

	(function init() {
		// 初始化获取积分
		$http.post('/user/mine.json', postCfg)
		.success(function (resp) {
			if (1 === resp.code) {
				$scope.coin = resp.data.score;
			}
			else if (-1 === resp.code) {
				$location.path('login');
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	function getGoods() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			page: $scope.page
		};
		$http.post('/integralshop/integral/home.json', data, postCfg)
		.success(function (resp) {
			if (1 === resp.code) {
				var goodsList = resp.data.goodslist;
				if (goodsList.length > 0) {
					for (var i = 0, j = goodsList.length; i < j; i++) {
						goodsList[i].imgurl = picBasePath + goodsList[i].imgurl;
						$scope.goodsList.push(goodsList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					$scope.loaded = true;
				}
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getGoods = getGoods;

	// 跳转到兑换记录
	$scope.toChangeRecord = function () {
		$location.path('change_record');
	};

	// 跳转到商品详情
	$scope.toGoods = function (goods) {
		$location.path('coin_goods').search({id: goods.id});
	};
}]);