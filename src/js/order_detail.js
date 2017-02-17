index.controller('orderDetailCtrl',
	['$scope', '$http', '$location', '$routeParams', '$window',
	function ($scope, $http, $location, $routeParams, $window) {
	
	var orderId = $routeParams.id;
	// 获取订单详情
	$http.post('/user/goodsorderdetail.json', {id: orderId}, postCfg)
	.success(function (data) {
		console.log(data);
		if (1 === data.code) {
			var order = data.data;
			for (var i = 0; i < order.goodslist.length; i++) {
				order.goodslist[i].imgurl = picBasePath + order.goodslist[i].imgurl;
			}
			$scope.order = order;
		}
		else if (-1 === data.code) {
			$location.path('login');
		}
	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});

	// 去支付
	$scope.toPay = function (order) {
		$location.path('pay_goods/' + order.id);
	};

	// 去评论商品订单
	$scope.toRemarkGoods = function (order) {
		$location.path('order_comment/' + order.id);
	};

	// 商品确认收货
	$scope.confirmReceipt = function (order) {
		$http.post('/user/confirmreceipt.json', {orderid: order.id}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				alert('确认收货成功！');
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 商城订单申请退款
	$scope.applyRefund = function (order) {
		// 跳转到申请退款页面
		$location.path('refund/' + order.id);
	};

	// 取消商城订单
	$scope.cancelGoodsOrder = function (goods) {
		var data = {
			id: goods.id,
			flag: 2,
			page: 1
		};
		$http.post('/user/cancelgoodsorder.json', data, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				// 订单取消成功
				alert('订单取消成功！');
				// 取消后返回上一页
				$window.history.back();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 删除商城订单
	$scope.deleteGoodsOrder = function (goods) {
		$http.post('/user/deletegoodsorder.json', {orderid: goods.id}, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				// 订单删除成功
				alert('订单删除成功！');
				// 删除后返回上一页
				$window.history.back();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	$scope.toGoodsDetail = function (goods) {
		$location.path('mall_goods_detail/' + goods.id).search({});
	};
}]);