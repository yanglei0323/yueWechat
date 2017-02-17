index.controller('fashionHairInfoCtrl',
    ['$scope', '$window', '$http', '$location', '$routeParams', '$timeout',
	function ($scope, $window, $http, $location, $routeParams, $timeout) {

    function setHairInfo(hair) {
        $http.post('/home/fashionhair/info.json', {'fashionhairid': hair.id}, postCfg)
        .then(function (resp) {
            if (1 === resp.data.code) {
                var hairInfo = resp.data.data;
                // hairInfo.imgurl = picBasePath + hairInfo.imgurl;
                // $scope.hairInfo = hairInfo;
                hair.iskeep = hairInfo.iskeep;
            }
            
        }, function (resp) {
            // alert('数据请求失败!请稍后再试！');
        });
    }
    // setHairInfo();

    // 点赞操作，包括点赞和取消点赞
    $scope.praiseOperation = function (hairInfo) {
        console.log(hairInfo);
    	var postUrl = hairInfo.iskeep ? '/home/fashionhair/unkeep.json' : '/home/fashionhair/keep.json';
        $http.post(postUrl, {'fashionhairid': parseInt(hairInfo.id)}, postCfg)
        .then(function (resp) {
            
            if (-1 === resp.data.code) {
                // 用户未登录
                sessionStorage.removeItem('user');
                $location.path('login');
            }
            else if (1 === resp.data.code) {
                hairInfo.iskeep = !hairInfo.iskeep;
                hairInfo.keepnum = hairInfo.iskeep ? hairInfo.keepnum + 1 : hairInfo.keepnum - 1;
            }
            else if (0 === resp.data.code) {
                alert(resp.data.reason);
            }
        }, function (resp) {
            // alert('数据请求失败!请稍后再试！');
        });
    };

    $scope.appoint = function () {
        $location.path('stylist');
    };

    (function init() {
        $scope.fashionHairList = [];
        var page = $location.search().page;
        var index = $location.search().index;
        $http.post('/home/fashionhair.json', {'page': page}, postCfg)
        .then(function (resp) {
            console.log(resp);
            if (1 === resp.data.code) {
                var fashionHairList = resp.data.data.fashionhairlist;
                if (fashionHairList.length > 0) {
                    for (var i = 0, j = fashionHairList.length; i < j; i++) {
                        fashionHairList[i].imgurl = picBasePath + fashionHairList[i].imgurl;
                        $scope.fashionHairList.push(fashionHairList[i]);
                    }
                    for (i = 0; i < $scope.fashionHairList.length; i++) {
                        setHairInfo($scope.fashionHairList[i]);
                    }
                    $timeout(function () {
                        $scope.commonSwiper.slideTo(index, 0, false);
                    });
                }
            }
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
    })();

}]); 