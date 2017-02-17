index.controller('inviteCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	// 获取邀请码
	$http.post('/invite/getcode.json', postCfg)
	.success(function (resp) {
		if (1 === resp.code) {
			$scope.recNum = resp.data.recnum;
			$scope.recCode = resp.data.reccode;
		}
		else if (-1 === resp.code) {
			$location.path('login');
		}
	})
	.error(function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	$scope.invite = function () {
		$location.path('get_invitation').search({recCode: $scope.recCode});
	};
}]);