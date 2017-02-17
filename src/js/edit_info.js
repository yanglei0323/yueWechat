index.controller('editInfoCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	(function init() {
		var user = JSON.parse(sessionStorage.user);
		console.log(user);
		$scope.nickname = user.nickname;
		$scope.phone = user.account;
		$scope.sex = user.sexname;
		$scope.birthday = user.birthday;
		$scope.imgurl = picBasePath + user.imgurl;
	})();

	// 修改登录密码
	$scope.editLoginPwd = function () {
		$location.path('forget_pwd').search({type: 'login'});
	};

	// 修改支付密码
	$scope.editPayPwd = function () {
		$location.path('forget_pwd').search({type: 'pay'});
	};

	// 跳转到完善信息界面
	$scope.toCompleteInfo = function () {
		$location.path('complete_info').search({type: 'modify'});
	};
}]);