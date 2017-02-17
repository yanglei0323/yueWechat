index.controller('addressCtrl',
    ['$scope', '$http', '$location', '$rootScope', '$window',
    function ($scope, $http, $location, $rootScope, $window) {

    function init() {
        // 获取用户收货地址
        $http.post('/user/myaddress.json', postCfg)
            .success(function (data) {
                if (-1 === data.code) {
                    $rootScope.preUrl = $location.url();
                    $location.path('login');
                }
                else if (1 === data.code && 0 < data.data.addresslist.length) {
                    var addressList = data.data.addresslist,
                        params = $location.search();
                    if (params.current_id) {
                        for (var i = 0, j = addressList.length; i < j; i++) {
                            if (addressList[i].id == params.current_id) {
                                addressList[i].selectedSite = true;
                            }
                        }
                    }
                    $scope.addrList = addressList;
                }
            })
            .error(function (resp) {
                console.log(resp);
            }
        );
    }

    init();

    // 选择地址后返回确认订单页面
    $scope.backToOrder = function (addr) {
        // 将选择的地址放到sessionStorage中
        sessionStorage.setItem('site', JSON.stringify(addr));
        $window.history.back();
    };

    // 编辑地址
    $scope.toEditAddr = function (e, addr) {
        e.stopPropagation();
        // 传id的值到编辑页面
        $location.path('add_receiver').search({addr_id: addr.id});
    };

    // 跳转到添加地址页面
    $scope.addAddress = function () {
        $location.path('add_receiver');
    };
}]);