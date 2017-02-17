index.controller('goPayCtrl',
	['$scope', '$routeParams', '$http', '$location', '$window', '$rootScope',
	function ($scope, $routeParams, $http, $location, $window, $rootScope) {
	var jobid;
	jobid=$location.search().jobid;
	var hasDesigner = false;
	$scope.tabs = [];
	$scope.selectedItemId = [];
	$scope.selectedItem = [];
	$scope.usefulServiceList = [];
	$scope.price = 0;
	$scope.showinputdiv=false;
	$scope.threenum=[];
	$scope.jhdiv=true;
	$scope.count = 1;
	$scope.changenumdiv=false;
	$scope.personshow=false;
	$scope.commonshow=false;
	$rootScope.serviceCoupon=false;
	(function init() {
		if($rootScope.desingopay === 1){
			$scope.personshow=!$scope.personshow;
			$('#go-pay-container').css('padding-bottom','0rem');
		}else{
			$('#go-pay-container').css('padding-bottom','0rem');
		}
		if ($rootScope.designer) {
			$scope.designer = $rootScope.designer;
			$scope.designerName = $scope.designer.name;
			hasDesigner = true;
			getDesignerService($scope.designer);
			

		}
		else {

			$scope.designerName = '请选择发型师';
			// 获取项目列表
			$http.post('/v2/user/payorder.json',{'designerid':40}, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					var serviceList = data.data.serviceonelist;
					for (var i = 0; i < serviceList.length; i++) {
						serviceList[i].imgurl = picBasePath + '/' + serviceList[i].imgurl;
						serviceList[i].disableimgurl = picBasePath + serviceList[i].disableimgurl;
						serviceList[i].clickimgurl = picBasePath + serviceList[i].clickimgurl;
						serviceList[i].img = serviceList[i].imgurl;
					}
					$scope.serviceList = serviceList;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		
		// 获取打折和立减活动列表
		$http.post('/user/getactivitylistofcommon.json', postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
				return;
			}
			if (1 === data.code) {
				var activityList = data.data.activitylist;
				$scope.commonActivityList = activityList;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
		// 获取新用户活动列表
		$http.post('/user/getactivitylistofnewuser.json', postCfg)
		.success(function (data) {
			if (-1 === data.code) {
				$location.path('login');
				return;
			}
			if (1 === data.code) {
				var activityList = data.data.activitylist;
				$scope.nuActivityList = activityList;
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();


	//铺开内容选定
	$scope.selectfirstItem=function(item){
		item.selected = !item.selected;
		
		if($scope.selectedItemId.indexOf(item.id)=== -1){
			$scope.selectedItemId.push(item.id);
			$scope.threenum.push(item.englishname);
		}else if($scope.selectedItemId.indexOf(item.id) != -1){
			$scope.nowxb=$scope.selectedItemId.indexOf(item.id);
			$scope.selectedItemId.splice(
				$scope.selectedItemId.indexOf(item.id), 1);
			$scope.threenum.splice(
				$scope.nowxb, 1);
		}
		if($scope.selectedItemId.length ===0){
			$scope.threenum=[];
		}
		getConsumerSumPrice();
	};

	// // 确认选中项目
	// $scope.confirmfirstSelectItem = function (item) {
	// 	var selectFlag = false,
	// 	    i, j, tabs;
		
	// 		for (i = 0; i < $scope.serviceList[0].serviceItemList.length; i++) {
	// 			if ($scope.serviceList[0].serviceItemList_1[i].selected) {
	// 				$scope.serviceList[0].hasItemSelected = true;
	// 				selectFlag = true;
	// 				$scope.selectedItemId.push($scope.serviceList[0].serviceItemList_1[i].id);
	// 				$scope.threenum.push($scope.count);
	// 				$scope.selectedItem.push({
	// 					name: $scope.serviceList[0].name + '-' + $scope.serviceList[0].serviceItemList_1[i].name,
	// 					price: $scope.serviceList[0].serviceItemList_1[i].price
	// 				});
	// 			}
	// 			else if ($scope.selectedItemId.indexOf($scope.serviceList[0].serviceItemList_1[i].id) != -1) {
	// 				$scope.selectedItemId.splice(
	// 					$scope.selectedItemId.indexOf($scope.serviceList[0].serviceItemList_1[i].id), 1);
	// 				$scope.selectedItem.splice(
	// 					$scope.selectedItemId.indexOf($scope.serviceList[0].serviceItemList_1[i].id), 1);
	// 				$scope.threenum.splice($scope.count,1);
	// 			}
	// 			console.log($scope.serviceList[0].serviceItemList[i].id);
	// 		}
	// 	// 计算价格
	// 	console.log($scope.threenum);
	// 	console.log($scope.selectedItemId);
	// 	getConsumerSumPrice();
	// };
	// 铺开内容确认选中项目
	// $scope.confirmfirstSelectItem = function (item) {
	// 	var selectFlag = false,
	// 	    i;
		
		
	// 	for (i = 0; i < $scope.serviceItemList_1.length; i++) {
	// 		if ($scope.serviceItemList_1[i].selected) {
	// 			$scope.selectedItemId.push($scope.serviceItemList_1[i].id);
	// 			$scope.threenum.push($scope.count);
	// 			$scope.selectedItem.push({
	// 				name: $scope.serviceItemList_1[i].name + '-' + $scope.serviceItemList_1[i].name,
	// 				price: $scope.serviceItemList_1[i].price
	// 			});
	// 		}
	// 		else if ($scope.selectedItemId.indexOf($scope.serviceItemList_1[i].id) != -1) {
	// 			$scope.selectedItemId.splice(
	// 				$scope.selectedItemId.indexOf($scope.serviceItemList_1[i].id), 1);
	// 			$scope.selectedItem.splice(
	// 				$scope.selectedItemId.indexOf($scope.serviceItemList_1[i].id), 1);
	// 			$scope.threenum.splice($scope.count);
	// 		}
	// 	}
	// 	$scope.showMask = false;
	// 	$scope.changenumdiv=false;
	// 	// 计算价格
	// 	console.log($scope.threenum);
	// 	console.log($scope.selectedItemId);
	// 	getConsumerSumPrice();
	// };
	
	//实时监听手动输入框变化
	$('.serviceinput-1').bind('input propertychange', function() {  
	    getConsumerSumPrice();
	}); 
	$('.serviceinput-2').bind('input propertychange', function() {  
	    getConsumerSumPrice();
	});
	// 根据设计师获取服务列表
	function getDesignerService(designer) {
		$http.post('/v2/user/payorder.json', {designerid: designer.id}, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
				return;
			}
			if (1 === data.code) {
				var serviceList = data.data.serviceonelist;
				for (var i = 0; i < serviceList.length; i++) {
					serviceList[i].imgurl = picBasePath + serviceList[i].imgurl;
					serviceList[i].disableimgurl = picBasePath + serviceList[i].disableimgurl;
					serviceList[i].clickimgurl = picBasePath + serviceList[i].clickimgurl;
					serviceList[i].img = (serviceList[i].disable === 1) ? serviceList[i].disableimgurl : serviceList[i].imgurl;
				}
				$scope.serviceList = serviceList;
				var commondata = {
					serviceoneid: $scope.serviceList[0].id,
					designerid: $scope.designer.id
				};
				$http.post('/v2/user/getserviceitem.json', commondata, postCfg)
				.success(function (data) {
					if (1 === data.code) {
						var itemData = data.data;
							// 此时没有tab选项，直接显示第三级的项目
						$scope.serviceItemList_1 = itemData.serviceitem;
						$scope.commonshow=true;
						$scope.commonname=$scope.serviceList[0].name;
						// $scope.serviceList[0].hasTab = false;
						for (var j = 0; j < $scope.serviceItemList_1.length; j++) {
							$scope.serviceItemList_1[j].englishname =1;
						}
					}

				})
				.error(function (data) {
					// alert('数据请求失败，请稍后再试！');
				});
				for (i = 0; i < serviceList.length; i++) {
					if (serviceList[i].disable != 1) {
						$scope.usefulServiceList.push(serviceList[i]);
						getServiceItemList(serviceList[i]);
					}
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.selectStore = function () {
		$location.path('select_store');
	};
	$scope.showhidinputdiv =function(){
		$scope.showinputdiv=!$scope.showinputdiv;
	};
	// 选择新用户活动
	$scope.selectNUActivity = function (activity) {
		if (!$scope.selectedItemId || $scope.selectedItemId.length === 0) {
			alert('请先选择项目!');
			return;
		}
		activity.selected = !activity.selected;
		var nuActivityIdList  = [];
		for (var i = 0; i < $scope.nuActivityList.length; i++) {
			if ($scope.nuActivityList[i].selected) {
				nuActivityIdList.push($scope.nuActivityList[i].id);
			}
		}
		$scope.nuActivityIdList = nuActivityIdList;
		getConsumerSumPrice();
	};

	// 选择打折和立减活动列表
	$scope.selectCommonActivity = function (activity) {
		if (!$scope.selectedItemId || $scope.selectedItemId.length === 0) {
			alert('请先选择项目!');
			return;
		}
		var flag = !activity.selected;
		for (var i = 0; i < $scope.commonActivityList.length; i++) {
			$scope.commonActivityList[i].selected = false;
		}
		activity.selected = flag;
		if (activity.selected) {
			// 选中了打折和立减活动
			$scope.discountFlag = 3;
			$scope.discountValue = activity.id;
		}
		else {
			$scope.discountFlag = 0;
			$scope.discountValue = 0;
		}
		getConsumerSumPrice();
	};
	$scope.odersearch=function(){
		$location.path('appointment');
	};

	// 下订单
	$scope.confirm = function () {
		// if (!$scope.selectedItemId || $scope.selectedItemId.length === 0) {
		// 	alert('请先选择项目!');
		// 	return;
		// }
		if($scope.threenum.length=== 0){
			$scope.threenum = [1];
		}
		var data = {
			designerservicethreeid: $scope.selectedItemId,
			designerid: $scope.designer.id,
			designerservicethreenum: $scope.threenum,
			other: $('.serviceinput-1').val(),
			undiscountother: $('.serviceinput-2').val()
		};
		console.log(data);
		$http.post('/v2/user/generateconsumedorder.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				// 跳转到支付页面
				var orderId = data.data.id;
				$location.path('pay_service/' + orderId);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	function getServiceItemList(service) {
		if (!hasDesigner) {
			alert('请选择发型师!');
			return;
		}
		if (service.disable === 1) {
			return;
		}
		// $scope.showMask = true;
		$scope.selectedImg = service.clickimgurl;
		var data = {
			serviceoneid: service.id,
			designerid: $scope.designer.id
		};
		$http.post('/v2/user/getserviceitem.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				var itemData = data.data,
				    tab = itemData.tab;
			    var j;
				if (1 === tab.length && tab[0] === 'serviceitem') {
					// 此时没有tab选项，直接显示第三级的项目
					var serviceItemList = itemData.serviceitem;
					service.hasTab = false;
					service.serviceItemList = serviceItemList;
				}
				else {
					service.hasTab = true;
					service.tabs = [];
					service.itemData = itemData;
					for (var i = 0; i < tab.length; i++) {
					    service.tabs.push({tabName: tab[i], selected: false});
					}
					service.tabs[1].selected = true;
					service.curTab = tab[1];
					service.serviceItemList = service.itemData[tab[1]];
				}
				for (j = 0; j < service.serviceItemList.length; j++) {
					service.serviceItemList[j].englishname =1;
				}
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.showService = function (service) {
		var i = 0, j = 0,
		    itemData = service.itemData,
		    itemList = [], tabs;
		if (!hasDesigner) {
			alert('请选择发型师!');
			return;
		}
		if (service.disable === 1) {
			return;
		}
		if(service.id === 7){
			$scope.changenumdiv=!$scope.changenumdiv;
		}
		for (i = 0; i < $scope.usefulServiceList.length; i++) {
			$scope.usefulServiceList[i].clicking = false;
		}
		if (service.hasTab) {
			tabs = service.itemData.tab;
			for (i = 0; i < tabs.length; i++) {
				for (j = 0; j < itemData[tabs[i]].length; j++) {
					itemData[tabs[i]][j].selected =
					    $scope.selectedItemId.indexOf(itemData[tabs[i]][j].id) != -1 ? true : false;
				}
			}
		}
		else {
			for (i = 0; i < service.serviceItemList.length; i++) {
				service.serviceItemList[i].selected =
				    $scope.selectedItemId.indexOf(service.serviceItemList[i].id) != -1 ? true: false;
			}
		}
		$scope.showMask = true;
		service.clicking = true;

	};

	$scope.hideMask = function () {
		$scope.showMask = false;
	};

	// 选中项目
	$scope.selectItem = function (item) {
		item.selected = !item.selected;
	};

	// 点击tab
	$scope.selectTab = function (service, tab) {
		if (tab.selected) {
			return;
		}
		for (var i = 0; i < service.tabs.length; i++) {
			service.tabs[i].selected = false;
		}
		tab.selected = true;
		service.curTab = tab.tabName;
		service.serviceItemList = service.itemData[tab.tabName];
	};
	$scope.changeNum = function($event,count){
		if(count <= 0){
			count=0;
			return;
		}
	};

	//
	$scope.getdownnum=function(item){
		item.selected = true;
		if(item.englishname<=1){
			return;
		}
		item.englishname=item.englishname-1;
	};
	$scope.getupnum=function(item){
		item.selected = true;
		if(item.englishname>=99){
			return;
		}
		item.englishname=item.englishname+1;
		
	};
	// 确认选中项目
	$scope.confirmSelectItem = function (service) {
		var selectFlag = false,
		    i, j, tabs;
		if (service.hasTab) {
			tabs = service.itemData.tab;
			var itemData = service.itemData;
			for (i = 0; i < tabs.length; i++) {
				for (j = 0; j < itemData[tabs[i]].length; j++) {
					if (itemData[tabs[i]][j].selected) {
						service.hasItemSelected = true;
						selectFlag = true;
						service.img = service.clickimgurl;
						if ($scope.selectedItemId.indexOf(itemData[tabs[i]][j].id) === -1) {
							$scope.selectedItemId.push(itemData[tabs[i]][j].id);
							$scope.threenum.push($scope.count);
							$scope.selectedItem.push({
								name: service.name + '-' + tabs[i] + '-' + itemData[tabs[i]][j].name,
								price: itemData[tabs[i]][j].price
							});

						}
					}
					else if ($scope.selectedItemId.indexOf(itemData[tabs[i]][j].id) != -1) {
						$scope.nowxb=$scope.selectedItemId.indexOf(itemData[tabs[i]][j].id);
						$scope.selectedItemId.splice(
							$scope.selectedItemId.indexOf(itemData[tabs[i]][j].id), 1);
						$scope.selectedItem.splice(
							$scope.selectedItemId.indexOf(itemData[tabs[i]][j].id), 1);
						$scope.threenum.splice(
							$scope.nowxb,1);
					}
				}
			}
		}
		else {
				for (i = 0; i < service.serviceItemList.length; i++) {
					if (service.serviceItemList[i].selected) {
						service.hasItemSelected = true;
						selectFlag = true;
						service.img = service.clickimgurl;
						if ($scope.selectedItemId.indexOf(service.serviceItemList[i].id) === -1) {
							$scope.selectedItemId.push(service.serviceItemList[i].id);
							$scope.threenum.push(service.serviceItemList[i].englishname);
							$scope.selectedItem.push({
								name: service.name + '-' + service.serviceItemList[i].name,
								price: service.serviceItemList[i].price
							});

						}else{
							$scope.threenum.splice(
							$scope.selectedItemId.indexOf(service.serviceItemList[i].id), 1,service.serviceItemList[i].englishname);
						}
						
					}
					else if ($scope.selectedItemId.indexOf(service.serviceItemList[i].id) != -1) {
						$scope.nowxb=$scope.selectedItemId.indexOf(service.serviceItemList[i].id);
						$scope.selectedItemId.splice(
							$scope.selectedItemId.indexOf(service.serviceItemList[i].id), 1);
						$scope.selectedItem.splice(
							$scope.selectedItemId.indexOf(service.serviceItemList[i].id), 1);
						$scope.threenum.splice(
							$scope.nowxb,1);
					}
				}
			
		}
		if($scope.selectedItemId.length ===0){
			$scope.threenum=[];
		}
		if (!selectFlag) {
			service.img = service.imgurl;
			service.hasItemSelected = false;
		}
		$scope.showMask = false;
		$scope.changenumdiv=false;
		console.log($scope.selectedItemId);
		console.log($scope.threenum);
		// 计算价格
		getConsumerSumPrice();
	};

	//---------
	// $scope.hideconfirmSelectItem = function (service) {
	// 	var selectFlag = false,
	// 	    i, j, tabs;
	// 	$scope.showMask = false;
	// 	$scope.changenumdiv=false;
	// 	console.log($scope.selectedItemId);
	// 	console.log($scope.threenum);
	// 	// 计算价格
	// 	getConsumerSumPrice();
	// };
	// 计算总计金额
	function getConsumerSumPrice() {
		// if (0 === $scope.selectedItemId.length) {
		// 	$scope.price = 0;
		// 	return;
		// }
		var data = {
			designerservicethreeid: $scope.selectedItemId,
			designerservicethreenum: $scope.threenum,
			designerid: $scope.designer.id,
			other: $('.serviceinput-1').val(),
			undiscountother: $('.serviceinput-2').val()
		};
		console.log(data);
		$http.post('/v2/user/getconsumersumprice.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				$scope.price = data.data.price;
				console.log($scope.price);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	}
	$scope.navigate = function (index) {
		var user;
		switch (index) {
			case 1:
				$location.path('home');
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
}]);