index.controller('remarkDesignerCtrl',
	['$scope', '$routeParams', '$http', '$location', '$window',
	function ($scope, $routeParams, $http, $location, $window) {

	var orderId = $routeParams.order_id;
	$scope.starNum = 5;
	
	// 根据订单号获取信息
	$http.post('/user/cometoevaluatedesigner.json', {consumerorderid: orderId}, postCfg)
	.success(function (data) {
		console.log(data);
		if (1 === data.code) {
			var designer = data.data.designer;
			var remarkList = data.data.remarklist;
			designer.imgurl = picBasePath + designer.imgurl;
			$scope.designer = designer;
			$scope.remarkList = remarkList;
		}
	})
	.error(function (data) {
		console.log(data);
		// alert('数据请求失败，请稍后再试！');
	});

	// 选择标签
	$scope.selectRemark = function (remark) {
		remark.selected = !remark.selected;
	};

	// 对服务打星
	$scope.starOrder = function (num) {
		$scope.starNum = num;
	};

	// 是否选中匿名提交
	$scope.checkAnonymity = function () {
		$scope.anonymity = !$scope.anonymity;
	};

	// 提交评价
	$scope.submit = function () {
		var tabs = [];
		var flag = $scope.anonymity ? 1: 0;
		for (var i = 0; i < $scope.remarkList.length; i++) {
			var remark = $scope.remarkList[i];
			if (remark.selected) {
				tabs.push(remark.id);
			}
		}
		var data = {
			orderid: orderId,
			tabs: tabs,
			score: $scope.starNum,
			content: $scope.content,
			anonymousflag: flag
		};
		$http.post('/user/evaluatedesigner.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
			}
			if (1 === data.code) {
				alert('评价成功！');
				$window.history.back();
			}
		})
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});
	};
}]);