index.controller('stylistDetailCtrl',
	['$scope', '$routeParams', '$http', '$location', '$window', '$rootScope',
	function ($scope, $routeParams, $http, $location, $window, $rootScope) {

	var priceShowed = false,
		lifeShowed = false,
		workShowed = false;
    var designerId = $routeParams.id;
    var jobid;
	jobid=$location.search().jobid;
	$rootScope.desingopay = 1;
    $scope.lifePage = 1;
    $scope.workPage = 1;
    $scope.lifeList = [];
    $scope.workList = [];

    $scope.priceList = [];
    $scope.lifeimgdiv=false;

	 $scope.project = true;
	if($rootScope.newdesignzp){
		$scope.project = false;
		$scope.work=true;
		$rootScope.newdesignzp=false;
	}
	$scope.show = function (index) {
		$scope.project = (1 === index ? true : false);
		$scope.price = (2 === index ? true : false);
		$scope.life = (3 === index ? true :false);
		$scope.work = (4 === index ? true : false);
		switch (index) {
			case 2:
				if (priceShowed !== true) {
					priceShowed = true;
					getPrice();
				}
				break;
			case 3:
				if (lifeShowed !== true) {
					lifeShowed = true;
				}
				break;
			case 4:
				if (workShowed !== true) {
					workShowed = true;
				}
				break;
		}
	};

	// 获取发型师详情
	$http.post('/v2/designer/info.json', {'designerid': $routeParams.id}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var commentLevel = [],
				designer = resp.data.data;
			// 暂时未添加图片url前缀
			for (var i = 0; i < designer.score; i++) {
				commentLevel.push({'path': '../../assets/images/star_h.png'});
			}
			for (i = 0; i < 5 - designer.score; i++) {
				commentLevel.push({'path': '../../assets/images/star.png'});
			}
			designer.commentLevel = commentLevel;
			designer.avatar = picBasePath + designer.avatar;
			$scope.designer = designer;
			console.log(designer);
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	// 初始化就要获取发型师项目
	$http.post('/v2/designer/service.json', {'designerid': parseInt($routeParams.id)}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			var serviceList = resp.data.data.servicelist;
			for (var i = 0, j = serviceList.length; i < j; i++) {
				serviceList[i].serviceTime = serviceList[i].length;
				serviceList[i].selected = false;
			}
			$scope.serviceList = serviceList;
			// 计算总的服务时间
			$scope.totalServiceTime = function () {
				var totalTime = 0;
				for (var i = 0, j = $scope.serviceList.length; i < j; i++) {
					if ($scope.serviceList[i].selected === true) {
						totalTime += $scope.serviceList[i].serviceTime;
					}
				}
				return totalTime;
			};
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	// 获取发型师价格
	function getPrice() {
		var data = {
			designerid: $routeParams.id
		};
		$http.post('/designer/price.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				var dataArr = data.data;
				for (var key1 in dataArr) {
					var priceItem = {};
					priceItem.title = key1;
					priceItem.items = [];
					for (var key2 in dataArr[key1]) {
						for (var key3 in dataArr[key1][key2]) {
							priceItem.items.push({title: key2 + '-' + key3, price: dataArr[key1][key2][key3]});
						}
					}
					$scope.priceList.push(priceItem);
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getWorks = getWorks;
	// 获取发型师作品
	function getWorks() {
		if ($scope.workLoading) {
			return;
		}
		$scope.workLoading = true;
		var data = {
			designerid: $routeParams.id,
			page: $scope.workPage
		};
		$http.post('/v2/designer/work.json', data, postCfg)
		.then(function (resp) {
			if (1 === resp.data.code) {
				var workList = resp.data.data.designerworklist;
				if (workList.length > 0) {
					for (var i = 0; i < workList.length; i++) {
						workList[i].imgurl = picBasePath + workList[i].imgurl;
						$scope.workList.push(workList[i]);
					}
					$scope.workLoading = false;
					$scope.workPage += 1;
				}
				else {
					$scope.workLoaded = true;
				}
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getLife = getLife;
	// 获取发型师生活
	
	function getLife() {
		if ($scope.lifeLoading) {
			return;
		}
		$scope.lifeLoading = true;
		var data = {
			designerid: $routeParams.id,
			page: $scope.lifePage
		};
		$http.post('/v2/designer/life.json', data, postCfg)
		.then(function (resp) {
			console.log(resp);
			if (1 === resp.data.code) {
				var lifeList = resp.data.data.designerlifelist;
				if (lifeList.length > 0) {
					for (var i = 0; i < lifeList.length; i++) {
						lifeList[i].imgLength = lifeList[i].imgurl.length;
						lifeList[i].imgArr = [];
						for (var j = 0; j < lifeList[i].imgurl.length; j++) {
							lifeList[i].imgArr.push({path: picBasePath + lifeList[i].imgurl[j]});
						}
						$scope.lifeList.push(lifeList[i]);
					}
					$scope.lifeLoading = false;
					$scope.lifePage += 1;
				}
				else {
					$scope.lifeLoaded = true;
				}
			}
		}, function (resp) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	// 选择发型师项目
	$scope.selectService = function (service) {
		service.selected = !service.selected;
	};

	// 关注（收藏）或者取消关注（取消收藏）发型师
	$scope.keepDesigner = function (designer) {
		var postUrl = designer.iskeep ? '/v2/designer/unkeep.json' : '/v2/designer/keep.json';
		$http.post(postUrl, {designerid: designer.id}, postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (1 === data.code) {
				$scope.designer.iskeep = !$scope.designer.iskeep;
				if ($scope.designer.iskeep) {
					$scope.designer.praisenum++;
				}
				else {
					$scope.designer.praisenum--;
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	// 跳转到发型师更多介绍页面
	$scope.designerIntro = function (designer) {
		$window.location.href = designer.storyurl;
	};

	// 跳转到发型师评论页面
	$scope.toDesignerComment = function (designer) {
		$location.path('stylist_comment/' + designer.id);
	};

	// 作品详情
	$scope.toWorkDetail = function (work) {
		$location.path('stylist_work_detail/' + work.id).search({name: work.name});
	};

	// 点击预约按钮
	$scope.appoint = function () {
		// 设置选择的项目
		var serviceList = [];
		for (var i = 0; i < $scope.serviceList.length; i++) {
			if ($scope.serviceList[i].selected) {
				serviceList.push($scope.serviceList[i].id);
			}
		}
		if (0 === serviceList.length) {
			alert('请选择预约项目！');
			return;
		}
		$rootScope.serviceItems = serviceList;
		if ($rootScope.dateIndex > 0 && $rootScope.timeIndex > 0) {
			// 选择了时间，则跳转到预约确认的界面
			$location.path('appoint_confirm/' + designerId);
		}
		else {
			// 跳转到选择时间页面
			$location.path('appoint_confirm/' + designerId);
		}
	};

	// 跳转到活动页面
	$scope.jumpToActivity = function (activity) {
		$window.location.href = activity.jumpurl;
	};

	// 展开价格
	$scope.showItems = function (price) {
		price.show = !price.show;
	};

	// 点击发型师生活中的图片
	$scope.showLifeImg = function ( img) {
		//$location.path('stylist_life_pics').search({imgArr: JSON.stringify(life.imgArr), index: life.imgArr.indexOf(img)});
		$scope.lifeimgdiv=!$scope.lifeimgdiv;
		$scope.fixedshowimg=img;
	};
	$scope.hidlifeimgdiv = function (){
		$scope.lifeimgdiv=!$scope.lifeimgdiv;
	};
	$scope.gopaymd = function(){
		$rootScope.designer = $scope.designer;
		$location.path('go_pay').search({jobid:$location.search().jobid});
	};
	$scope.tback = function(){
		if($rootScope.jobid){
			$location.path('stylist').search({jobid:$rootScope.jobid});
		}else{
			$window.history.back();
		}
	};

}]);
