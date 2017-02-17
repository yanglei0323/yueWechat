index.controller('storeDetailCtrl',
	['$scope', '$http', '$location', '$routeParams', '$q', '$window',
	function ($scope, $http, $location, $routeParams, $q, $window) {
	var storeId = $routeParams.store_id;
	$scope.deferred = $q.defer();
	$scope.activityDeferred = $q.defer();
	$scope.designerList = [];
	$scope.page = 1;
	$scope.showMask1 = false;
	$scope.newactiveIndex='';

	// 根据id获取门店信息
	$http.post('/v2/store/info.json', {storeid: storeId}, postCfg)
	.success(function (data) {
		console.log(data);
		if (1 === data.code) {
			var store = data.data,
				starUrl1 = '../../assets/images/star_h.png',
                starUrl2 = '../../assets/images/star.png';
			store.imgs = [];
			store.starUrl = [];
			for (var i = 2; i < 6; i++) {
				store.imgs.push({'path': picBasePath + store.imgurl[i]});
			}
			for (i = 0; i < store.star; i++) {
	            store.starUrl.push({'path': starUrl1});
	        }
	        for (var j = i; j < 5; j++) {
	            store.starUrl.push({'path': starUrl2});
	        }
	        store.priceimgurl = picBasePath + store.priceimgurl;
			$scope.store = store;
		}
	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});

	// 根据id获取发型师信息
	// $http.post('/v2/store/designer.json', {storeid: storeId}, postCfg)
	// .success(function (data) {
	// 	console.log(data);
	// 	if (1 === data.code) {
	// 		$scope.designerList=data.data.designerlist;
	// 	}
	// })
	// .error(function (data) {
	// 	// alert('数据请求失败，请稍后再试！');
	// });

	$scope.toDetail = function (designer) {
		$location.path('stylist_detail/' + designer.id);
	};
	$scope.changebig= function (designer,index){
		$scope.newpiclist=designer;
		$scope.nowweight = !$scope.nowweight;
		mySwiper.slideTo(index, 0, false);
		$scope.newactiveIndex=index+1;
		$('.pictext').html($scope.newactiveIndex+'/3');
		// var scrollTop = document.body.scrollTop;//保存点击前滚动条的位置
		// window.onscroll=function(){
		// 	document.body.scrollTop = scrollTop;//赋值给滚动条的位置
		// };
	};
	//图片索引值
	var mySwiper = new Swiper('.swiper-container-id',{
		onTouchEnd: function(swiper){
			setTimeout(function(){
				$scope.newactiveIndex=mySwiper.activeIndex+1;
				$('.pictext').html($scope.newactiveIndex+'/3');
				return;
			},500);
		}
	});
	$scope.hiddenchange = function(){
		$scope.newpiclist='';
		$scope.nowweight = !$scope.nowweight;
		// window.onscroll=function(){
		// 	document.body.scrollTop = document.body.scrollTop;//赋值给滚动条的位置
		// };
	};
	$scope.showPrice = function (e) {
		// $scope.baseinfoflag='4';
		// $http.post('/v2/home/baseinfo.json', {'flag': $scope.baseinfoflag}, postCfg)
		// .success(function (data) {
		// 	if (1 === data.code) {
		// 		$scope.pricepage=data.data;
		// 		// 显示价目表
		// 		e.stopPropagation();
		// 		$scope.showMask1 = true;
		// 	}
		// })
		// .error(function (data) {
		// 	// alert('数据请求失败，请稍后再试！');
		// });
		$scope.showMask1 = true;
	};
	$scope.hideMask1 = function () {
		$scope.showMask1 = false;
	};
	$scope.forbidHide = function (e) {
		e.stopPropagation();
	};

	// 根据id获取店内活动
	$http.post('/store/activity.json', {storeid: storeId}, postCfg)
	.success(function (data) {
		if (1 === data.code) {
			var activityList = data.data.activitylist;
			for (var i = 0, j = activityList.length; i < j; i++) {
				activityList[i].imgurl = picBasePath + activityList[i].imgurl;
			}
			$scope.activityList = activityList;
		}
	})
	.error(function (data) {
		// alert('数据请求失败，请稍后再试！');
	});

	$scope.getDesignerInfo = getDesignerInfo;

	function getDesignerInfo() {
		// 根据id获取店内优秀发型师
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		var data = {
			storeid: storeId,
			page: $scope.page
		};
		$http.post('/v2/store/designer.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				console.log(data);
				var starUrl1 = '../../assets/images/star_h.png',
		            starUrl2 = '../../assets/images/star.png';
				var designerList = data.data.designerlist;
				if (designerList.length > 0) {
					for (var i = 0; i < designerList.length; i++) {
						designerList[i].starUrl = [];
						designerList[i].avatar = picBasePath + designerList[i].avatar;
						designerList[i].imgurl = picBasePath + designerList[i].imgurl;
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
					$scope.loaded = true;
				}
				
				// $scope.designerList = designerList;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	

	// 接受门店图片加载完的广播
	$scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});

	// 接受门店活动加载完的广播
	$scope.$on('activityFinished', function () {
		$scope.activityDeferred.resolve('succeed');
	});

	// 点击价目表
	// $scope.showPrice = function () {
	// 	alert('显示价目表');
	// };

	// 点击店内活动
	$scope.jumpToActivity = function (activity) {
		$window.location.href = activity.jumpurl;
	};

	// 收藏或者取消收藏门店
	$scope.keepStore = function (store) {
		console.log(store);
		var postUrl = (store.iskeep === false) ? '/v2/store/keep.json' : '/v2/store/unkeep.json';
		$http.post(postUrl, {storeid: storeId}, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				$scope.store.iskeep = !$scope.store.iskeep;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	$scope.toDesignerDetail = function (designer) {
		$location.path('stylist_detail/' + designer.id);
	};

	// 显示价目表
	// $scope.showPrice = function (e) {
	// 	e.stopPropagation();
	// 	$scope.showMask = true;
		
	// };

	$scope.hideMask = function () {
		$scope.showMask = false;
	};

	$scope.forbidHide = function (e) {
		e.stopPropagation();
	};

	$scope.toMap = function () {
		// location.href="http://map.baidu.com/mobile/webapp/index/index/foo=bar/tab=line";
	};

}]);