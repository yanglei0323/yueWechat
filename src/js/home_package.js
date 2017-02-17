index.controller('homePackageCtrl',
	['$scope', '$http', '$location', '$rootScope', '$routeParams', '$q', 'Load', '$window',
	function ($scope, $http, $location, $rootScope, $routeParams, $q, Load, $window) {
	$scope.deferred = $q.defer();
	var packageid;
	packageid=$location.search().packageid;
	$scope.boxtextshow=false;
	$scope.ssmdpic=false;
	$rootScope.packageid = packageid;
	//获取套餐信息
	$http.post('/v2/home/package/info.json', {'packageid': packageid}, postCfg)
	.then(function (resp) {
		console.log(resp);
		if (1 === resp.data.code) {

			// 首页轮播图
			var imgurlList = resp.data.data.imgurlList;
			for (var i = 0; i < imgurlList.length; i++) {
				imgurlList[i].imgurl = picBasePath + imgurlList[i].imgurl;
			}
			$scope.adList = imgurlList;
			$scope.packageinfo=resp.data.data;
			$scope.serviceinfo=$scope.packageinfo.info.split("\n");
			$rootScope.tctimenum = $scope.packageinfo.length;
			if($scope.packageinfo.detailimgurl === ''){
				$scope.ssmdpic=false;
			}else{
				$scope.ssmdpic=true;
			}

			
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});
	//获取支持套餐的发型师
	$http.post('/v2/home/package/designer.json', {'packageid': $rootScope.packageid}, postCfg)
	.then(function (resp) {
		console.log(resp);
		if (1 === resp.data.code) {

			$scope.designerList=resp.data.data.designerlist;
			$scope.designercount=resp.data.data.count;
			for(var i=0;i<$scope.designerList.length;i++){
				$scope.designerList[i].selected=false;
				$scope.designerList[i].avatar = picBasePath + $scope.designerList[i].avatar;
			}

			
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});
	//选择发型师
	$scope.selectperson = function (person) {
		var i;
		
		if(person.selected===false){
			for(i=0;i<$scope.designerList.length;i++){
				$scope.designerList[i].selected=false;
				$rootScope.designer='';
			}
			person.selected=true;
			$rootScope.designer=person;
		}else if(person.selected===true){
			for(i=0;i<$scope.designerList.length;i++){
				$scope.designerList[i].selected=false;
			}
			person.selected=false;
			$rootScope.designer='';
		}
	};
	//------------------轮播图---------------------------------
    $scope.$on('ngRepeatFinished', function () {
		$scope.deferred.resolve('succeed');
	});
    // 轮播图是否加载完毕的promise
	$scope.deferred = $q.defer();
	//---------------------
	$scope.flashSaleDeferred = $q.defer();
    $scope.$on('flashSaleRepeatFinished', function () {
        $scope.flashSaleDeferred.resolve('succeed');
    });

    $scope.packagedesignerlist=function(){
    	$location.path('packagedesigner');
    };
    $scope.toDesignerDetail = function () {
		$window.history.go(-1);
	};
	//显示隐藏提示文字
	$scope.hidtstext = function(){
		$scope.boxtextshow=false;
	};
	//确认该套餐
    $scope.truepackage = function () {
    	if($rootScope.designer === ''||$rootScope.designer=== undefined){
    		$scope.boxtextshow=true;
    		$location.path('packagedesigner');
    		return;
    	}
    	$location.path('packageorder');
		
	};
	
}]);