index.controller('stylistCtrl',
	['$scope', '$http', '$window', '$rootScope', '$location', function ($scope, $http, $window, $rootScope, $location) {

	var isGetStoreInfo = false;
	var isGetActivity = false;
	var jobid;
	jobid=$location.search().jobid;
	$rootScope.jobid = jobid;
	$scope.vh = [];
	$scope.nu = [];
	$scope.designerList = [];
	$scope.labelid = [];
	$scope.skillid = [];
	$scope.callid = [];
	$scope.drinkid = [];
	$scope.page = 1;
	$scope.sexed = '';
	$scope.priceid = '';
	$scope.isSelfFilter = false;
	$scope.labeltangch = false;
	$scope.isList = false;
	$scope.nowweight = false;
	$scope.showMask1=false;
	$scope.baseinfoflag = '';
	$scope.selectAllArea = true;
	$scope.sortType = '综合排序';
	$scope.filterDefault = true;
	$scope.selectStoreName = '体验店';
	$scope.selfFilterName = '筛选';
	$scope.labelpopupdiv = false;
	$scope.jfshow = false;
	$rootScope.desingopay = 0;
	$scope.newactiveIndex='';
	$scope.drinkshow=true;
	$scope.callshow=true;
	
	//悬浮窗
	$http.post('/v2/designer/reserve/popup.json', {'jobid': jobid}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {
			$('.fixeddesigninfo').css('display','block');
			$scope.designerinfo = resp.data.data.designer;
			$scope.dewaitinfo = resp.data.data;
		}
	}, function (resp) {
	});
	$scope.hideMask = function () {
		$scope.showMask1 = false;
		// window.onscroll=function(){
		// 	document.body.scrollTop = document.body.scrollTop;//赋值给滚动条的位置
		// };
	};
	$scope.forbidHide = function (e) {
		e.stopPropagation();
	};

	// 获取发型师列表
	function getDesignerInfo () {
		var data;
		if(jobid == '1'){
			$('.titletext').html('发型师');
			$scope.jfshow = true;
			$scope.labeltangch = true;
		}else if(jobid == '2'){
			$('.titletext').html('美甲师');
		}else if(jobid == '3'){
			$('.titletext').html('美妆师');
		}else if(jobid == '4'){
			$('.titletext').html('美搭师');
		}
		if ($scope.loading) {
			return;
		}
		$scope.loading = true;
		if (!$scope.isSelfFilter) {
			data = {
				jobid:jobid,
				cityid:1,
				page: $scope.page,
				sort: $scope.sort,
				positionx: localStorage.getItem('positionx'),
				positiony: localStorage.getItem('positiony'),
				storeid: $scope.storeId,
				areaid: $scope.areaId,
				pricerangeid:$scope.priceid,
				sexed:$scope.sexed,
				labelid:'',
				skillid:''
			};
			console.log(data);
			$http.post('/v2/designer/list.json', data, postCfg)
			.then(function (resp) {
				if (1 === resp.data.code) {
					console.log(resp);
					var starUrl1 = '../../assets/images/star_h.png',
			            starUrl2 = '../../assets/images/star.png';
					var designerList = resp.data.data.designerlist;
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
				}
			}, function (resp) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		else {
			data = {
				page: $scope.page,
				storetype: $scope.storeType,
				vh: $scope.vh,
				nu: $scope.nu
			};
			$http.post('/designer/searchbystoreandactivity.json', data, postCfg)
			.success(function (data) {
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
				
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
	}

	$scope.getDesignerInfo = getDesignerInfo;
	


	// 显示方式切换
	$scope.switch = function () {
		$scope.isList = !$scope.isList;
	};
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

	$scope.hairinfo = function(e){
		$location.path('fashion_hair_info');
	};
	$scope.toDetail = function (designer) {
		$location.path('stylist_detail/' + designer.id);
	};

	// 进入发型师搜索界面
	$scope.searchDesigner = function () {
		$location.path('designer_search');
	};

	// 获取门店列表信息用作筛选
	$scope.getStoreInfo = function () {
		$scope.showStore = !$scope.showStore;
		$scope.showMask = $scope.showStore ? true : false;
		$scope.filterShow = false;
		$scope.isShowSort = false;
		$scope.showLabel = false;
		if (!isGetStoreInfo) {
			$http.post('/v2/store/all.json', {'cityid': 1}, postCfg)
			.success(function (data) {
				if (1 === data.code) {
					var areaList = data.data.storelist;
					$scope.areaList = areaList;
					isGetStoreInfo = true;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
		}
		
	};

	// 选择区域
	$scope.selectCity = function (area, e) {
		e.stopPropagation();
		var i = 0,j = 0;
		if (area === 'all') {
			$scope.selectStoreName = '全部';
			$scope.showStore = false;
			$scope.showMask = false;
			if (!$scope.selectAllArea) {
				$scope.selectAllArea = true;
				$scope.areaId = 0;
				for (i = 0; i < $scope.areaList.length; i++) {
					$scope.areaList[i].selected = false;
				}
				$scope.designerList = [];
				$scope.page = 1;
				$scope.loading = false;
				$scope.loaded = false;
				$scope.areaId = 0;
				$scope.storeId = 0;
				getDesignerInfo();
				
			}
		}
		else {
			$scope.selectAllArea = false;
			var index = $scope.areaList.indexOf(area);
			if (index !== -1 && $scope.areaList[index].citySelected !== true) {
				for (i = 0; i < $scope.areaList.length; i++) {
					$scope.areaList[i].citySelected = false;
				}
				$scope.areaList[index].citySelected = true;
			}
		}
	};

	// 选择门店,当flag为true时为选择全部
	$scope.selectStore = function (store, e, flag) {
		var i = 0, j = 0;
		e.stopPropagation();
		$scope.selectAllArea = false;
		$scope.isSelfFilter = false;
		if (store === 'all') {
			$scope.selectStoreName = '全部';
			$scope.selectAll = true;
			for (i = 0; i < $scope.areaList.length; i++) {
				for (j = 0; j < $scope.areaList.length; j++) {
					$scope.areaList[i].selected = false;
				}
			}
			$scope.storeId = '';
			$scope.designerList = [];
			$scope.page = 1;
			$scope.loading = false;
			$scope.loaded = false;
			getDesignerInfo();
			$scope.showStore = false;
			$scope.showMask = false;
			return;
		}
		else if (!store.selected) {
			for (i = 0; i < $scope.areaList.length; i++) {
				$scope.selectAll = false;
				for (j = 0; j < $scope.areaList.length; j++) {
					$scope.areaList[i].selected = false;
				}
			}
			store.selected = true;
			$scope.storeId = store.id;
		}
		$scope.selectStoreName = store.name;
		$scope.designerList = [];
		$scope.page = 1;
		$scope.loading = false;
		$scope.loaded = false;
		getDesignerInfo();
		$scope.showStore = false;
		$scope.showMask = false;
	};

	// 显示自助筛选的条目
	$scope.showFilterItems = function () {
		$scope.filterShow = !$scope.filterShow;
		$scope.showMask = $scope.filterShow ? true : false;
		$scope.showStore = false;
		$scope.isShowSort = false;
		$scope.showLabel = false;
	};

	// 排序
	$scope.filter = function (type, e, typeName) {
		e.stopPropagation();
		$scope.isSelfFilter = false;
		$scope.filterShow = false;
		$scope.showMask = false;
		$scope.filterMostReserve = (type === 'mostordernum') ? true : false;
		$scope.filterHighestScore = (type === 'mostcommentnum') ? true : false;
		$scope.filterNearest = (type === 'nearest') ? true : false;
		$scope.sortType = typeName;
		if ($scope.sort !== type) {
			$scope.designerList = [];
			$scope.page = 1;
			$scope.loading = false;
			$scope.loaded = false;
			$scope.sort = type;
			getDesignerInfo();
		}
	};

	$scope.showSort = function () {
		$scope.isShowSort = !$scope.isShowSort;
		$scope.showMask = $scope.isShowSort ? true : false;
		$scope.filterShow = false;
		$scope.showStore = false;
		// 获取优惠活动和新用户专享数据
		if (!isGetActivity) {
			// 获取优惠活动
			$http.post('/designer/getactivityofyouhui.json', postCfg)
			.success(function (data) {
				if (1 === data.code) {
					$scope.couponActivity = data.data.activitylist;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
			// 获取新用户活动
			$http.post('/designer/getactivityofnewuser.json', postCfg)
			.success(function (data) {
				if (1 === data.code) {
					$scope.newUserActivity = data.data.activitylist;
				}
			})
			.error(function (data) {
				// alert('数据请求失败，请稍后再试！');
			});
			isGetActivity = true;
		}
	};

	// 自主排序中选择店铺类型
	$scope.selectStoreType = function (type) {
		$scope.storeType = type;
		$scope.isDirectSale = type === 1 ? true : false;
		$scope.isCooperate = type === 2 ? true : false;
		$scope.isSelfFilter =  true;
		$scope.page = 1;
		$scope.designerList = [];
		$scope.loading = false;
		$scope.loaded = false;
		getDesignerInfo();
	};

	// 自主筛选中选择优惠活动
	$scope.selectCouponActivity = function (activity) {
		activity.selected = !activity.selected;
		if (activity.selected) {
			$scope.vh.push(activity.id);
		}
		else {
			var index = $scope.vh.indexOf(activity.id);
			$scope.vh.splice(index, 1);
		}
		$scope.isSelfFilter =  true;
		$scope.page = 1;
		$scope.designerList = [];
		$scope.loading = false;
		$scope.loaded = false;
		getDesignerInfo();
	};

	// 自主筛选中选择新用户活动
	$scope.selectNewUserActivity = function (activity) {
		activity.selected = !activity.selected;
		if (activity.selected) {
			$scope.nu.push(activity.id);
		}
		else {
			var index = $scope.nu.indexOf(activity.id);
			$scope.nu.splice(index, 1);
		}
		$scope.isSelfFilter =  true;
		$scope.page = 1;
		$scope.designerList = [];
		$scope.loading = false;
		$scope.loaded = false;
		getDesignerInfo();
	};

	// 自主筛选结束，点击确定
	$scope.selfFilter = function () {
		$scope.isShowSort = false;
		$scope.showMask = false;
	};

	$scope.showPrice = function (e) {
		if(jobid == '1'){
			$scope.baseinfoflag='15';
		}else if(jobid == '2'){
			$scope.baseinfoflag='16';
		}else if(jobid == '3'){
			$scope.baseinfoflag='17';
		}else if(jobid == '4'){
			$scope.baseinfoflag='18';
		}
		$http.post('/v2/home/baseinfo.json', {'flag': $scope.baseinfoflag}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				$scope.pricepage=data.data;
				// 显示价目表
				e.stopPropagation();
				$scope.showMask1 = true;
				// var scrollTop = document.body.scrollTop;//保存点击前滚动条的位置
				// window.onscroll=function(){
				// 	document.body.scrollTop = scrollTop;//赋值给滚动条的位置
				// };
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};
	$scope.toNewDetail = function (designer) {
		$location.path('stylist_detail/' + designer.id);
	};
	$scope.tohiddenDetail=function(){
		$('.fixeddesigninfo').css('display','none');
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
	var mySwiper = new Swiper('.swiper-container',{
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
	// 获取标签信息用作筛选
	$scope.showLabel=false;
	$scope.fancylabel = function () {
		$scope.showLabel = !$scope.showLabel;
		$scope.showMask = $scope.showLabel ? true : false;
		$scope.filterShow = false;
		$scope.showStore = false;
		$scope.sexList=[];	
		$scope.priceList=[];	
		$scope.labelList=[];	
		$scope.skillList=[];	
		//获取筛选标签信息
		 $http.post('/v2/designer/search/content.json', postCfg)
			.success(function (data) {
				console.log(data);
		 		if (1 === data.code) {
		 			$http.post('/user/mine.json', postCfg)
					.success(function (resp) {
						if (-1 === resp.code) {
							$scope.priceList = data.data.pricelist;
				 			$scope.sexList = data.data.sexlist;
				 			$scope.labelList = data.data.labellist;
							$scope.skillList = data.data.skilllist;
						}
						else if (1 === resp.code) {
							$scope.priceList = data.data.pricelist;
				 			$scope.sexList = data.data.sexlist;
				 			$scope.labelList = data.data.labellist;
							$scope.skillList = data.data.skilllist;
						}
					})
					.error(function (resp) {
					});
		 			
		 		}
		 	})
		 	.error(function (data) {
		 		// alert('数据请求失败，请稍后再试！');
		 	});
		
	};
	// 选择剪发价格标签
	$scope.selectprice = function (pric, e, flag) {
		var i = 0;
		e.stopPropagation();
		for (i = 0; i < $scope.priceList.length; i++) {
			$scope.priceList[i].selected = false;
		}
		pric.selected = true;
		$scope.priceid=pric.id;
	};
	// 选择性别标签
	$scope.selectsex = function (sex, e, flag) {
		var i = 0;
		e.stopPropagation();
		for (i = 0; i < $scope.sexList.length; i++) {
			$scope.sexList[i].selected = false;
		}
		sex.selected = true;
		$scope.sexed=sex.id;
	};
	// 选择饮品喜好标签
	$scope.selectdrink = function (drink, e, flag) {
		var i = 0;
		e.stopPropagation();
		if(drink.selected === true){
			drink.selected = false;
		}else if(drink.selected === false){
			drink.selected = true;
		}
	};
	// 选择称呼标签
	$scope.selectcall = function (call, e, flag) {
		var i = 0;
		e.stopPropagation();
		if(call.selected === true){
			call.selected = false;
		}else if(call.selected === false){
			call.selected = true;
		}
	};
	// 选择发型师标签
	$scope.selectfclabel = function (fclabel, e, flag) {
		var i = 0;
		e.stopPropagation();
		if(fclabel.selected === true){
			fclabel.selected = false;
		}else if(fclabel.selected === false){
			fclabel.selected = true;
		}
		// var serviceList = [];
		// for (var i = 0; i < $scope.serviceList.length; i++) {
		// 	if ($scope.serviceList[i].selected) {
		// 		serviceList.push($scope.serviceList[i].id);
		// 	}
		// }
	};
	// 选择发型师擅长项目标签
	$scope.selectskill = function (skill, e, flag) {
		var i = 0;
		e.stopPropagation();
		if(skill.selected === true){
			skill.selected = false;
		}else if(skill.selected === false){
			skill.selected = true;
		}
	};
	//标签重置按钮
	$scope.resetlabel = function(){
		var i=0 , j=0 , m=0 , n=0;
		for (i = 0; i < $scope.labelList.length; i++) {
			$scope.labelList[i].selected = false;
			$scope.labelid=[];
		}
		for (j = 0; j < $scope.priceList.length; j++) {
			$scope.priceList[j].selected = false;
			$scope.priceid='';
		}
		for (m = 0; m < $scope.sexList.length; m++) {
			$scope.sexList[m].selected = false;
			$scope.sexed='';
		}
		for (n = 0; n < $scope.skillList.length; n++) {
			$scope.skillList[n].selected = false;
			$scope.skillid=[];
		}
	};
	//标签确认提交选项
	$scope.filtermaktrue = function(){
		var i=0 , j=0 ;
		for (i = 0; i < $scope.priceList.length; i++) {
			if ($scope.priceList[i].selected) {
				$scope.priceid=$scope.priceList[i].id;
			}
		}
		for (i = 0; i < $scope.sexList.length; i++) {
			if ($scope.sexList[i].selected) {
				$scope.sexed=$scope.sexList[i].id;
			}
		}
		for (i = 0; i < $scope.labelList.length; i++) {
			if ($scope.labelList[i].selected) {
				$scope.labelid.push($scope.labelList[i].id);
			}
		}
		for (j = 0; j < $scope.skillList.length; j++) {
			if ($scope.skillList[j].selected) {
				$scope.skillid.push($scope.skillList[j].id);
			}
		}
		 data = {
		 	priceid:$scope.priceid,
		 	sexid:$scope.sexed,
		 	labelids:$scope.labelid,
		 	skillids:$scope.skillid
		 };
		 $http.post('/v2/designer/label/searchsave.json',data, postCfg)
		 .success(function (data) {
		 	if (1 === data.code) {
				$scope.showLabel = !$scope.showLabel;
				$scope.showMask = false;
				$scope.designerList = [];
				$scope.page = 1;
				$scope.loading = false;
				$scope.loaded = false;
				getDesignerInfo();
		 	}else if( 0=== data.code){
		 		alert('请至少选择一个发型师标签');
		 		$scope.showLabel = !$scope.showLabel;
				$scope.showMask = false;
				$scope.designerList = [];
				$scope.page = 1;
				$scope.loading = false;
				$scope.loaded = false;
				getDesignerInfo();
		 	}else if( -1=== data.code){
		 		alert('请登陆后再保存筛选标签');
		 		$location.path('login');
		 	}
		 })
		 .error(function (data) {
		 	// alert('数据请求失败，请稍后再试！');
		 });
	};
	
	//获取可保存标签信息
	$http.post('/v2/designer/search/content.json', postCfg)
		.then(function (data) {
		}, function (resp) {
		});
	$http.post('/v2/designer/popupcontent.json', postCfg)
		.then(function (data) {
			console.log(data);
			if (1 === data.data.code) {
				var labelList = data.data.data.labellist;
				var skillList = data.data.data.skilllist;
				var priceList = data.data.data.pricelist;
				var sexList = data.data.data.sexlist;
				var callList = data.data.data.calllist;
				var drinkList = data.data.data.drinklist;
				$scope.priceList = priceList;
				$scope.sexList = sexList;
				$scope.labelList = labelList;
				$scope.skillList = skillList;
				$scope.callList = callList;
				$scope.drinkList = drinkList;
				if($scope.callList.length <= 0){
					$scope.callshow=false;
				}if($scope.drinkList.length <= 0){
					$scope.drinkshow=false;
				}
			}
		}, function (resp) {
		});
	//是否弹出弹窗
	$http.post('/user/mine.json', postCfg)
	.success(function (resp) {
		if (-1 === resp.code) {
			return;
		}
		else if (1 === resp.code) {
			$http.post('/v2/designer/verifypopup.json', postCfg)
			.then(function (resp) {
				if (true === resp.data.data.flag) {
					if($scope.labeltangch){
						$scope.labelpopupdiv = !$scope.labelpopupdiv;
					}
					
				}
			}, function (resp) {
			});
		}
	})
	.error(function (resp) {
	});
	
	//标签弹窗点击先逛逛选项
	$scope.hidlabelpopupdiv = function(){
		$scope.labelpopupdiv = !$scope.labelpopupdiv;
	};
	//保存标签
	//标签确认提交选项
	$scope.maktrue = function(){
		var i=0 , j=0 ,m=0 ,n=0;
		for (i = 0; i < $scope.labelList.length; i++) {
			if ($scope.labelList[i].selected) {
				$scope.labelid.push($scope.labelList[i].id);
			}
		}
		for (j = 0; j < $scope.skillList.length; j++) {
			if ($scope.skillList[j].selected) {
				$scope.skillid.push($scope.skillList[j].id);
			}
		}
		for (m = 0; m < $scope.callList.length; m++) {
			if ($scope.callList[m].selected) {
				$scope.callid.push($scope.callList[m].id);
			}
		}
		for (n = 0; n < $scope.drinkList.length; n++) {
			if ($scope.drinkList[n].selected) {
				$scope.drinkid.push($scope.drinkList[n].id);
			}
		}
		 data = {
		 	priceid:$scope.priceid,
		 	sexid:$scope.sexed,
		 	labelids:$scope.labelid,
		 	skillids:$scope.skillid,
		 	drinkids:$scope.drinkid,
		 	callids:$scope.callid
		 };
		 $http.post('/v2/designer/label/save.json',data, postCfg)
		 .success(function (data) {
		 	if (1 === data.code) {
				$scope.labelpopupdiv = !$scope.labelpopupdiv;
				$scope.showMask = false;
				$scope.designerList = [];
				$scope.page = 1;
				$scope.loading = false;
				$scope.loaded = false;
				getDesignerInfo();
		 	}else if( 0=== data.code){
		 		alert('请至少选择一个发型师标签');
		 	}
		 })
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};
}]);