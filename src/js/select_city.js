index.controller('selectCityCtrl',
	['$scope', '$http', '$location', '$window',
	function ($scope, $http, $location, $window) {
	

	(function init() {
		// 获取城市列表
		$http.post('/v2/home/city/list.json', postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				$scope.citylist = data.data.citylist;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	$scope.selectCity = function (city) {
		if(city.isopen=="即将开通"){
			return;
		}
		localStorage.setItem('cityId', city.id);
		localStorage.setItem('cityName', city.name);
		$window.history.back();
	};
}]);