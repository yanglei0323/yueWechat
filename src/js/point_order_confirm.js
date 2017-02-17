index.controller('pointOrderConfirmCtrl',
	['$scope', '$http', '$location',
	function ($scope, $http, $location) {
	
	var goods = JSON.parse($location.search().goods),
	    buyNum = parseInt($location.search().buyNum);
	goods.imgurl = goods.imgarray[0].imgurl;
	goods.countPrice = parseFloat(goods.price) * buyNum;
	goods.countIntegral = parseInt(goods.integral) * buyNum;
	$scope.goods = goods;
	$scope.buyNum = buyNum;

	// 默认取货方式为邮寄
    $scope.type = "address";

    (function init() {
    	setSite();
    	getFreight();
    })();

    // 获取运费
	function getFreight() {
		$http.post('/integralshop/getfreightcharges.json', {paymoney: goods.countPrice}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				$scope.freight = data.data.freightcharges;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	// 设置用户收货地址
	function setSite() {
		if (sessionStorage.getItem('site')) {
			$scope.hasSite = true;
			$scope.site = JSON.parse(sessionStorage.getItem('site'));
		}
		else {
			// 将地址设置为默认地址
		    $http.post('/user/myaddress.json', postCfg)
		    .then(function (resp) {
		    	if (-1 === resp.data.code) {
		    		// 用户未登录
		    		$location.path('login');
		    	}
		    	else if (1 === resp.data.code) {
		    		// 获取默认收货地址
		    		var siteArr = resp.data.data.addresslist;
		    		for (var i = 0, j = siteArr.length; i < j; i++) {
		    			if (1 === siteArr[i].defaultflag) {
		    				$scope.hasSite = true;
		    				$scope.site = siteArr[i];
		    				break;
		    			}
		    		}
		    	}
		    });
		}
	}

	// 选择收货方式
	$scope.chooseReceiveType = function (typeIndex) {
		switch (typeIndex) {
			case 1:
				// 
			    $scope.type = "address";
			    break;
			case 2:
				$scope.type = 'score';
				break;
		}
	};

	// 跳转到选择地址界面
	$scope.selectAddress = function (addr) {
		if (addr) {
			$location.path('address').search({current_id: addr.id});
		}
		else {
			$location.path('address');
		}
		
	};

	$scope.orderConfirm = function () {
		$location.path('change_tip');
	};

	// 确认下单
	$scope.orderConfirm = function () {
		var data, url;
		if (goods.couponflag === 0) {
			// 普通商品
			data = {
				goodsid: goods.id,
				num: buyNum,
				type: $scope.type,
				addressid: $scope.site.id || 0,
				remark: $scope.remark,
				freightcharges: $scope.freight
			};
			url = '/user/purchaseintegralgoods.json';
		}
		else {
			// 优惠券商品
			data = {
				goodsid: goods.id,
				num: buyNum
			};
			url = '/user/purchasecoupon.json';
		}
		$http.post(url, data, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
				return;
			}
			if (0 === data.code) {
				alert(data.reason);
				return;
			}
			if (1 === data.code) {
				// 下单成功，跳转到支付页面
				alert('下单成功!');
				$location.path('pay_goods/' + data.data.id).replace().search({origin: 'point'});
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

}]);