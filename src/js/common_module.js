var commonModule = angular.module('commonModule',
	['mobile-angular-ui', 'mobile-angular-ui.gestures']);
// commonModule.factory();
commonModule.directive('slider', ['$swipe', '$interval', function ($swipe, $interval) {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		templateUrl: 'slider.html',
		link: function (scope, elem, attrs) {
			console.log(scope);
		}
	};
}]);

commonModule.directive('modal', [function () {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		templateUrl: 'modal.html',
		link: function (scope, elem, attrs) {
			console.log(elem);
		}
	};
}]);