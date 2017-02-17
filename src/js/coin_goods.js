index.controller('coinGoodsCtrl',
	['$scope', '$http', '$location', '$window', '$q', '$rootScope',
	function ($scope, $http, $location, $window, $q, $rootScope) {
	
	$scope.deferred = $q.defer();

	$scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});

	(function init() {
		$scope.id = $location.search().id;
		// 通过id获取商品详情
		$http.post('/integralshop/integral/getgoods.json', {id: $scope.id}, postCfg)
		.success(function (resp) {
			// type表示商品类型：1为正常商品，2为限时抢购，3为积分正常商品
			// 4为积分虚拟商品（需要有快递单号），5为积分服务项目（订单id单独生成）
			if (1 === resp.code) {
				var goods = resp.data,
				    user = JSON.parse(sessionStorage.user);

				if (goods.integral < user.score) {
					$scope.canChange = true;
				}
				for (var i = 0; i < goods.imgarray.length; i++) {
					goods.imgarray[i].imgurl = picBasePath + goods.imgarray[i].imgurl;
				}
				$scope.goods = goods;
			}
			else if (0 === resp.code) {
				alert(resp.reason);
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
		setSite();
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

	// 立即兑换
	$scope.change = function () {
		var type = $scope.goods.type,
		    data;
		switch (type) {
			case 3:
				if (!$scope.site || !$scope.site.id) {
					alert('请选择地址！');
					return;
				}
				var addressId = $scope.site.id;
			    data = {
					id: $scope.id,
					addressid: addressId
				};
				break;
			case 4:
			    data = {
			    	id: $scope.id
			    };
			    break;
			case 5:
				if (!$scope.selectedStore || !$scope.selectedStore.id) {
			    	alert('请选择门店！');
			    	return;
			    }
			    var storeId = $scope.selectedStore.id;
			    data = {
			    	id: $scope.id,
			    	storeid: storeId
			    };
			    break;
		}
		$http.post('/integralshop/integral/exchange.json', data, postCfg)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				// 兑换成功
				alert('兑换成功,可在兑换记录中查看兑换信息！');
			}
			else if (0 === resp.code) {
				alert(resp.reason);
			}
			else if (-1 === resp.code) {
				$location.path('login');
			}
		})
		.error(function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 选择地址
	$scope.selectAddress = function (addr) {
		if (addr) {
			$location.path('address').search({current_id: addr.id});
		}
		else {
			$location.path('address').search({});
		}
	};

	// 选择门店
	$scope.selectStore = function () {
		$location.path('select_store').search({from: 'order_confirm'});
	};

}]);