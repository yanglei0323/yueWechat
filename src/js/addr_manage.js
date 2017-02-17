index.controller('addrManageCtrl',
    ['$scope', '$http', '$window', '$location', '$rootScope',
    function ($scope, $http, $window, $location, $rootScope) {

    // 获取用户收货地址
    $http.post('/user/myaddress.json', postCfg)
        .success(function (data) {
            if (-1 === data.code) {
                $rootScope.preUrl = $location.url();
                $location.path('login');
            }
            else if (1 === data.code && 0 < data.data.addresslist.length) {
                $scope.addrList = data.data.addresslist;
            }
        })
        .error(function (resp) {
            console.log(resp);
        }
    );

    $scope.checkDefault = function (addr) {
        if (1 === addr.defaultflag) {
            return true;
        }
        return false;
    };
    // 跳转到新建地址页面
    $scope.toAddAddr = function () {
        $location.path('add_receiver');
    };

    // 编辑地址
    $scope.toEditAddr = function (e, addr) {
        e.stopPropagation();
        // 传id的值到编辑页面
        $location.path('add_receiver').search({addr_id: addr.id});
    };
    // 删除地址
    $scope.delete = function (address) {
        var confirm = $window.confirm('确认删除吗？');
        if (confirm === true) {
            // 删除地址
            $http.post('/user/deleteaddress.json', {id: address.id}, postCfg)
            .then(function (resp) {
                if (1 === resp.data.code) {
                    alert('删除成功!');
                    $scope.addrList.splice($scope.addrList.indexOf(address), 1);
                }
            }, function (resp) {
                console.log(resp);
            });
        }
    };

    // 设置默认地址
    $scope.setDefaultSite = function (addr) {
        $http.post('/user/setdefaultaddress.json', {id: addr.id}, postCfg)
        .success(function (data) {
            if (-1 === data.code) {
                $rootScope.preUrl = $location.url();
                $location.path('login');
            }
            else if (1 === data.code) {
                // 设置成功
                var index = $scope.addrList.indexOf(addr);
                for (var i = 0, j = $scope.addrList.length; i < j; i++) {
                    if (i === index) {
                        $scope.addrList[i].defaultflag = 1;
                    }
                    else {
                        $scope.addrList[i].defaultflag = 0;
                    }
                }
            }
        });
    };
}]);