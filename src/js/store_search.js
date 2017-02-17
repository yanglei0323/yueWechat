index.controller('storeSearchCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	// 首页搜索
	$scope.search = function () {
		if (!$scope.word || $.trim($scope.word) === '') {
			alert('请输入搜索关键字！');
			return;
		}
		var data = {
			kind: 'store',
			q: $scope.word,
			page: 1,
			// areaid: 
		};
		$http.post('/home/search.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var storeList = data.data.storelist,
				    starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png',
		            i, j, k;
		        if (storeList.length === 0) {
		        	$scope.hasNoResult = true;
		        }
		        else {
		        	$scope.hasNoResult = false;
		        	// 处理门店数据
					for (i = 0; i < storeList.length; i++) {
						storeList[i].img = picBasePath + storeList[i].imgurl[0];
						storeList[i].starUrl = [];
						for (j = 0; j < storeList[i].star; j++) {
		                    storeList[i].starUrl.push({'path': starUrl1});
		                }
		                for (k = j; k < 5; k++) {
		                    storeList[i].starUrl.push({'path': starUrl2});
		                }
					}
					$scope.storeList = storeList;
		        }
				
			}
		})
		.error(function (data) {
			console.log(data);
		});
	};

	// 跳转到门店详情
	$scope.toStoreDetail = function (store) {
		$location.path('store_detail/' + store.id);
	};

}]);