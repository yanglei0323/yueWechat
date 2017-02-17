index.controller('rechargeCtrl', ['$scope', '$http', '$location', '$rootScope',
	function ($scope, $http, $location, $rootScope) {

    var priceRe = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
    var designerId = 0;

    $scope.recommend = '';

    (function init() {
        // 获取当前余额
        if ($rootScope.designer) {
            $scope.designer = $rootScope.designer;
            designerId = $scope.designer.id;
        }
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

        // 获取所有vip信息
        $http.post('/user/getallvip.json', postCfg)
        .success(function (data) {
            if (1 === data.code) {
                var vipList = data.data.viplist;
                for (var i = 0; i < vipList.length; i++) {
                    vipList[i].imgurl = picBasePath + '/' + vipList[i].imgurl;
                }
                $scope.vipList = vipList;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    })();
	

    // 选择vip
    $scope.selectVip = function (vip) {
    	var state = !vip.selected;
    	for (var i = 0; i < $scope.vipList.length; i++) {
    		$scope.vipList[i].selected = false;
    	}
        $scope.otherPrice = false;
    	vip.selected = state;
    };

    $scope.selectOptionVip = function (vip) {
        var state = !vip.selected;
        for (var i = 0; i < $scope.vipOptionList.length; i++) {
            $scope.vipOptionList[i].selected = false;
        }
        vip.selected = state;
    };

    // 选择其他金额
    $scope.selectOtherPrice = function () {
        $scope.otherPrice = !$scope.otherPrice;
        for (var i = 0; i < $scope.vipList.length; i++) {
            $scope.vipList[i].selected = false;
        }
    };

    $scope.buyVip = function () {
        if (-1 === checkParams()) {
            return;
        }
        var data = {
            paymoney: $scope.payMoney
        };
        $http.post('/user/buyvipfirststep.json', data, postCfg)
        .success(function (data) {
            var vipList;
            if (1 === data.code) {
                vipList = data.data.viplist;
                if (1 === vipList.length) {
                    $scope.vipId = data.data.viplist[0].id;
                    buyVipSecondStep();
                }
                else if (2 === vipList.length) {
                    // 弹出框让用户选择
                    $scope.showVipOption = true;
                    vipList = data.data.viplist;
                    for (var i = 0; i < vipList.length; i++) {
                        vipList[i].imgurl = picBasePath + '/' + vipList[i].imgurl;
                    }
                    $scope.vipOptionList = vipList;
                }
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    };

    // 购买vip第二步
    function buyVipSecondStep() {
        var data = {
            vipid: $scope.vipId,
            paymoney: $scope.payMoney,
            designerid: designerId
        };
        $http.post('/user/buyvipsecondstep.json', data, postCfg)
        .success(function (data) {
            if (-1 === data.code) {
                $location.path('login');
                return;
            }
            if (1 === data.code) {
                // 下单成功，跳转到充值支付页面
                var order = data.data;
                $location.path('pay_recharge').search({
                    id: order.id,
                    time: order.time,
                    price: order.price,
                    recommendBy: order.recommendby
                });
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    }

    function checkParams() {
        var flag = false;
        if ($scope.otherPrice) {
            if (!priceRe.test($scope.otherPriceNum)) {
                alert('输入金额无效');
                return -1;
            }
            else {
                $scope.payMoney = parseFloat($scope.otherPriceNum);
                return 1;
            }
        }
        else {
            for (var i = 0; i < $scope.vipList.length; i++) {
                if ($scope.vipList[i].selected) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                $scope.payMoney = parseFloat($scope.vipList[i].price);
                return 1;
            }
            else {
                alert('请选择需要购买的vip');
                return -1;
            }
        }
    }

    // 点击选择推荐人
    $scope.selectStore = function () {
        $location.path('select_store');
    };

    // 确认选择弹框的vip
    $scope.confirmSelect = function () {
        for (var i =0; i < $scope.vipOptionList.length; i++) {
            if ($scope.vipOptionList[i].selected) {
                break;
            }
        }
        if (2 === i) {
            alert('请选择需要购买的vip');
            return;
        }
        $scope.vipId = $scope.vipOptionList[i].id;
        $scope.payMoney = $scope.vipOptionList[i].price;
        buyVipSecondStep();
    };
}]);