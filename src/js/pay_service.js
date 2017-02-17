// 商品支付控制器
index.controller('payServiceCtrl',
	['$scope', '$http','$location', '$routeParams', '$rootScope',
	function ($scope, $http, $location, $routeParams, $rootScope) {

	// 获取订单id
	// $scope.service = JSON.parse($location.search().service);
	var orderId = $routeParams.id;
	$scope.orderId = orderId;
	// 默认选中余额支付
	$scope.balancePay = true;
	// 默认选中微信支付
	$scope.towxpay = true;
	$scope.fixedpwddiv=false;

	(function init() {
		// 获取用户当前余额
		$http.post('/user/getcurrentbalance.json', postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
				return;
			}
			if (1 === data.code) {
				$scope.balance = data.data.balance;
			}
		});
		// 通过id获取订单详细信息
		$http.post('/user/cometoconsumeorrder.json', {orderid: orderId}, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var service = data.data;
				service.designer.imgurl = picBasePath + service.designer.imgurl;
				service.style = {
					'background-image': 'url(' + service.designer.imgurl + ')'
				};
				$scope.service = service;
				$scope.actprice =service.actualprice;
				if($scope.balance<$scope.actprice){
					$scope.towxpay = true;
					$scope.balancePay = false;
				}else{
					$scope.towxpay = false;
					$scope.balancePay = true;
				}

				getCoupon();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	// 选择余额支付
	$scope.chooseBalance = function (index) {
		switch ($scope.balancePay) {
			case true:
			    $scope.balancePay=false;
			    break;
			case false:
			    $scope.balancePay=true;
			    break;
		}
	};
	// 选择微信支付
	$scope.chooseWxpay = function (index) {
		switch ($scope.towxpay) {
			case true:
			    $scope.towxpay=false;
			    break;
			case false:
			    $scope.towxpay=true;
			    break;
		}
	};

	// 点击立即支付弹出输入密码对话框
	$scope.pay = function () {
		if(!$scope.balancePay && !$scope.towxpay){//未选择支付方式
			alert('请选择支付方式!');
			return;
		}else if ($scope.balancePay && !$scope.towxpay) {//只选择选择余额支付
			if($scope.balance<$scope.actprice){
				alert('账户余额不足！');
				return;
			}
			if($scope.balance >0){
				$scope.showMask = true;
			}
			
		}else if(!$scope.balancePay && $scope.towxpay){//只选择微信支付
			wxPay();
		}else{//选择两种支付方式
			if($scope.balance >0){
				$scope.showMask = true;
			}else{
				wxPay();
			}
		}
	};

	// 点击空白处隐藏遮罩并清除密码
	$scope.hideMask = function () {
		$scope.showMask = false;
		$scope.payPassword = '';
	};


	$scope.payClick = function (e) {
		e.stopPropagation();
	};

	// 忘记支付密码
	$scope.forgetPwd = function () {
		$location.path('forget_pwd').search({type: 'pay'});
	};

	// 确认支付
	$scope.confirmPwd = function () {
		if (!$rootScope.serviceCoupon) {
			console.log('未选择优惠券');
			payByBalance();
		}
		else {
			// 选择了优惠券
			console.log('选择了优惠券');
			var data = {
				orderid: orderId,
				couponid: parseInt($scope.couponId)
			};
			$http.post('/user/confirmconsumerorder.json', data, postCfg)
			.success(function (data) {
				console.log(data);
				if (1 === data.code) {
					payByBalance();
				}
				else if(0 === data.code){
					alert('支付成功！');
					$location.path('order');
				}else{
					alert('支付失败！');
					return;
				}
			});
		}
		
	};

	// 请求余额支付
	function payByBalance() {
		var payPassword = $('#pay-password').val();
		if ($.trim(payPassword) === '') {
			alert('请输入支付密码！');
			return;
		}
		var data = {
			orderid: orderId,
			paypassword: $.md5(payPassword)
		};
		$http.post('/pay/paywithbalance.json', data, postCfg)
		.success(function (data) {
			if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				// alert('支付成功！');
				// $location.path('order').search({});
				// 跳转到支付成功界面
				// $location.path('change_tip').search({type: 'pay', orderId: orderId}).replace();
				// 余额支付成功，开始微信支付
				if($scope.towxpay){
					if($scope.balance<$scope.actprice){
						wxPay();
					}else{
						alert('支付成功！');
						$location.path('order');
					}
				}else{
					alert('支付成功！');
					$location.path('order');
				}
			}else if(4 === data.code){
				$scope.fixedpwddiv=true;
				$scope.showMask = false;
				$scope.payPassword = '';
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.changepwdxgg= function(){
		$scope.fixedpwddiv=false;
	};
	$scope.changepwdqsz= function(){
		$scope.fixedpwddiv=false;
		$location.path('forget_pwd').search({type: 'pay'});
	};

	function wxPay() {
		if($scope.balancePay){
			var data = {
				orderid: orderId,
				channel: 'wx_pub',
				code: sessionStorage.getItem('wxCode')
			};
			$http.post('/pay/getpingcharge.json', data, postCfg)
			.success(function (resp) {
				console.log(resp);
				if (1 === resp.code) {
					pingpp.createPayment(JSON.stringify(resp.data), function (ret, err) {
						if (ret && ret.result) {
							switch (ret.result) {
								case 'success':
								    alert('支付成功');
								    $location.path('order');
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
			})
			.error(function (resp) {
				// alert('数据请求失败，请稍后再试！');
			});
		}else{
			if (!$rootScope.serviceCoupon) {
				var data1 = {
					orderid: orderId,
					channel: 'wx_pub',
					code: sessionStorage.getItem('wxCode')
				};
				$http.post('/pay/getpingcharge.json', data1, postCfg)
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						pingpp.createPayment(JSON.stringify(resp.data), function (ret, err) {
							if (ret && ret.result) {
								switch (ret.result) {
									case 'success':
									    alert('支付成功');
									    $location.path('order');
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
				})
				.error(function (resp) {
					// alert('数据请求失败，请稍后再试！');
				});
			}
			else {
				// 选择了优惠券
				console.log('选择了优惠券');
				var data2 = {
					orderid: orderId,
					couponid: parseInt($scope.couponId)
				};
				$http.post('/user/confirmconsumerorder.json', data2, postCfg)
				.success(function (data) {
					if (1 === data.code) {
						var data3 = {
							orderid: orderId,
							channel: 'wx_pub',
							code: sessionStorage.getItem('wxCode')
						};
						$http.post('/pay/getpingcharge.json', data3, postCfg)
						.success(function (resp) {
							console.log(resp);
							if (1 === resp.code) {
								pingpp.createPayment(JSON.stringify(resp.data), function (ret, err) {
									if (ret && ret.result) {
										switch (ret.result) {
											case 'success':
											    alert('支付成功');
											    $location.path('order');
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
						})
						.error(function (resp) {
							// alert('数据请求失败，请稍后再试！');
						});
					}else if(0 === data.code){
						alert('支付成功！');
						$location.path('order');
					}
					else {
						alert('支付失败！');
						return;
					}
				});
				
			}
			

		}
		
	}

	// 去选择优惠券，获取可用的优惠券
	function getCoupon() {
		if (!$rootScope.serviceCoupon) {
			$http.post('/user/mycouponwithprice.json',
				{price: parseFloat($scope.service.actualprice), type: 2}, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					if (0 === data.data.couponlist.length) {
						$scope.couponInfo = '无可用优惠券';
						$scope.noUsefulCoupon = true;
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
			var coupon = $rootScope.serviceCoupon;
			$scope.couponInfo = coupon.rule;
			$scope.couponId = coupon.id;
			$scope.noUsefulCoupon = false;
			//如果选择了优惠券，改变
			if ($rootScope.serviceCoupon) {
				var data6 = {
					orderid: orderId,
					couponid: parseInt($scope.couponId)
				};
				$http.post('/user/confirmconsumerorder.json', data6, postCfg)
				.success(function (data) {
					if (1 === data.code) {
						$scope.service.actualprice=data.data.price;
					}
					else {
					}
				});
			}
		}
	}

	$scope.selectCoupon = function () {
		if ($scope.noUsefulCoupon === true) {
			return;
		}
		$location.path('select_coupon').search({price: parseFloat($scope.service.actualprice), type: 2});
	};

}]);