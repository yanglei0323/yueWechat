index.controller('fastLoginCtrl', ['$scope', '$http', '$window', '$location', '$interval',
    function ($scope, $http, $window, $location, $interval) {

    var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var codeRe = /^\d{4}$/;
    $scope.sendCodeText = '发送验证码';

    // 获取验证码
    $scope.getCode = function () {
        if ($scope.sending) {
            return;
        }
        if (!phoneRe.test($scope.phone)) {
            alert('手机号无效！');
            return;
        }
    	$http.post('/user/sendlogin.json', {telnum: $scope.phone}, postCfg)
    	.then(function (resp) {
    		if (1 === resp.data.code) {
                $scope.sending = true;
                var leftTime = 60;
    			var timer = $interval(function () {
                    if (leftTime > 0) {
                        $scope.sendCodeText = '重新发送(' + (leftTime--) + ')';
                    }
                    else {
                        $scope.sendCodeText = '发送验证码';
                        $scope.sending = false;
                        $interval.cancel(timer);
                    }
                }, 1000);
    		}
    	}, function (resp) {
    		console.log(resp);
    	});
    };
    // 确认登录
    $scope.confirmLogin = function () {
        if (-1 === checkParams()) {
            return;
        }
    	var data = {
    		telnum: $scope.phone,
    		check: $scope.code
    	};
    	$http.post('/user/quicklogin.json', data, postCfg)
    	.then(function (resp) {
            if (1 === resp.data.code) {
                // 登录成功，将登录用户信息写到sessionStorage
                var user = resp.data.data;
                sessionStorage.setItem('user', JSON.stringify(user));
                if (user.nickname === '') {
                    // 昵称为空，跳转到完善信息页面
                    $location.path('complete_info').search({type: 'modify'}).replace();
                    return;
                }
                $window.history.go(-2);
                $timeout(function () {
                    $window.history.back();
                });
            }
            else if (0 === resp.data.code) {
                alert(resp.data.reason);
            }
    	}, function (resp) {
            // alert('数据请求失败，请稍后再试！');
    	});
    };
    // 已有账号，跳转到登录页面
    $scope.toLogin = function () {
    	$location.path('login');
    };

    function checkParams() {
        if (!phoneRe.test($scope.phone)) {
            alert('手机号无效！');
            return -1;
        }
        if (!codeRe.test($scope.code)) {
            alert('验证码无效！');
            return -1;
        }
        return 1;
    }
}]);