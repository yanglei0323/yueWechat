index.controller('addReceiverCtrl',
	['$scope', '$http', '$location', '$rootScope', '$window',
	function ($scope, $http, $location, $rootScope, $window) {

	// 初始化判断是否有值传过来
	function init() {
		if ($location.search().addr_id) {
			$scope.id = $location.search().addr_id;
			// 通过id获取地址
			$http.post('/user/getaddressbyid.json', {id: $location.search().addr_id}, postCfg)
			.success(function (data) {
				if (-1 === data.code) {
					$rootScope.preUrl = $location.url();
					$location.path('login');
				}
				else if (1 === data.code) {
					var addr = data.data;
					console.log(addr);
					$scope.name = addr.name;
					$scope.phone = addr.telephone;
					$scope.city = addr.city;
					$scope.address = addr.address;
				}
			})
			.error(function (data) {
				console.log(data);
			});
		}
	}

	init();

	$scope.save = function () {
		var data = {
			name: $scope.name,
			telephone: $scope.phone,
			city: '北京',
			address: $scope.address
		},
		    postUrl = '/user/addaddress.json';
		// 判断更新地址还是添加新地址
		if ($scope.id) {
			data.id = $scope.id;
			postUrl = '/user/updateaddress.json';
		}
		$http.post(postUrl, data, postCfg)
		.then(function (resp) {
			console.log(resp);
			if (-1 === resp.data.code) {
				// 用户未登录
				$rootScope.preUrl = $location.url();
				$location.path('login');
			}
			else if (1 === resp.data.code) {
				alert('添加地址成功！');
				$window.history.back();
			}
		}, function (resp) {
			console.log(resp);
		});
	};


}]);