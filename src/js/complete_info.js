index.controller('completeInfoCtrl',
	['$scope', '$http', '$window', 'Upload', '$location', '$routeParams',
	function ($scope, $http, $window, Upload, $location, $routeParams) {

	(function init() {
		if ($location.search().type && $location.search().type === 'modify') {
			// 修改信息，不是完善信息
			$scope.modify = true;
			var user = JSON.parse(sessionStorage.user);
			if (user.imgurl !== '') {
				$scope.avatar = picBasePath + user.imgurl;
			}
			$scope.nickname = user.nickname;
			$scope.sexFlag = parseInt(user.sexflag) === 2 ? 0 : parseInt(user.sexflag);
			$scope.birthday = new Date(user.birthday);
		}
		else {
			// 完善信息中默认性别为男
			$scope.sexFlag = 0;
		}
	})();

	// 设置性别
	$scope.setSexFlag = function (flag) {
		$scope.sexFlag = flag;
	};
	
	$scope.complete = function () {
		if (!$scope.nickname || $scope.nickname === '') {
			alert('请输入您的昵称');
			return;
		}
		var data = {
			avatar: $scope.avatar,
			nickname: $scope.nickname,
			sexflag: $scope.sexFlag,
			birthday: $scope.birthday
		};
		Upload.upload({
			url: '/user/edit.json',
			data: data
		}).then(function (resp) {
			if (-1 === resp.data.code) {
				$location.path('login');
				return;
			}
			if (1 === resp.data.code) {
				sessionStorage.setItem('user', JSON.stringify(resp.data.data));
				alert('信息提交成功!');
				$location.path('/').replace();
			}
		}, function (resp) {
			console.log(resp);
		});
	};
}]);
