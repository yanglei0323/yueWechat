index.controller('orderConfirmCtrl',
	['$scope', '$http', '$location', '$routeParams', '$rootScope', '$timeout',
	function ($scope, $http, $location, $routeParams, $rootScope, $timeout) {

	$scope.goodsArr = $rootScope.goodsArr;
    $scope.numArr = $rootScope.numArr;
    var cartFlag = $rootScope.cartFlag;
    $scope.totalPrice = 0;
    // 默认取货方式为邮寄
    $scope.type = "address";

    // 初始化执行
	(function init() {
		setSite();
		getTotalPrice();
		getFreight();
		getCoupon();
	})();

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
		    		$location.path('login').search({});
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
		if ($rootScope.selectedStore) {
			$scope.selectedStore = $rootScope.selectedStore;
		}
	}

	// 计算总价
	function getTotalPrice() {
		var totalPrice = 0;
		for (var i = 0; i < $scope.goodsArr.length; i++) {
			totalPrice += $scope.goodsArr[i].price * $scope.numArr[i];
		}
		$scope.totalPrice = totalPrice;
	}

	// 获取运费
	function getFreight() {
		$http.post('/shop/getfreightcharges.json', {paymoney: $scope.totalPrice}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				$scope.freight = data.data.freightcharges;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	// 获取可用的优惠券
	function getCoupon() {
		if (!$rootScope.selectedCoupon) {
			$http.post('/user/mycouponwithprice.json',
				{price: $scope.totalPrice, type: 1}, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					if (0 === data.data.couponlist.length) {
						$scope.noUsefulCoupon = true;
						$scope.couponInfo = '无可用优惠券';
					}
					else {
						$scope.couponInfo = '有' + data.data.couponlist.length + '张优惠券可用';
					}
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		else {
			var coupon = $rootScope.selectedCoupon;
			$scope.couponInfo = coupon.rule;
			$scope.couponId = coupon.id;
		}
	}

	// 跳转到选择地址界面
	$scope.selectAddress = function (addr) {
		// $rootScope.preUrl = $location.url();
		if (addr) {
			$location.path('address').search({current_id: addr.id});
		}
		else {
			$location.path('address').search({});
		}
		
	};

	// 选择收货方式
	$scope.chooseReceiveType = function (typeIndex) {
		switch (typeIndex) {
			case 1:
				// 
			    $scope.type = "address";
			    break;
			case 2:
				$scope.type = 'store';
				// 跳转去选择门店
				// $location.path('select_store');
				break;
		}
	};

	$scope.selectCoupon = function () {
		if ($scope.noUsefulCoupon === true) {
			return;
		}
		$location.path('select_coupon').search({price: $scope.totalPrice, type: 1});
	};

	// 提交订单事件
	$scope.orderConfirm = function () {
		var goodsIdArr = [], addressId;
		for (var i = 0; i < $scope.goodsArr.length; i++) {
			goodsIdArr.push($scope.goodsArr[i].id);
		}
		switch ($scope.type) {
			case 'address':
				if (!$scope.site || !$scope.site.id) {
					alert('请选择收货地址！');
					return;
				}
				addressId = $scope.site.id;
			    break;
			case 'store':
			    if (!$scope.selectedStore || !$scope.selectedStore.id) {
			    	alert('请选择自取门店！');
			    	return;
			    }
			    addressId = $scope.selectedStore.id;
			    break;
		}
		var data = {
			goodsid: goodsIdArr,
			num: $scope.numArr,
			type: $scope.type,
			addressid: addressId,
			cartflag: cartFlag,
			couponid: parseInt($scope.couponId) || 0,
			remark: $scope.remark,
			freightcharges: parseFloat($scope.freight)
		};
		$http.post('/user/confirmorder.json', data, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login').search({});
			}

			else if (1 === data.code) {
				// 下单成功
				$timeout(function () {
					// 跳转到支付页面
					$location.path('pay_goods/' + data.data.id).search({}).replace();
				}, 0);
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
		})
		.error(function (data) {
			// alert('数据请求失败!请稍后再试！');
		});
	};

	$scope.selectStore = function () {
		$location.path('select_store').search({from: 'order_confirm'});
	};

}]);