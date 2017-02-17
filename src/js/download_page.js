index.controller('downloadCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	
	// 初始化
	(function init() {
		$scope.phone = $location.search().phone || '';
	})();

	// 点击下载客户端
	$scope.download = function () {
		$window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wzj.hairdressing_user';
	};
}]);