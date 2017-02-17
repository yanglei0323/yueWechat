index.controller('packagedesignerCtrl',
	['$scope', '$http', '$location', '$window', '$rootScope',
	function ($scope, $http, $location, $window, $rootScope) {
	// 首页搜索
	$scope.loading = false;
    $scope.loaded = false;
    $scope.page = 1;
    $scope.designerList=[];
    function getdesignerlist() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		// 时尚发型列表
		$http.post('/v2/home/package/designer.json', {'page': $scope.page, 'packageid': $rootScope.packageid}, postCfg)
		.then(function (resp) {
			console.log(resp);
			if (1 === resp.data.code) {
				var designerList = resp.data.data.designerlist,
			    goodsList = resp.data.data.goodslist,
			    storeList = resp.data.data.storelist,
			    starUrl1 = '../../assets/images/star_h.png',
	            starUrl2 = '../../assets/images/star.png';
				if (designerList.length > 0) {
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
		                $scope.designerList.push(designerList[i]);
					}
					$scope.loading = false;
					$scope.page += 1;
				}
				else {
					// 加载完成
					$scope.loaded = true;
				}
				
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}
	getdesignerlist();
	$scope.getdesignerlist = getdesignerlist;


	// $http.post('/v2/home/package/designer.json',  {'packageid': $rootScope.packageid}, postCfg)
	// .success(function (data) {
	// 	console.log(data);
	// 	if (1 === data.code) {
	// 		var designerList = data.data.designerlist,
	// 		    goodsList = data.data.goodslist,
	// 		    storeList = data.data.storelist,
	// 		    starUrl1 = '../../assets/images/star_h.png',
	//             starUrl2 = '../../assets/images/star.png';
	//         if (designerList.length === 0) {
	//         	$scope.hasNoResult = true;
	//         }
	//         else {
	//         	$scope.hasNoResult = false;
	//         	// 处理发型师数据
	// 			for (var i = 0; i < designerList.length; i++) {
	// 				designerList[i].starUrl = [];
	// 				designerList[i].avatar = picBasePath + designerList[i].avatar;
	// 				for (var j = 0; j < designerList[i].score; j++) {
	//                     designerList[i].starUrl.push({'path': starUrl1});
	//                 }
	//                 for (var k = j; k < 5; k++) {
	//                     designerList[i].starUrl.push({'path': starUrl2});
	//                 }
	// 			}
	// 			$scope.designerList = designerList;
	//         }
	        
	// 	}
	// })
	// .error(function (data) {
	// 	// alert('数据请求失败，请稍后再试！');
	// });

	// 跳转到设计师详情
	$scope.toDesignerDetail = function (designer) {
		$rootScope.designer = designer;
		$location.path('packageorder');
	};
}]);