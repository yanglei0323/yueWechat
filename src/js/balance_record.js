index.controller('balanceRecordCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	$scope.isConsume = true;
	$scope.type = 0;
	$scope.page = 1;
	$scope.recordList = [];

	// 获取记录列表
	function getRecordList() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			page: $scope.page,
			type: $scope.type
		};
		$http.post('/user/mybalancerecord2_1.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				var recordList = resp.data.balancelist;
				if (0 === recordList.length && 1 === $scope.page) {
					$scope.hasNoRecord = true;
					$scope.loaded = true;
					return;
				}
				else {
					$scope.hasNoRecord = false;
					$scope.loaded = false;
					if (recordList.length > 0) {
						for (var i = 0; i < recordList.length; i++) {
							$scope.recordList.push(recordList[i]);
						}
						$scope.loading = false;
						$scope.page += 1;
					}
					else {
						$scope.loaded = true;
					}
				}
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getRecordList = getRecordList;

	$scope.select = function (type) {
		if (type === $scope.type) {
			return;
		}
		$scope.hasNoRecord = false;
		$scope.recordList = [];
		$scope.page = 1;
		$scope.type = type;
		$scope.loading = false;
		$scope.loaded = false;
		$scope.isConsume = 0 === type ? true : false;
		getRecordList();
	};
}]);