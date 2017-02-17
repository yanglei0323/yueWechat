index.controller('getInvitationCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {

	var code = $location.search().recCode;
	$scope.get = function () {
		// 校验电话号码
		var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
		if (!phoneRe.test($scope.phone)) {
            alert('手机号无效！');
            return;
        }
		var data = {
			telephone: $scope.phone,
			code: code
		};
		$http.post('/invite/register.json', data, postCfg)
		.success(function (resp) {
			if (1 === resp.code) {
				alert('恭喜陛下领取成功！');
				$location.path('download_page').search({phone: $scope.phone});
			}
			else if (0 === resp.code) {
				alert(resp.reason);
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

}]);