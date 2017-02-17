index.controller('appointmentCtrl',
	['$scope', '$http', '$location', '$window', '$rootScope',
	function ($scope, $http, $location, $window, $rootScope) {
	
	// 首页搜索
	$scope.search = function () {
		if (!$scope.word || $.trim($scope.word) === '') {
			alert('请输入搜索关键字！');
			return;
		}
		$scope.designerList = [];
		var data = {
			kind: 'designer',
			q: $scope.word,
			page: 1,
		// areaid: 
		};
		$http.post('/home/search.json', data, postCfg)
		.success(function (data) {
			
			if (1 === data.code) {
				var designerList = data.data.designerlist,
				    goodsList = data.data.goodslist,
				    storeList = data.data.storelist,
				    starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png';
		        if (designerList.length === 0) {
		        	$scope.hasNoResult = true;
		        }
		        else {
		        	$scope.hasNoResult = false;
		        	// 处理发型师数据
					for (var i = 0; i < designerList.length; i++) {
						designerList[i].starUrl = [];
						designerList[i].avatar = picBasePath + designerList[i].avatar;
						for (var j = 0; j < designerList[i].score; j++) {
		                    designerList[i].starUrl.push({'path': starUrl1});
		                }
		                for (var k = j; k < 5; k++) {
		                    designerList[i].starUrl.push({'path': starUrl2});
		                }
					}
					$scope.designerList = designerList;
		        }
		        
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 跳转到设计师详情
	$scope.toDesignerDetail = function (designer) {
		$rootScope.designer = designer;
		// $window.history.go(-1);
		$location.path('go_pay');
	};
	$scope.tback = function () {
		$location.path('go_pay');
	};
}]);