index.controller('orderCtrl',
	['$scope', '$http', '$window', '$location', function ($scope, $http, $window, $location) {

	var titles = ['我的预约', '服务记录', '商城订单', '积分商城订单'];
	$scope.title = '我的预约';
	$scope.isAppointOrder = true;
	$scope.isServiceOrder = false;
	$scope.isMallOrder = false;
	$scope.isPointOrder = false;

	$scope.reserveOrderList = [];
	$scope.consumerOrderList = [];
	$scope.goodsOrderList = [];
	// 标记已完成还是未完成预约订单，0为未完成，1为已完成
	$scope.appointFlag = 0;
	// 标记服务记录，0,1,2分别代表未完成、已完成和全部
	$scope.serviceType = 2;
	// 标记商城订单
	$scope.mallFlag = 2;


	$scope.page = 1;
	$scope.loading = false;
	$scope.loaded = false;
	$scope.noload = false;


	$scope.orderNav = function (index) {
		$scope.showMask = false;
		if (($scope.isAppointOrder && 1 === index) ||
			($scope.isServiceOrder && 2 === index) ||
			($scope.isMallOrder && 3 === index)) {
			return;
		}
		$scope.isAppointOrder = (1 === index ? true : false);
		$scope.isServiceOrder = (2 === index ? true : false);
		$scope.isMallOrder = (3 === index ? true : false);
		$scope.isPointOrder = (4 === index ? true: false);
		$scope.title = titles[index - 1];
		$scope.loading = false;
		$scope.loaded = false;
		$scope.noload = false;
		$scope.page = 1;
		$scope.reserveOrderList = [];
		$scope.consumerOrderList = [];
		$scope.goodsOrderList = [];
		switch (index) {
			case 1:
			    // 我的预约
			    $scope.appointFlag = 0;
			    break;
		    case 2:
		    	$scope.serviceType = 2;
		        break;
		    case 3:
			    $scope.mallFlag = 2;
			    $scope.goodsOrderType = 1;
			    break;
			case 4:
				$scope.mallFlag = 2;
				$scope.goodsOrderType = 2;
				break;
		}
	};


	$scope.navigate = function (index) {
		switch (index) {
			case 1:
				$location.path('/');
				break;
			case 2:
				$location.path('stylist');
				break;
			case 3:
				$location.path('go_pay');
				break;
			case 4:
				$location.path('mall');
				break;
			case 5:
				$location.path('my');
				// $window.location.href = '/webapp/src/xiaoyue/home.html';
				break;
		}
	};

	$scope.getAppointOrder = getAppointOrder;

	function getAppointOrder() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			flag: $scope.appointFlag,
			page: $scope.page
		};
		$http.post('/user/myreserveorder.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				alert(data.reason);
				return;
			}
			else if (1 === data.code) {
				var reserveOrderList = data.data.reserveorderlist;
				if (reserveOrderList.length > 0) {
					for (var i = 0; i < reserveOrderList.length; i++) {
						reserveOrderList[i].designer.imgurl = picBasePath +
						    reserveOrderList[i].designer.imgurl;
						$scope.reserveOrderList.push(reserveOrderList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					if($scope.page === 1){
						if(reserveOrderList.length === 0){
							$scope.loaded = true;
							$scope.noload = true;
							return;
						}
					}else{
						$scope.loaded = true;
						$scope.noload = false;
					}
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	// 点击已完成或者未完成预约订单
	$scope.setAppointType = function (flag) {
		if (flag == $scope.appointFlag) {
			return;
		}
		$scope.appointFlag = flag;
		$scope.reserveOrderList = [];
		$scope.page = 1;
		$scope.loading = false;
		$scope.loaded = false;
		$scope.noload = false;
		getAppointOrder();
	};

	// 取消预约订单
	$scope.cancelReserveOrder = function (reserve) {
		var isConfirm = $window.confirm('确定取消订单？');
		if (isConfirm) {
			$http.post('/user/cancelreserveorder.json', {id: reserve.id, page: 1}, postCfg)
			.success(function (data) {
				if (-1 === data.code) {
					$location.path('login');
					return;
				}
				else if (0 === data.code) {
					alert(data.reason);
					return;
				}
				else if (1 === data.code) {
					alert('订单取消成功!');
					$scope.reserveOrderList = [];
					$scope.page = 1;
					$scope.loading = false;
					$scope.loaded = false;
					$scope.noload = false;
					getAppointOrder();
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		
	};

	$scope.getServiceRecord = getServiceRecord;

	// 获取服务记录,flag取值为0,1,2,分别代表未完成、已完成和全部
	function getServiceRecord() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			flag: $scope.serviceType,
			page: $scope.page
		};
		$http.post('/user/myconsumerorder.json', data, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				var consumerOrderList = data.data.consumerorderlist;
				if (consumerOrderList.length > 0) {
					for (var i = 0; i < consumerOrderList.length; i++) {
						consumerOrderList[i].designer.imgurl = picBasePath +
						    consumerOrderList[i].designer.imgurl;
						$scope.consumerOrderList.push(consumerOrderList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					if($scope.page === 1){
						if(consumerOrderList.length === 0){
							$scope.loaded = true;
							$scope.noload = true;
							return;
						}
					}else{
						$scope.loaded = true;
						$scope.noload = false;
					}
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	// 判断是全部、未完成还是已完成订单显示
	$scope.setServiceType = function (type) {
		if ($scope.serviceType == type) {
			return;
		}
		$scope.serviceType = type;
		$scope.consumerOrderList = [];
		$scope.page = 1;
		$scope.loading = false;
		$scope.loaded = false;
		$scope.noload = false;
		getServiceRecord();
	};

	// 取消服务记录
	$scope.cancelConsumerOrder = function (service) {
		var data = {
			id: service.id,
			page: 1,
			flag: $scope.serviceType
		};
		$http.post('/user/cancelconsumerorder.json', data, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				alert('订单取消成功！');
				// $scope.consumerOrderList[$scope.consumerOrderList.indexOf(service)].state = '已取消';
				// $scope.consumerOrderList[$scope.consumerOrderList.indexOf(service)].stateflag = 2;
				$scope.consumerOrderList = [];
				$scope.page = 1;
				$scope.loading = false;
				$scope.loaded = false;
				$scope.noload = false;
				getServiceRecord();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	$scope.deleteConsumerOrder = function (service) {
		$http.post('/user/deleteconsumerorder.json', {orderid: service.id}, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				alert('订单删除成功！');
				$scope.consumerOrderList.splice($scope.consumerOrderList.indexOf(service), 1);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	$scope.getMallOrder = getMallOrder;
	// 获取全部商城订单
	function getMallOrder() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			flag: $scope.mallFlag,
			page: $scope.page,
			type: $scope.goodsOrderType
		};
		$http.post('/user/mygoodsorder.json', data, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				var goodsOrderList = data.data.goodsorderList;
				if (goodsOrderList.length > 0) {
					for (var i = 0; i < goodsOrderList.length; i++) {
						goodsOrderList[i].imgUrlArr = [];
						for (var j = 0; j < goodsOrderList[i].goodslist.length; j++) {
							goodsOrderList[i].imgUrlArr.push(
								{path: picBasePath + goodsOrderList[i].goodslist[j].imgurl});
						}
						$scope.goodsOrderList.push(goodsOrderList[i]);
					}
					$scope.page += 1;
					$scope.loading = false;
				}
				else {
					if($scope.page === 1){
						if(goodsOrderList.length === 0){
							$scope.loaded = true;
							$scope.noload = true;
							return;
						}
					}else{
						$scope.loaded = true;
						$scope.noload = false;
					}
				}
				
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.setMallFlag = function (flag) {
		if (flag == $scope.mallFlag) {
			return;
		}
		$scope.mallFlag = flag;
		$scope.goodsOrderList = [];
		$scope.loading = false;
		$scope.loaded = false;
		$scope.noload = false;
		$scope.page = 1;
		getMallOrder();
	};

	// 删除商城订单
	$scope.deleteGoodsOrder = function (goods, e) {
		e.stopPropagation();
		$http.post('/user/deletegoodsorder.json', {orderid: goods.id}, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				// 订单删除成功
				alert('订单删除成功！');
				$scope.goodsOrderList.splice($scope.goodsOrderList.indexOf(goods), 1);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
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
			else if (0 === data.code) {
				alert(data.reason);
			}
			else if (1 === data.code) {
				// 订单取消成功
				alert('订单取消成功！');
				// $scope.goodsOrderList[$scope.goodsOrderList.indexOf(goods)].state = '已取消';
				// $scope.goodsOrderList[$scope.goodsOrderList.indexOf(goods)].stateflag = 2;
				$scope.goodsOrderList = [];
				$scope.loading = false;
				$scope.loaded = false;
				$scope.noload = false;
				$scope.page = 1;
				getMallOrder();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};
	// 去评价服务
	$scope.remarkDesigner = function (service) {
		$location.path('remark_designer/' + service.id);
	};

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

	$scope.toOrderDetail = function (order) {
		$location.path('order_detail/' + order.id);
	};

	// 服务订单支付
	$scope.payService = function (service) {
		$location.path('pay_service/' + service.id);
	};

	$scope.displayMask = function (e) {
		e.stopPropagation();
		$scope.showMask = !$scope.showMask;
	};

	$scope.hideMask = function (e) {
		$scope.showMask = false;
	};

	$scope.refresh = function () {
		$scope.loading = false;
		$scope.loaded = false;
		$scope.noload = false;
		$scope.page = 1;
		if ($scope.isAppointOrder) {
			$scope.reserveOrderList = [];
			getAppointOrder();
		}
		else if ($scope.isServiceOrder) {
			$scope.consumerOrderList = [];
			getServiceRecord();
		}
		else {
			$scope.goodsOrderList = [];
			getMallOrder();
		}
	};

}]);