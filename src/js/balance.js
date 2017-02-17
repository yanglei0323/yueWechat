index.controller('balanceCtrl', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {

	$scope.page = 1;
	$scope.balanceList = [];
	var startTime, endTime;

	// 获取当前余额
	$http.post('/user/getcurrentbalance.json', postCfg)
	.success(function (data) {
		if (-1 === data.code) {
			$location.path('login');
			return;
		}
		if (1 === data.code) {
			$scope.balance = data.data.balance;
		}

	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});
	
	$scope.getBalanceList = getBalanceList;

	function getBalanceList() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data;
		if (!$scope.filter) {
			data = {
				page: $scope.page
			};
			$http.post('/user/mybalancerecord.json', data, postCfg)
			.then(function (resp) {
				data = resp.data;
				if (-1 === data.code) {
					$location.path('login');
					return;
				}
				if (1 === data.code) {
					var balanceList = data.data.balancelist;
					if (balanceList.length > 0) {
						for (var i = 0; i < balanceList.length; i++) {
							$scope.balanceList.push(balanceList[i]);
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
		else {
			data = {
				page: $scope.page,
				type: $scope.filterType,
				starttime: startTime,
				endtime: endTime
			};
			$http.post('/user/searchbalancerecord.json', data, postCfg)
			.success(function (data) {
				console.log(data);
				if (-1 === data.code) {
					$location.path('login');
					return;
				}
				if (1 === data.code) {
					var balanceList = data.data.balancelist;
					if (balanceList.length > 0) {
						for (var i = 0; i < balanceList.length; i++) {
							$scope.balanceList.push(balanceList[i]);
						}
						$scope.loading = false;
						$scope.page += 1;
					}
					else {
						$scope.loaded = true;
					}
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		
	}

	$scope.setFilter = function (type) {
		if ($scope.filterType === type) {
			$scope.filterType = 0;
		}
		else {
			$scope.filterType = type;
		}

	};

	$scope.showFilter = function () {
		$scope.isFiltering = !$scope.isFiltering;
	};

	// 确认筛选
	$scope.confirmFilter = function () {
		var year, month, day;
		$scope.loaded = false;
		$scope.loading = false;
		$scope.page = 1;
		$scope.balanceList = [];
		$scope.isFiltering = false;
		if (!$scope.filterType && !$scope.startTime && !$scope.endTime) {
			$scope.filter = false;
		}
		else {
			$scope.filter = true;
			if ($scope.startTime) {
				year = $scope.startTime.getFullYear();
				month = $scope.startTime.getMonth() + 1 < 10 ? '0' + ($scope.startTime.getMonth() + 1)
				: $scope.startTime.getMonth() + 1;
				day = $scope.startTime.getDate() < 10 ? '0' + $scope.startTime.getDate() :
				$scope.startTime.getDate();
				startTime = year + '-' + month + '-' +day;
			}
			else {
				startTime = $scope.startTime;
			}
			if ($scope.endTime) {
				year = $scope.endTime.getFullYear();
				month = $scope.endTime.getMonth() + 1 < 10 ? '0' + ($scope.endTime.getMonth() + 1)
				: $scope.endTime.getMonth() + 1;
				day = $scope.endTime.getDate() < 10 ? '0' + $scope.endTime.getDate() :
				$scope.endTime.getDate();
				endTime = year + '-' + month + '-' +day;
			}
			else {
				endTime = $scope.endTime;
			}
		}
	};

	$scope.hideFilter = function () {
		$scope.isFiltering = false;
	};

	$scope.preventHideFilter = function (e) {
		e.stopPropagation();
	};
}]);