index.controller('registerCtrl',
    ['$scope', '$http', '$window', '$interval', '$location',
    function ($scope, $http, $window, $interval, $location) {
    
    var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var codeRe = /^\d{4}$/;
    var pwdRe = /^[0-9a-zA-Z_]{6,20}/;
    $scope.sendCodeText = '发送验证码';

    (function init() {
        // 初始化获取个人信息保护政策链接
        $http.post('/home/baseinfo.json', {flag: 5}, postCfg)
        .success(function (data) {
            console.log(data);
            if (1 === data.code) {
                $scope.link = data.data.imgurl;
            }
            else if (0 === data.code) {
                alert(data.reason);
            }
        })
        .error(function (data) {
            // alert('数据请求失败，请稍后再试！');
        });
    })();

    $scope.agree = false;
    // 发送验证码事件
    $scope.getCode = function () {
    	// 判断手机是否注册
    	if ($scope.sending) {
            return;
        }
        if (!phoneRe.test($scope.phoneNum)) {
            alert('手机号无效！');
            return;
        }
    	var judgePromise = $http.post('/user/exist.json', {account: $scope.phoneNum}, postCfg);
    	judgePromise.then(function (resp) {
    		if (1 === resp.data.code) {
    			if (1 === resp.data.data.exist) {
    				// 已经存在
    				alert('该手机号码已经注册，请直接登录！');
                    // $location.path('login');
    			}
    			else {
                    $http.post('/user/sendregist.json', {telnum: $scope.phoneNum}, postCfg)
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
    			}
    		}
    	}, function (resp) {
    		// alert('数据请求失败，请稍后再试！');
    	});
    };

    // 注册按钮点击事件
    $scope.register = function () {
        if (-1 === checkParams()) {
            return;
        }
    	var data = {
    		account: $scope.phoneNum,
    		password: $.md5($scope.password),
    		check: $scope.code
    	};
    	var registerPromise = $http.post('/user/regist.json', data, postCfg);
    	registerPromise.then(function (resp) {
    		if (1 === resp.data.code) {
    			alert('注册成功');
                sessionStorage.setItem('user', JSON.stringify(resp.data.data));
    			// 跳转到完善信息界面
    			$location.path('complete_info').replace();
    		}
            else if (0 === resp.data.code) {
                alert(resp.data.reason);
                return;
            }
    	}, function (resp) {
    		// alert('数据请求失败，请稍后再试！');
    	});
    };

    // 勾选是否阅读个人信息保护政策
    $scope.checkAgree = function () {
        $scope.agree = !$scope.agree;
    };

    function checkParams() {
        if (!phoneRe.test($scope.phoneNum)) {
            alert('手机号无效！');
            return -1;
        }
        if (!codeRe.test($scope.code)) {
            alert('验证码无效！');
            return -1;
        }
        if (!pwdRe.test($scope.password) || !pwdRe.test($scope.repeatPwd)) {
            alert('密码无效！');
            return -1;
        }
        if ($scope.password != $scope.repeatPwd) {
            alert('两次密码输入不一致！');
            return -1;
        }
        if (!$scope.agree) {
            alert('请阅读并同意“个人信息保护政策”！');
            return -1;
        }
        return 1;
    }

}]);