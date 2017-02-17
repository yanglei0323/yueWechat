index.controller('myBalanceCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	// 初始化
	(function init() {
		// 获取当前余额
		$http.post('/user/getcurrentbalance.json', postCfg)
		.success(function (resp) {
			if (-1 === resp.code) {
				$location.path('login');
				return;
			}
			if (1 === resp.code) {
				$scope.balance = resp.data.balance;
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
		// 获取vip信息
		$http.post('/user/getallvip.json', postCfg)
		.success(function (resp) {
			if (-1 === resp.code) {
				$location.path('login');
				return;
			}
			if (1 === resp.code) {
				var vipList = resp.data.viplist;
				for (var i = 0; i < vipList.length; i++) {
					vipList[i].imgurl = picBasePath + '/' + vipList[i].imgurl;
					vipList[i].style = {
						'background-image': 'url(' + vipList[i].imgurl + ')',
						'background-size': '100% 100%'
					};
				}
				$scope.vipList = vipList;
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	// 立即充值
	$scope.recharge = function (item) {
		$scope.payMoney = item.price;
		var data = {
			paymoney: item.price
		};
		$http.post('/user/buyvipfirststep.json', data, postCfg)
		.success(function (resp) {
			var vipList;
			if (1 === resp.code) {
				vipList = resp.data.viplist;
				$scope.vipId = vipList[0].id;
				buyVipSecondStep();
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	function buyVipSecondStep() {
		var data = {
			vipid: $scope.vipId,
			paymoney: $scope.payMoney,
		};
		$http.post('/user/buyvipsecondstep.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				// 下单成功，跳转到充值支付页面
				var order = resp.data;
				$location.path('pay_recharge').search({
					id: order.id,
					time: order.time,
					price: order.price,
					type: order.type
				});
				return;
			}
			else if (0 === resp.code) {
				alert(resp.reason);
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}
}]);