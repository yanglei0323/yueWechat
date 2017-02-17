index.controller('homeCtrl',
	['$scope', '$http', '$window', '$location', '$q', '$rootScope', 'Load',
	function ($scope, $http, $window, $location, $q, $rootScope, Load) {

	// 时尚资讯promise
    $scope.flashSaleDeferred = $q.defer();
    $scope.loading = false;
    $scope.loaded = false;
    $scope.page = 1;
    $scope.type = 'default';
    $scope.fashionHairList = [];
    $rootScope.desingopay = 0;
    // 是否显示过价目表
    var isShowPrice = false;
    $scope.selectedCity = localStorage.getItem('cityName') || '城市';

    $scope.$on('flashSaleRepeatFinished', function () {
        $scope.flashSaleDeferred.resolve('succeed');
    });

	$scope.toMore = function (index) {
		switch (index) {
			case 1:
				// 发型师
				$location.path('stylist');
				break;
			case 2:
				// 门店
				$location.path('store');
				break;
			case 3:
				// 时尚资讯
				$location.path('fashion_information');
				break;
			case 4:
				// 悦尚城
				$location.path('mall');
				break;
			case 5:
				// 时尚发型
				$location.path('fashion_hairstyle');
				break;
		}
	};
	$scope.navigate = function (index) {
		var user;
		switch (index) {
			case 1:
				$location.path('/');
				break;
			case 2:
				$location.path('stylist');
				break;
			case 3:
				$location.path('go_pay');
				break;
			case 4:
				$location.path('mall');
				break;
			case 5:
			    if (sessionStorage.user) {
			    	user = JSON.parse(sessionStorage.user);
			    	if (user.nickname === '') {
			    		alert('请填写您的昵称!');
			    		$location.path('complete_info').search({type: 'modify'});
			    		return;
			    	}
			    }
				$location.path('my');
				// $window.location.href = '/webapp/src/xiaoyue/home.html';
				break;
		}
	};

	// 轮播图是否加载完毕的promise
	$scope.deferred = $q.defer();
	// 明星发型师是否加载完毕的promise
	$scope.designerDeferred = $q.defer();

	// 首页轮播图
	$http.post('/v2/home/homead.json', {'cityid': 1}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var homeAdList = resp.data.data.homeadlist;
			for (var i = 0; i < homeAdList.length; i++) {
				homeAdList[i].imgurl = picBasePath + homeAdList[i].imgurl;
			}
			$scope.adList = homeAdList;
		}
	}, function (resp) {
		// alert('数据请求失败!请稍后再试');
	});

	// 轮播图跳转
	$scope.jump = function (ad) {
		$window.location.href = ad.jumpurl;
	};

	// 明星门店
	$http.post('/home/baseinfo.json', {'flag': 1}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var starStore = resp.data.data;
			starStore.imgurl = picBasePath + starStore.imgurl;
			$scope.starStore = starStore;
		}
		
	}, function (resp) {
		// alert('数据请求失败!请稍后再试');
	});

	// 悦商城
	$http.post('/home/baseinfo.json', {'flag': 2}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var mall = resp.data.data;
			mall.imgurl = picBasePath + mall.imgurl;
			$scope.mall = mall;
		}
	}, function (resp) {
		// alert('数据请求失败!请稍后再试');
	});

	// 明星造型师
	$http.post('/v2/home/stardesigner.json', {'cityid': 1}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var starDesigners = resp.data.data.designerlist;
			for (var i = 0, j = starDesigners.length; i < j; i++) {
				starDesigners[i].imgurl = picBasePath + starDesigners[i].imgurl;
			}
			$scope.starDesigners = starDesigners;
		}
	}, function (resp) {
		// alert('数据请求失败!请稍后再试');
	});

	

	// 时尚资讯列表
	$http.post('/home/fashionnews.json', {'sort': 'recommend'}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var fashionNewsList = resp.data.data.fashionnewslist;
			for (var i = 0, j = fashionNewsList.length; i < j; i++) {
				fashionNewsList[i].imgurl = picBasePath + fashionNewsList[i].imgurl;
			}
			$scope.fashionNewsList = fashionNewsList;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	//悦享美发
	$http.post('/v2/home/package/list.json', {'jobid': '1','page':'1','pagesize':'4'}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			console.log(resp);
			$scope.mfpackageList=resp.data.data.packagelist;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	//炫丽美甲
	$http.post('/v2/home/package/list.json', {'jobid': '2','page':'1','pagesize':'4'}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			$scope.mjpackageList=resp.data.data.packagelist;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	//百变美妆
	$http.post('/v2/home/package/list.json', {'jobid': '3','page':'1','pagesize':'4'}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			$scope.mzpackageList=resp.data.data.packagelist;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	//美搭
	$http.post('/v2/home/package/list.json', {'jobid': '4','page':'1','pagesize':'4'}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			$scope.mdpackageList=resp.data.data.packagelist;
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});


	function getFashionHair() {
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		// 时尚发型列表
		$http.post('/home/fashionhair.json', {'page': $scope.page, sort: $scope.type}, postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				var fashionHairList = resp.data.data.fashionhairlist;
				if (fashionHairList.length > 0) {
					for (var i = 0, j = fashionHairList.length; i < j; i++) {
						fashionHairList[i].page = $scope.page;
						fashionHairList[i].index = i;
						fashionHairList[i].imgurl = picBasePath + fashionHairList[i].imgurl;
						$scope.fashionHairList.push(fashionHairList[i]);
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
	getFashionHair();
	$scope.getFashionHair = getFashionHair;
	
	// 时尚发型按类型排序
	$scope.sort = function (type) {
		if ($scope.type && $scope.type === type) {
			return;
		}
		$scope.type = type;
		$scope.fashionHairList = [];
		$scope.page = 1;
		$scope.loaded = false;
		$scope.loading = false;
		getFashionHair();
	};
	
	// 跳转到时尚发型详情
	$scope.showHairInfo = function (hair) {
		$location.path('fashion_hair_info').search({page: hair.page, index: hair.index});
	};
	// 跳转到套餐详情
	$scope.showPackageInfo = function (item) {
		$location.path('home_package').search({'packageid': item.id});
	};

	$scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});
	$scope.$on('designerRepeatFinished', function () {
		$scope.designerDeferred.resolve('succeed');
	});

	// 明星造型师点击跳转
	$scope.toDesigner = function (designer) {
		$location.path('stylist_detail/' + designer.designerid);
	};

	// 跳转到时尚资讯
	$scope.toFashionNews = function (news) {
		$window.location.href = news.jumpurl;
	};

	// 跳转到首页搜索
	$scope.homeSearch = function () {
		$location.path('home_search');
	};

	// 显示价目表
	$scope.showPrice = function (e) {
		e.stopPropagation();
		$scope.showMask = true;
		if (!isShowPrice) {
			$http.post('/home/baseinfo.json', {flag: 4}, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					$scope.priceImg = picBasePath + data.data.imgurl;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
	};

	// 首页明星门店图片点击
	$scope.storeDetail = function (store) {
		
		$location.path('store_detail/' + store.id);
	};

	// 首页悦商城图片点击
	$scope.goodsDetail = function (goods) {
		$location.path('mall_goods_detail/' + goods.id);
	};

	// 点击vip专区跳转到购买vip页面
	$scope.toVip = function () {
		if (!sessionStorage.user) {
			$location.path('login');
		}
		var user = JSON.parse(sessionStorage.user);
		if (user.nickname === '') {
			// 跳转到完善信息
			alert('请填写您的昵称!');
			$location.path('complete_info').search({type: 'modify'});
		}
		$location.path('recharge');
	};

	// 点击去买单
	$scope.goPay = function () {

		if (!sessionStorage.user) {
			$location.path('login');
			return;
		}
		var user = JSON.parse(sessionStorage.user);
		if (user.nickname === '') {
			// 跳转到完善信息
			alert('请填写您的昵称!');
			$location.path('complete_info').search({type: 'modify'});
			return;
		}
		$location.path('go_pay');
	};

	// 取消显示价格
	$scope.hideMask = function () {
		$scope.activityShow = false;
		$scope.showMask = false;
	};

	(function getActivity() {
		if (sessionStorage.hasShowActivity && sessionStorage.hasShowActivity === 'true') {
			return;
		}
		// 首页弹窗最新活动
		$http.post('/home/newactivity.json', postCfg)
		.success(function (data) {
			if (1 === data.code && data.imgurl && data.imgurl !== '') {
				sessionStorage.setItem('hasShowActivity', 'true');
				$scope.showMask = true;
				$scope.activityShow = true;
				var activity = data.data;
				activity.imgurl = picBasePath + activity.imgurl;
				$scope.activity = activity;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	

	$scope.toActivity = function (activity, e) {
		e.stopPropagation();
		$window.location.href = activity.jumpurl;
	};

	$scope.forbidHide = function (e) {
		e.stopPropagation();
	};

	$scope.hideActivity = function () {
		$scope.activityShow = false;
		$scope.showMask = false;
	};

	// 跳转到选择城市页面
	$scope.selectCity = function () {
		$location.path('select_city');
	};

	$scope.topNav = function (index) {
		switch (index) {
			case 1:
				$location.path('stylist').search({jobid: 1});
				break;
			case 2:
				$location.path('stylist').search({jobid: 2});
				break;
			case 3:
				$location.path('stylist').search({jobid: 3});
				break;
			case 4:
				// alert('即将开通，敬请期待！');
				$location.path('stylist').search({jobid: 4});
				break;
		}
	};
	$(window).scroll(function(){
		var scrollTop=parseInt(document.body.scrollTop||document.documentElement.scrollTop);
		if(scrollTop>=20&&scrollTop<=400){
			$('.nh-bg').css('opacity',scrollTop/650);
		}else if(scrollTop<=19){
			$('.nh-bg').css('opacity','0');
		}else if(scrollTop>400){
			$('.nh-bg').css('opacity','0.61538');
		}
	});
}]);