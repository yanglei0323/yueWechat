index.controller('collectionCtrl',
    ['$scope', '$http', '$rootScope', '$location',
    function ($scope, $http, $rootScope, $location) {
    

    // 优秀造型师
    $scope.getDesigner = function () {
        $scope.isDesigner = true;
        $scope.isHair = false;
        $scope.isStore = false;
        $scope.isGoods = false;
        $http.post('/user/mykeepdesigner.json', postCfg)
        .then(function (resp) {
            console.log(resp);
            if (-1 === resp.data.code) {
                $location.path('login');
            }
            else if (1 === resp.data.code) {
                var designerList = resp.data.data.designerlist;
                if (0 === designerList.length) {
                    $scope.hasDesigner = false;
                    return;
                }
                $scope.hasDesigner = true;
                // 对图片地址添加前缀
                for (var i = 0, j = designerList.length; i < j; i++) {
                    designerList[i].imgurl = picBasePath + designerList[i].imgurl;
                }
                $scope.designerList = designerList;
            }
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
    };
    // 初始化执行获取优秀造型师
    $scope.getDesigner();

    // 时尚发型
    $scope.getFashionHair = function () {
        $scope.isDesigner = false;
        $scope.isHair = true;
        $scope.isStore = false;
        $scope.isGoods = false;
        $http.post('/user/mykeepfashionhair.json', postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var hairList = resp.data.data.fashionhairlist;
                if (0 === hairList.length) {
                    $scope.hasHair = false;
                    return;
                }
                $scope.hasHair = true;
                for (var i = 0, j = hairList.length; i < j; i++) {
                    hairList[i].imgurl = picBasePath + hairList[i].imgurl;
                }
                $scope.hairList = hairList;
            }
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
    };

    // 明星门店
    $scope.getStarStore  = function () {
        $scope.isDesigner = false;
        $scope.isHair = false;
        $scope.isStore = true;
        $scope.isGoods = false;
        $http.post('/user/mykeepstore.json')
        .success(function (data) {
            if (1 === data.code) {
                var storeList = data.data.storelist,
                    starUrl1 = '../../assets/images/star_h.png',
                    starUrl2 = '../../assets/images/star.png',
                    k, l, n, store;
                if (0 === storeList.length) {
                    $scope.hasStore = false;
                    return;
                }
                $scope.hasStore = true;
                for (k = 0; k < storeList.length; k++) {
                    storeList[k].img1 = picBasePath + storeList[k].imgurl[0];    // 正方形
                    storeList[k].starUrl = [];
                    for (l = 0; l < storeList[k].star; l++) {
                        storeList[k].starUrl.push({'path': starUrl1});
                    }
                    for (n = l; n < 5; n++) {
                        storeList[k].starUrl.push({'path': starUrl2});
                    }
                }
                $scope.storeList = storeList;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    };

    // 悦商品
    $scope.getGoods = function () {
        $scope.isDesigner = false;
        $scope.isHair = false;
        $scope.isStore = false;
        $scope.isGoods = true;
        $http.post('/user/mykeepgoods.json')
        .success(function (data) {
            if (1 === data.code) {
                var goodsList = data.data.goodslist;
                if (0 === goodsList.length) {
                    $scope.hasGoods = false;
                }
                $scope.hasGoods = true;
                for (var i = 0, j = goodsList.length; i < j; i++) {
                    goodsList[i].detailimgurl = picBasePath + goodsList[i].imgurl1;
                }
                $scope.goodsList = goodsList;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    };

    // 跳转到设计师详情
    $scope.toDesignerDetail = function (designer) {
        $location.path('stylist_detail/' + designer.id);
    };

    // 跳转到时尚发型详情
    $scope.showHairInfo = function (hair) {
        $location.path('fashion_hair_info/' + hair.id);
    };

    // 跳转到门店详情
    $scope.toStoreDetail = function (store) {
        $location.path('store_detail/' + store.id);
    };

    // 跳转到悦商品详情
    $scope.toGoodsDetail = function (goods) {
        $location.path('mall_goods_detail/' + goods.id);
    };
}]);