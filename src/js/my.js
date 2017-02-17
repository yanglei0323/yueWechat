index.controller('myCtrl',
	['$scope', '$http', '$location', '$rootScope', '$timeout', function ($scope, $http, $location, $rootScope, $timeout) {

	(function init() {
		// 请求用户信息
		$http.post('/user/mine.json', postCfg)
		.success(function (resp) {
			console.log(resp);
			if (-1 === resp.code) {
				// 用户未登录
				$scope.isLogin = false;
			}
			else if (1 === resp.code) {
				$scope.isLogin = true;
				var user = resp.data;
				user.imgurl = picBasePath + user.imgurl;
				user.vip.smallimgurl = picBasePath + user.vip.smallimgurl;
				$scope.user = user;
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	$rootScope.desingopay = 0;
	function checkLogin() {
		if (!sessionStorage.user) {
			// 用户未登录，跳转到登录页面
			$location.path('login');
			return;
		}
		var user = JSON.parse(sessionStorage.user);
		if (user.nickname === '') {
			// 跳转到完善信息
			alert('请填写您的昵称!');
			$location.path('complete_info').search({type: 'modify'});
			return;
		}
	}

	$scope.navigate = function (index) {
		switch (index) {
			case 1:
				$timeout(function () {
					$location.path('/');
				}, 0);
				break;
			case 2:
				$timeout(function () {
					$location.path('stylist');
				}, 0);
				break;
			case 3:
				$timeout(function () {
					$location.path('go_pay');
				}, 0);
				break;
			case 4:
				$timeout(function () {
					$location.path('mall');
				}, 0);
				break;
			case 5:
				$timeout(function () {
					$location.path('my');
				}, 0);
				break;
		}
	};

	$scope.toEditInfo = function () {
		if (!sessionStorage.user) {
			$location.path('login');
			return;
		}
		$location.path('edit_info');
	};

	// 点击悦币跳转到悦币商城
	$scope.toCoinMall = function () {
		$location.path('coin_mall');
	};

	// 点击余额跳转到我的余额
	$scope.toBalance = function () {
		$location.path('my_balance');
	};

}]);