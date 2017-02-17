index.controller('selectCouponCtrl',
	['$scope', '$http', '$location', '$window', '$rootScope',
	function ($scope, $http, $location, $window, $rootScope) {
	
	//根据用户价格返回可用的优惠券
	var price = parseFloat($location.search().price),
		type = parseInt($location.search().type);

	// 获取可用的优惠券
	(function getCoupon() {
		$http.post('/user/mycouponwithprice.json',
			{price: price, type: type}, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				$scope.couponList = addTypePic(data.data.couponlist);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	// 判断优惠券类型：0全品类、1商品类、2服务品类
    function addTypePic(couponList, isUsed) {
    	var picRelativePath = '../../assets/images/',
    	    typePrefix = '此代金券可用于';
    	for (var i = 0, j = couponList.length; i < j; i++) {
    		var coupon = couponList[i];
    		switch(coupon.type) {
    			case 0:
    				couponList[i].typeText = typePrefix + '全部分类';
    				couponList[i].typePic = picRelativePath + (isUsed ? 'quan_grey.png' : 'quan.png');
    				break;
				case 1:
					couponList[i].typeText = typePrefix + '商品类';
					couponList[i].typePic = picRelativePath + (isUsed ? 'shang_grey.png' : 'shang.png');
					break;
				case 2:
					couponList[i].typeText = typePrefix + '服务品类';
					couponList[i].typePic = picRelativePath + (isUsed ? 'fu_grey.png' : 'fu.png');
    		}
    	}
    	return couponList;
    }

    // 点击优惠券选择
    $scope.selectCoupon = function (coupon) {
    	if (2 === type) {
    		$rootScope.serviceCoupon = coupon;
    		$window.history.back();
    		return;
    	}
    	$rootScope.selectedCoupon = coupon;
    	$window.history.back();
    };
}]);