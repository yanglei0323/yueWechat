index.controller('pointMallCtrl',
    ['$scope', '$http', '$location', '$q', '$window',
    function ($scope, $http, $location, $q, $window) {
    
    
    // 广告promise
    $scope.deferred = $q.defer();
    // 限时抢购promise
    $scope.flashSaleDeferred = $q.defer();
    // 商品列表数组
    $scope.goodsList = [];
    $scope.page = 1;
    $scope.loading = false;
    $scope.loaded = false;
    $scope.type = 'hot';


    $scope.$on('ngRepeatFinished', function () {
        $scope.deferred.resolve('succeed');
    });
    $scope.$on('flashSaleRepeatFinished', function () {
        $scope.flashSaleDeferred.resolve('succeed'); 
    });

    (function init() {
        // 获取商城广告
        $http.post('/integralshop/getshopad.json', postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var adList = resp.data.data.shopadvertisementlist;
                for (var i = 0, j = adList.length; i < j; i++) {
                    adList[i].imgurl = picBasePath + adList[i].imgurl;
                }
                $scope.adList = adList;
            }
        }, function (resp) {
            console.log(resp);
        });
        // 获取首页目录
        $http.post('/integralshop/getshopmenu.json', postCfg)
        .success(function (data) {
            if (1 === data.code) {
                var menuList = data.data.menulist;
                for (var i = 0; i < menuList.length; i++) {
                    menuList[i].imgurl = picBasePath + '/' + menuList[i].imgurl;
                }
                $scope.menuList = menuList;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
        // 限时抢购
        $http.post('/integralshop/getflashsale.json', {'page': 1}, postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var flashSaleList = resp.data.data.goodslist;
                $scope.limitStartTime = resp.data.data.starttime;
                $scope.limitEndTime = resp.data.data.endtime;
                for (var i = 0, j = flashSaleList.length; i < j; i++) {
                    flashSaleList[i].imgurl = picBasePath + flashSaleList[i].imgurl1;
                }
                $scope.flashSaleList = flashSaleList;
            }
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
        // 品牌专区
        $http.post('/integralshop/getshopbrand.json', postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var brandList = resp.data.data.goodskindlist;
                for (var i = 0, j = brandList.length; i < j; i++) {
                    brandList[i].imgurl = picBasePath + brandList[i].imgurl;
                }
                $scope.brandList = brandList;
            }
        }, function (resp) {
            console.log(resp);
        });
        getGoods();
    })();


    // 广告图片跳转事件
    $scope.jump = function (ad) {
        $window.location.href = ad.jumpurl;
    };

    // 跳转到商品详情
    $scope.toGoodsDetail = function (goods) {
        $location.path('point_goods_detail/' + goods.id);
    };

    // 跳转到商品搜索页面
    $scope.pointMallSearch = function () {
        $location.path('point_mall_search');
    };

    // 获取商品列表
    function getGoods() {
        if ($scope.loading) {
            return;
        }
        $scope.loading = true;
        var data = {
            page: $scope.page,
            sort: $scope.type
        };
        $http.post('/integralshop/searchgoodsbycondition.json',data, postCfg)
        .then(function (resp) {
            console.log(resp);
            if (1 === resp.data.code) {
                var goodsList = resp.data.data.goodslist;
                if (goodsList.length > 0) {
                    for (var i = 0, j = goodsList.length; i < j; i++) {
                        goodsList[i].imgurl = picBasePath + goodsList[i].imgurl1;
                        $scope.goodsList.push(goodsList[i]);
                    }
                    $scope.page += 1;
                    $scope.loading = false;
                }
                else {
                    $scope.loaded = true;
                }
            }
        }, function (resp) {
            console.log(resp);
        });
    }

    // 选择排序方式
    $scope.setSort = function (type) {
        if ($scope.type && $scope.type === type) {
            return;
        }
        $scope.type = type;
        $scope.goodsList = [];
        $scope.page = 1;
        $scope.loaded = false;
        $scope.loading = false;
        getGoods();
    };
    
    $scope.getGoods = getGoods;

    // 进入清洁洗韵目录详情
    $scope.toMenuDetail = function (menu) {
        $location.path('menu_detail/' + menu.id).search({name: menu.name, type: 'point'});
    };

    // 进入品牌专区详情
    $scope.brandDetail = function (brand) {
        $location.path('brand_detail/' + brand.id).search({name: brand.name, type: 'point'});
    };

    // 限时抢购更多
    $scope.moreFlashSale = function () {
        $location.path('flash_sale_list').search({type: 'point'});
    };

}]);