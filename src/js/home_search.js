index.controller('homeSearchCtrl',
	['$scope', '$http', '$location', '$window', '$rootScope',
	function ($scope, $http, $location, $window, $rootScope) {
	//已进入搜索执行函数
	$http.post('/v2/home/search/init.json', postCfg)
	.success(function (data) {
		console.log(data);
		if (1 === data.code) {
			$scope.orderdesigner = [];
			var orderdesigner = data.data.designerlist,
			    starUrl1 = '../../assets/images/star_h.png',
	            starUrl2 = '../../assets/images/star.png',
	            i, j, k;
        	$scope.hasNoResult = false;
        	// 处理发型师数据
			for (i = 0; i < orderdesigner.length; i++) {
				orderdesigner[i].starUrl = [];
				orderdesigner[i].avatar = picBasePath + orderdesigner[i].avatar;
				for (j = 0; j < orderdesigner[i].score; j++) {
                    orderdesigner[i].starUrl.push({'path': starUrl1});
                }
                for (k = j; k < 5; k++) {
                    orderdesigner[i].starUrl.push({'path': starUrl2});
                }
			}
			$scope.orderdesigner = orderdesigner;
	        
		}
	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});
	//实时监测执行联想搜索
	var kwds=$scope.keyword;
	setInterval(function(){
		var newkwds=$scope.keyword;
		if(kwds == newkwds || newkwds === ''){
			return;
		}
		if (!$scope.keyword || $.trim($scope.keyword) === '') {
			alert('请输入搜索关键字！');
			return;
		}
		$scope.designerList = [];
		$scope.goodsList = [];
		$scope.orderdesigner = [];
		var data = {
			cityid:1,
			q: $scope.keyword,
			page:1
		};
		$http.post('/v2/home/search/all.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var designerList = data.data.designerlist,
				    goodsList = data.data.goodslist,
				    starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png',
		            i, j, k;
		        if (0 === designerList.length && 0 === goodsList.length) {
		        	$scope.hasNoResult = true;
		        	return;
		        }
		        else {
		        	$scope.hasNoResult = false;
		        	// 处理发型师数据
					for (i = 0; i < designerList.length; i++) {
						designerList[i].starUrl = [];
						designerList[i].avatar = picBasePath + designerList[i].avatar;
						for (j = 0; j < designerList[i].score; j++) {
		                    designerList[i].starUrl.push({'path': starUrl1});
		                }
		                for (k = j; k < 5; k++) {
		                    designerList[i].starUrl.push({'path': starUrl2});
		                }
					}
					for (i = 0; i < goodsList.length; i++) {
						goodsList[i].img = picBasePath + goodsList[i].imgarray[0].imgurl;
					}
					$scope.designerList = designerList;
					$scope.goodsList = goodsList;
		        }
		        
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
		kwds=newkwds;
		return kwds;
	},500);
	// 首页点击搜索
	$scope.search = function () {
		if (!$scope.keyword || $.trim($scope.keyword) === '') {
			alert('请输入搜索关键字！');
			return;
		}
		$scope.designerList = [];
		$scope.goodsList = [];
		var data = {
			cityid:1,
			q: $scope.keyword,
			page:1
		};
		$http.post('/v2/home/search/all.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var designerList = data.data.designerlist,
				    goodsList = data.data.goodslist,
				    starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png',
		            i, j, k;
		        if (0 === designerList.length && 0 === goodsList.length) {
		        	$scope.hasNoResult = true;
		        	return;
		        }
		        else {
		        	$scope.hasNoResult = false;
		        	// 处理发型师数据
					for (i = 0; i < designerList.length; i++) {
						designerList[i].starUrl = [];
						designerList[i].avatar = picBasePath + designerList[i].avatar;
						for (j = 0; j < designerList[i].score; j++) {
		                    designerList[i].starUrl.push({'path': starUrl1});
		                }
		                for (k = j; k < 5; k++) {
		                    designerList[i].starUrl.push({'path': starUrl2});
		                }
					}
					for (i = 0; i < goodsList.length; i++) {
						goodsList[i].img = picBasePath + goodsList[i].imgarray[0].imgurl;
					}
					$scope.designerList = designerList;
					$scope.goodsList = goodsList;
		        }
		        
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 跳转到设计师详情
	$scope.toDesignerDetail = function (designer) {
		$rootScope.jobid='';
		$location.path('stylist_detail/' + designer.id);
	};

	// 跳转到门店详情
	$scope.toStoreDetail = function (store) {
		$location.path('store_detail/' + store.id);
	};

	// 跳转到商品详情
	$scope.toGoodsDetail = function (goods) {
		$location.path('mall_goods_detail/' + goods.id);
	};
}]);