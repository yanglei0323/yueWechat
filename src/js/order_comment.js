index.controller('orderCommentCtrl',
	['$scope', '$http', '$location', '$routeParams', '$window',
	function ($scope, $http, $location, $routeParams, $window) {

	var orderId = $routeParams.id;

	// 获取订单详情
	$http.post('/user/goodsorderdetail.json', {id: orderId}, postCfg)
	.success(function (data) {
		console.log(data);
		if (-1 === data.code) {
			$location.path('login');
		}
		if (1 === data.code) {
			var goodsList = data.data.goodslist;
			for (var i = 0; i < goodsList.length; i++) {
				goodsList[i].imgurl = picBasePath +goodsList[i].imgurl;
				goodsList[i].overallStar = 0;
				goodsList[i].describeStar = 0;
				goodsList[i].attitudeStar = 0;
				goodsList[i].deliveryStar = 0;
			}
			$scope.goodsList = goodsList;
		}
	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});

	$scope.starGoods = function (goods, type, num) {
		goods[type] = num;
	};

	// 是否选中匿名
	$scope.checkAnonymity = function () {
		$scope.anonymity = !$scope.anonymity;
	};

	// 提交评论
	$scope.submit = function () {
		var goodsId = [],
			overallStar = [],
			describeStar = [],
			attitudeStar = [],
			deliveryStar = [],
			content = '';
		for (var i = 0; i < $scope.goodsList.length; i++) {
			var goods = $scope.goodsList[i];
			if (goods.overallStar === 0 || goods.describeStar === 0 || goods.attitudeStar === 0 ||
				goods.deliveryStar === 0) {
				alert('请对商品进行评分！');
				return;
			}
			if (!goods.content || goods.content === '') {
				alert('请输入评论内容！');
				return;
			}
			goodsId.push(goods.id);
			overallStar.push(goods.overallStar);
			attitudeStar.push(goods.attitudeStar);
			describeStar.push(goods.describeStar);
			deliveryStar.push(goods.deliveryStar);
			content = goods.content + ((i === $scope.goodsList.length - 1) ? '' : '%#&#%');
		}
	    var anonymousFalg = $scope.anonymity ? 1 : 0;
		var data = {
			goodsid: goodsId,
			overallstar: overallStar,
			describestar: describeStar,
			attitudestar: attitudeStar,
			deliverystar: deliveryStar,
			content: content,
			anonymousflag: anonymousFalg,
			orderid: orderId,
		};
		$http.post('/shop/commentgoods.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				alert('评论成功！');
				$window.history.back();
			}
			else if (0 === data.code) {
				alert(data.reason);
				return;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};
	
}]); 