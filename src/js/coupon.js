index.controller('couponCtrl',
    ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {

    $scope.unused = true;
    $scope.used = false;
    $scope.expired = false;

    var couponPromise = $http.post('/user/mycouponlist.json', postCfg);
    couponPromise.then(function (resp) {
        console.log(resp);
        if (-1 === resp.data.code) {
            $location.path('login');
        }
    	else if (1 === resp.data.code) {
    		var data = resp.data.data;
    		$scope.unusedList = addTypePic(data.unUsed);
    		$scope.noUnused = (0 === $scope.unusedList.length ? true : false);
    		$scope.usedList = addTypePic(data.used, true);
    		$scope.noUsed = (0 === $scope.usedList.length ? true : false);
    		$scope.expiredList = addTypePic(data.overdue, true);
    		$scope.noExpired = (0 === $scope.expiredList.length ? true : false);
    	}
    }, function (resp) {
    	console.log(resp);
    });

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
    $scope.selectCoupon = function (index) {
    	$scope.unused = (1 === index ? true : false);
    	$scope.used = (2 === index ? true : false);
    	$scope.expired = (3 === index ? true : false);
    };
}]);