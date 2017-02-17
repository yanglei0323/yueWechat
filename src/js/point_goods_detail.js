index.controller('pointGoodsDetailCtrl',
	['$scope', '$http', '$location', '$q', '$routeParams', '$window',
    function ($scope, $http, $location, $q, $routeParams, $window) {
   // 购买数量默认为1
    $scope.buyNum = 1;
    $scope.deferred = $q.defer();
    var goodsId = parseInt($routeParams.id);

    // 获取积分商品详情
    $http.post('/integralshop/getgoodsbyid.json', {id: goodsId}, postCfg)
    .then(function (resp) {
        if (1 === resp.data.code) {
            var goods = resp.data.data;
            for (var i = 0, j = goods.imgarray.length; i < j; i++) {
                goods.imgarray[i].imgurl = picBasePath + goods.imgarray[i].imgurl;
            }
            $scope.goods = goods;
        }
    }, function (resp) {
        // alert('数据请求失败，请稍后再试！');
    });

    // 点赞商品，index为1执行点赞，index为2执行取消点赞
    $scope.praiseOperation = function (index) {
        var postUrl = index === 1 ? '/user/keepgoods.json' : '/user/unkeepgoods.json';
        $http.post(postUrl, {goodsid: goodsId}, postCfg)
        .success(function (data) {
            console.log(data);
            if (-1 === data.code) {
                $location.path('login');
            }
            else if (1 === data.code) {
                $scope.goods.iskeep = index === 1 ? true : false;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    };

    // 跳转到购物车界面
    $scope.toCart = function () {
        $location.path('cart');
    };

    $scope.$on('ngRepeatFinished', function () {
        $scope.deferred.resolve('succeed');
    });

    // 立即购买
    $scope.buy = function () {
        // 判断用户是否登录
        if (!sessionStorage.user) {
            // 用户未登录，跳转到登录页面
            $location.path('login');
        }
        else {
            var user = JSON.parse(sessionStorage.user);
            if (1 === user.vip.id) {
                // 普通会员
                $scope.goods.price = $scope.goods.realprice;
            }
            else {
                // vip会员
                $scope.goods.price = $scope.goods.vipprice;
            }
            $scope.isBuy = true;
        }
    };

    // 取消购买
    $scope.cancelBuy = function () {
        $scope.isBuy = false;
    };

    // 改变购买数量
    $scope.changeBuyNum = function (type) {
        switch (type) {
            case 1:
                // 减少数量
                if (1 !== $scope.buyNum) {
                    $scope.buyNum--;
                }
                break;
            case 2:
                // 增加数量
                if ($scope.buyNum != $scope.goods.inventory && $scope.buyNum != $scope.goods.buylimit) {
                    $scope.buyNum++;
                }
                break;
        }
    };

    // 确认购买
    $scope.confirmBuy = function () {
        $location.path('point_order_confirm').search({goods: JSON.stringify($scope.goods), buyNum: $scope.buyNum});
    };

    // 进入商品详情
    $scope.goodsDetail = function (goods) {
        $window.location.href = goods.detailimgurl;
    };

    // 悦艺术家保障
    $scope.toGuarantee = function () {
        $window.location.href = $scope.goods.yueurl;
    };
}]);