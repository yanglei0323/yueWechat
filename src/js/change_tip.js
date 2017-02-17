index.controller('changeTipCtrl',
	['$scope', '$http', '$location',
	function ($scope, $http, $location) {

	var orderId = $location.search().orderId,
	    origin = $location.search().origin;
	
	(function init() {
		$scope.orderId = $location.search().orderId;
		$scope.title = $location.search().type === 'pay' ? '支付成功' : '兑换成功';
		$scope.tips = $location.search().type === 'pay' ? '支付成功！' : '恭喜您兑换成功！';
		getRecommendation();
	})();

	// 购买成功后商品推荐
	function getRecommendation() {
		// 获取订单详情
		$http.post('/user/goodsorderdetail.json', {id: orderId}, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				var goods = data.data.goodslist[0];
				data = {
					id: goods.id
				};
				var url = origin === 'point' ? '/integralshop/recommendgoodsafterpay.json' : '/shop/recommendgoodsafterpay.json';
				$http.post(url, data, postCfg)
				.success(function (data) {
					console.log(data);
					var goodsList = data.data.goodslist;
					for (var i = 0; i < goodsList.length; i++) {
						goodsList[i].imgurl = picBasePath + goodsList[i].imgurl1;
					}
					$scope.goodsList = goodsList;
				})
				.error(function () {
					// alert('数据请求失败，请稍后再试！');
				});
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
		
	}

	// 查看订单
	$scope.orderDetail = function () {
		$location.path('order_detail/' + orderId).search({});
	};
	
}]);