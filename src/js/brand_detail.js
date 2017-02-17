index.controller('brandDetailCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams',
	function ($scope, $http, $location, $window, $routeParams) {
	
	var brandId = $routeParams.id;
    var type = $location.search().type || '';
	$scope.title = $location.search().name;

	$scope.goodsList = [];
    $scope.page = 1;
    $scope.loading = false;
    $scope.loaded = false;
    $scope.type = 'hot';

    (function init() {
    	// getGoods();
    })();


    $scope.getGoods = getGoods;
    // 获取商品列表
    function getGoods() {
        if ($scope.loading) {
            return;
        }
        $scope.loading = true;
        var data = {
        	brandkindid: brandId,
            page: $scope.page,
            sort: $scope.type
        };
        var url = type === 'point' ? '/integralshop/searchgoodsbybrandkindandcondition.json' :
        '/shop/searchgoodsbybrandkindandcondition.json';
        $http.post(url, data, postCfg)
        .then(function (resp) {
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
            // alert('数据请求失败，请稍后再试！');
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

    // 跳转到商品详情
    $scope.toGoodsDetail = function (goods) {
        if (type === 'point') {
            $location.path('point_goods_detail/' + goods.id).search({});
            return;
        }
        $location.path('mall_goods_detail/' + goods.id).search({});
    };
    $scope.tback = function(){
        $location.path('mall');
    };

}]);