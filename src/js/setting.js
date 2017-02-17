index.controller('settingCtrl',
	['$scope', '$location', '$http', '$timeout',
	function ($scope, $location, $http, $timeout) {
	(function init() {
		if (sessionStorage.user) {
			$scope.isLogin = true;
		}
	})();
	$scope.logout = function () {
		$http.post('/user/logout.json', postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				// 退出成功，清除sessionStorage
				sessionStorage.removeItem('user');
				alert('退出登录成功！');
				// 此时应该跳转到登录界面
				$location.path('login');
			}
		}, function (resp) {
			// alert('数据请求失败!请稍后再试');
		});
	};
	// 到使用须知
	$scope.toUseMsg = function () {
		$location.path('use_msg');
	};

	// 到关于我们
	$scope.toAboutUs = function () {
		$location.path('about_us');
	};

	// 到意见反馈
	$scope.toFeedback = function () {
		$location.path('feedback');
	};
	// 设置密码
	$scope.toforgetpwd = function () {
		$location.path('forget_pwd').search({type: 'pay'});
	};
}]);
