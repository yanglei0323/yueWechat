index.controller('refundCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams', 'Upload',
	function ($scope, $http, $location, $window, $routeParams, Upload) {

	var orderId = $routeParams.id;
	// 获取退款原因列表
	$http.post('/shop/getrefundreason.json', postCfg)
	.success(function (data) {
		console.log(data);
		if (1 === data.code) {
			$scope.reasonList = data.data.reasonlist;
		}
	})
	.error(function (data) {
		// alert('数据获取失败，请稍后再试！');
	});

	$scope.submit = function () {
		if (!$scope.reasonFlag || parseInt($scope.reasonFlag) === 0) {
			alert('请选择退款原因！');
			return;
		}
		if (!$scope.describe || $scope.describe === '') {

		}
		var data = {
			id: orderId,
			reasonflag: parseInt($scope.reasonFlag),
			describe: $scope.describe,
			imgs: [$scope.pic1, $scope.pic2, $scope.pic3]
		};
		Upload.upload({
			url: '/shop/goodsorderrefund.json',
			data: data
		}).then(function (resp) {
			console.log(resp);
			if (-1 === resp.data.code) {
				$location.path('login');
				return;
			}
			if (1 === resp.data.code) {
				alert('提交成功，请耐心等待!');
				$window.history.back();
			}
		}, function (resp) {
			console.log(resp);
		});
	};
}]);