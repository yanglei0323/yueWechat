index.controller('selectStoreCtrl',
    ['$scope', '$http', '$location', '$window', '$rootScope',
    function ($scope, $http, $location, $window, $rootScope) {
	
    var isGetStoreInfo = false;
    $scope.areaFilter = '全部区域';
    $scope.filterText = '综合排序';
    $scope.filterDefault = true;

    $scope.page = 1;
    $scope.loading = false;
    $scope.loaded = false;
    $scope.storeList = [];
    $scope.getStoreList = getStoreList;

    // 获取门店列表
    function getStoreList() {
        if($scope.loading) {
            return;
        }
        $scope.loading = true;
        var data = {
            page: $scope.page,
            sort: $scope.sort || 'default',
            positionx: $scope.positionx,
            positiony: $scope.positiony,
            areaid: $scope.areaId
        };
        $http.post('/store/list.json', data, postCfg)
        .success(function (data) {
            if (1 === data.code) {
                var starUrl1 = '../../assets/images/star_h.png',
                    starUrl2 = '../../assets/images/star.png',
                    storeList = data.data.storelist,
                    k, l, n;
                if (storeList.length > 0) {
                    for (k = 0; k < storeList.length; k++) {
                        storeList[k].img1 = picBasePath + storeList[k].imgurl[0];    // 正方形
                        storeList[k].img2 = picBasePath + storeList[k].imgurl[1];
                        storeList[k].starUrl = [];
                        for (l = 0; l < storeList[k].star; l++) {
                            storeList[k].starUrl.push({'path': starUrl1});
                        }
                        for (n = l; n < 5; n++) {
                            storeList[k].starUrl.push({'path': starUrl2});
                        }
                        $scope.storeList.push(storeList[k]);
                    }
                    $scope.loading = false;
                    $scope.page += 1;
                }
                else {
                    $scope.loaded = true;
                }
            }
            else if (0 === data.code) {
                alert(data.reason);
                return;
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    }

    // 跳转到门店搜索页面
    $scope.storeSearch = function () {
        $location.path('store_search');
    };

    // 获取门店筛选条件
    $scope.getStoreInfo = function () {
        $scope.showStore = !$scope.showStore;
        $scope.showMask = $scope.showStore ? true : false;
        $scope.filterShow = false;
        $scope.isShowSort = false;
        if (!isGetStoreInfo) {
            $http.post('/store/all.json', postCfg)
            .success(function (data) {
                console.log(data);
                if (1 === data.code) {
                    var areaList = data.data.arealist;
                    $scope.areaList = areaList;
                    isGetStoreInfo = true;
                }
            })
            .error(function (data) {
                // alert('数据请求失败，请稍后再试！');
            });
        }
        
    };

    // 选择区域
    $scope.selectCity = function (area, e) {
        e.stopPropagation();
        $scope.showMask = false;
        $scope.showStore = false;
        $scope.areaId = area.id;
        $scope.areaFilter = area.name;
        var index = $scope.areaList.indexOf(area);
        if (index !== -1 && $scope.areaList[index].selected !== true) {
            for (var i = 0; i < $scope.areaList.length; i++) {
                $scope.areaList[i].selected = false;
            }
            area.selected = true;
            $scope.page = 1;
            $scope.loaded = false;
            $scope.loading = false;
            $scope.storeList = [];
            getStoreList();
        }
    };

    $scope.showFilterItems = function () {
        $scope.filterShow = !$scope.filterShow;
        $scope.showMask = $scope.filterShow ? true : false;
        $scope.showStore = false;
        $scope.isShowSort = false;
    };


    // 自助筛选
    $scope.filter = function (type, index, e) {
        e.stopPropagation();
        var filterText = ['综合排序', '订单最多', '离我最近', '价格最低', '价格最高', ''];
        $scope.filterShow = false;
        $scope.showMask = false;
        $scope.filterDefault = (type === 'default') ? true : false;
        $scope.filterMostReserve = (type === 'hottest') ? true : false;
        $scope.filterHighestScore = (type === 'highestscore') ? true : false;
        $scope.filterNearest = (type === 'nearest') ? true : false;
        $scope.filterCheapest = (type === 'cheapest') ? true : false;
        $scope.filterExpensive = (type === 'expensive') ? true : false;
        if ($scope.sort !== type) {
            $scope.sort = type;
            $scope.filterText = filterText[index];
            $scope.page = 1;
            $scope.loading = false;
            $scope.loaded = false;
            $scope.storeList = [];
        }
    };

    // 点击门店项进入选择发型师界面
    $scope.toSelectDesigner = function (store) {
        if ($location.search().from && $location.search().from === 'order_confirm') {
            $rootScope.selectedStore = store;
            $window.history.back();
            return;
        }
        $location.path('select_designer/' + store.id);
    };
    $scope.tback = function () {
        $location.path('go_pay');
    };
}]);