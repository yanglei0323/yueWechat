index.controller('forgetPwdCtrl', ['$scope', '$interval', '$http', '$location',
	function ($scope, $interval, $http, $location) {

	var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var codeRe = /^\d{4}$/;
    var pwdRe = /^[0-9a-zA-Z_]{6,20}/;
	$scope.sendCodeText = '获取验证码';

    var type = $location.search().type;
    var sendCodeUrl = '';
    var targetUrl = '';

    (function init() {
        switch (type) {
            case 'forget_pwd':
                $scope.title = '忘记密码';
                sendCodeUrl = '/user/sendforget.json';
                targetUrl = '/user/forget.json';
                break;
            case 'login':
                $scope.title = '修改登录密码';
                sendCodeUrl = '/user/modifypasswordcode.json';
                targetUrl = '/user/editpassword.json';
                break;
            case 'pay':
                $scope.title = '修改支付密码';
                sendCodeUrl = '/user/modifypaypasswordcode.json';
                targetUrl = '/user/editpaypassword.json';
                break;
            default:
                break;
        }
    })();
	
	$scope.sendCode = function () {
		if ($scope.sending) {
			return;
		}
		if (!phoneRe.test($scope.phoneNum)) {
            alert('手机号无效！');
            return;
        }
		var data = {
			telnum: $scope.phoneNum
		};
		$http.post(sendCodeUrl, data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var remainTime = 60;
				$scope.sending = true;
				var timer = $interval(function () {
					if (remainTime > 0) {
						$scope.sendCodeText = '重新发送(' + (remainTime--) + ')';
					}
					else {
						$scope.sending = false;
						$interval.cancel(timer);
						$scope.sendCodeText = '获取验证码';
					}
				}, 1000);
			}
			else {
				alert('验证码发送失败，请稍后再试！');
			}
		})
		.error(function (data) {
			console.log(data);
		});
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
        if (!$scope.password || !$scope.repeatPwd || !pwdRe.test($scope.password) || !pwdRe.test($scope.repeatPwd)) {
            alert('密码无效！');
            return -1;
        }
        if ($scope.password != $scope.repeatPwd) {
            alert('两次密码输入不一致！');
            return -1;
        }
        return 1;
    }

    $scope.confirm = function () {
    	if (-1 === checkParams()) {
            return;
        }
    	var data = {
    		telnum: $scope.phoneNum,
    		password: $.md5($scope.password),
    		check: $scope.code
    	};
        if (type === 'pay') {
            data = {
                paypassword: $.md5($scope.password),
                check: $scope.code
            };
        }
    	$http.post(targetUrl, data, postCfg)
    	.then(function (resp) {
    		console.log(resp);
    		if (1 === resp.data.code) {
    			alert('密码修改成功');
    			sessionStorage.setItem('user', JSON.stringify(resp.data.data));
    			$location.path('/').replace();
    		}
            else {
                alert(resp.data.reason);
                return;
            }
    	}, function (resp) {
    		console.log(resp);
    	});
    };

}]);