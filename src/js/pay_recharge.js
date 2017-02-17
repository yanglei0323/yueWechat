// 充值支付控制器
index.controller('payRechargeCtrl',['$scope', '$http', '$location', '$rootScope',
	function ($scope, $http, $location, $rootScope) {
	
	var order = $location.search();
	$scope.id = order.id;
	$scope.time = order.time;
	$scope.price = order.price;
	$scope.type = order.type;

	$scope.recommender = 'hugotan';

	(function init() {
		if ($rootScope.designer) {
			$scope.designer = $rootScope.designer;
		}
	})();

	// 选择推荐人
	$scope.selectRecommender = function () {
		$location.path('select_store');
	};

	// 点击立即支付
	$scope.pay = function () {
		// 首先判断有没有选择推荐人
		if ($scope.designer) {
			var data = {
				orderid: $scope.id,
				designerid: $scope.designer.id
			};
			$http.post('/user/updaterecommend.json', data, postCfg)
			.success(function (resp) {
				if (1 === resp.code) {
					// 调用微信支付
					wxPay();
				}
			})
			.error(function (resp) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
	};

	function wxPay() {
		var data = {
			orderid: $scope.id,
			channel: 'wx_pub',
			code: sessionStorage.getItem('wxCode')
		};
		$http.post('/pay/getpingcharge.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				pingpp.createPayment(JSON.stringify(resp.data), function (ret, err) {
					console.log(ret, err);
					// ret.result取值可能为'success','fail','cancel','invalid'
					if (ret && ret.result) {
						switch (ret.result) {
							case 'success':
							    alert('支付成功');
							    break;
							case 'fail':
							    alert('支付失败');
							    break;
							default:
							    break;
						}
					}
					if (err && 0 === err.code) {
						alert(err.msg);
					}
				});
			}
		});
	}

}]);