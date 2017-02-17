index.controller('packageorderCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams', '$q', '$rootScope',
	function ($scope, $http, $location, $window, $routeParams, $q, $rootScope) {
	
	var designerId = $rootScope.designer.id;
	var date = $rootScope.dateIndex;
	var time = $rootScope.timeIndex;
	$scope.serviceTime ='';
	var serviceItems = $rootScope.serviceItems;
	$scope.serviceList = [];
	$scope.boxtextshow=false;
	$scope.fixedtimediv= false;
	if($scope.serviceTime ===''){
		$scope.serviceTime='请选择预约时间';
	}
	// 获取发型师详情
	$scope.designer = $rootScope.designer;
	console.log($scope.designer);
	//获取套餐信息
	$http.post('/v2/home/package/info.json', {'packageid': $rootScope.packageid}, postCfg)
	.then(function (resp) {
		if (1 === resp.data.code) {

			$scope.packageinfo=resp.data.data;
			
		}
	}, function (resp) {
		// alert('数据请求失败，请稍后再试！');
	});

	$scope.confirmOrder = function () {
		var data = {
			designerid: designerId,
			day: $rootScope.dateIndex,
			time: $rootScope.timeIndex,
			packageid: $rootScope.packageid
		};
		var odertm=$('.getodtime').text();
		if(odertm=== ''){
			$scope.boxtextshow=!$scope.boxtextshow;
			return;
		}
		console.log(data);
		$http.post('/v2/designer/package/reserve.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (-1 === data.code) {
				$location.path('login');
			}
			else if (0 === data.code) {
				// 已被预约
				alert(data.reason);
			}
			else if (1 === data.code) {
				// 预约成功，跳转到订单页面
				alert('预约成功');
				$location.path('order').replace();
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	};

	$scope.back = function () {
		$rootScope.dateIndex = 0;
		$rootScope.timeIndex = 0;
		$window.history.back();
	};
	$scope.getordertime =function(){
		$scope.boxtextshow=false;
		$scope.fixedtimediv= true;
	};
	$scope.hidfixedtimediv=function(){
		$scope.fixedtimediv= false;
	};


	//---------------------------------
	//var designerId = $routeParams.designer_id,
	var    reserveTimeArr, workTimeArr;
	$scope.timeArr = [];
	$scope.dateDeferred = $q.defer();
	$scope.appointStatusArr = [];
	$scope.day = 1;
	$scope.time = 0;
	var sepcificTimeArr = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
				    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
				    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
				    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

	// 构造day的取值
	(function init() {
		var date = new Date(),
		    month = date.getMonth() + 1,
		    day = date.getDate(),
		    week = date.getDay(),
		    data = {
		    	designerid: designerId,
		    };
		$scope.timeArr.push({'date': setTime(month, day).date, 'week': setTime(month, day).week, 'index': 1, 'selected': true});
		for (var i = 1; i < 7; i++) {
			$scope.timeArr.push({'date': addDays(i).date, 'week': addDays(i).week, 'index': i + 1});
		}
		// 获取发型师时间表
		$http.post('/v2/designer/reservetime.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				reserveTimeArr = data.data.reservetime;
				workTimeArr = data.data.worktime;
				setStatus(0);
			}
		})
		.error(function (data) {
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	function setStatus(index) {
		var mydate = new Date();
		var myhours=mydate.getHours();
		var mytime=mydate.getMinutes();
		var nowtime=new Date("1111/1/1," + myhours + ":" + mytime + ":0");
		$scope.appointStatusArr = [];
		var statusArr = ['可预约', '已被预约', '休息'];
		var reserveTime = reserveTimeArr[index];
		for (var j = 0; j < reserveTime.length; j++) {
			if (reserveTime.charAt(j) === '0') {
				// 可预约，判断是否工作
				if (workTimeArr[index].charAt(j) == '0') {
					// 可预约
					var ydtime=new Date("1111/1/1," + sepcificTimeArr[j] + ":0");
					var chartime=nowtime.getTime()-ydtime.getTime();
					if($scope.day > 1){
						$scope.appointStatusArr.push({time: sepcificTimeArr[j],
						status: statusArr[0], index: j + 1, useful: true});
					}else{
						if(chartime<=0){
							$scope.appointStatusArr.push({time: sepcificTimeArr[j],
							status: statusArr[0], index: j + 1, useful: true});
						}else{
							// 已被预约
							$scope.appointStatusArr.push({time: sepcificTimeArr[j],
							status: statusArr[1], index: j + 1, useful: false});
						}
					}
				}
				else {
					// 发型师不工作
					$scope.appointStatusArr.push({time: sepcificTimeArr[j],
						status: statusArr[2], index: j + 1, useful: false});
				}
			}
			else {
				// 已被预约
				$scope.appointStatusArr.push({time: sepcificTimeArr[j],
						status: statusArr[1], index: j + 1, useful: false});
			}
		}
	}

	function addDays(days) {
		var date = new Date();
		date = date.valueOf();
		var newDate = date + days * 24 * 60 * 60 * 1000;
		newDate = new Date(newDate);
		var month = newDate.getMonth() + 1;
		var day = newDate.getDate();
		var week = newDate.getDay();
		return setTime(month, day, week);
	}

	function setTime(month, day, week) {
		var time;
		month = month + '.';
		day = day;
		switch (week) {
			case 0:
			    time = '周日';
			    break;
			case 1:
			    time = '周一';
				break;
			case 2:
			    time = '周二';
				break;
			case 3:
			    time = '周三';
				break;
			case 4:
			    time = '周四';
				break;
			case 5:
			    time = '周五';
				break;
			case 6:
			    time = '周六';
				break;
			default:
				time = '今天';
				break;
		}
		return  {
			date: month + day,
			week: time
		};
	}

	$scope.$on('timeFinished', function () {
		$scope.dateDeferred.resolve('succeed');
	});

	// 选择日期
	$scope.selectDate = function (time) {
		$scope.day = time.index;
		$scope.time = 0;
		for (var i = 0; i < 7; i++) {
			if ((i + 1) == time.index) {
				$scope.timeArr[i].selected = !$scope.timeArr[i].selected;
			}
			else {
				$scope.timeArr[i].selected = false;
			}
		}
		setStatus(parseInt(time.index) - 1);
	};

	// 选择时间
	$scope.selectTime = function (status) {
		$scope.time = status.index;
		if (status.status == '休息' || status.status == '已预约') {
			return;
		}
		var highlightdiv=$rootScope.tctimenum/30;
		for (var i = 0; i < 24; i++) {
			if ((i + 1) == status.index) {
				for(var j=0;j<highlightdiv;j++){
					if($scope.appointStatusArr[i+j].useful=== false){
						for(var n=0;n<highlightdiv;n++){
							$scope.appointStatusArr[i+n].selected = false;
						}
						return;
					}
				}
				for(var m=0;m<highlightdiv;m++){
					$scope.appointStatusArr[i+m].selected = true;
				}
				i=i+highlightdiv-1;
			}
			else {
				$scope.appointStatusArr[i].selected = false;
			}
		}
	};

	// 确认选择
	$scope.confirm = function () {
		if (parseInt($scope.time) === 0) {
			alert('请选择预约具体时间！');
			return;
		}
		var serviceTime;
		$rootScope.dateIndex = $scope.day;
		$rootScope.timeIndex = $scope.time;
		for (var i = 0; i < $scope.timeArr.length; i++) {
			if ($scope.timeArr[i].selected) {
				serviceTime = $scope.timeArr[i].date + ' (' + $scope.timeArr[i].week + ') ';
			}
		}
		serviceTime = serviceTime + sepcificTimeArr[$scope.time - 1];
		$rootScope.serviceTime = serviceTime;
		$scope.serviceTime=$rootScope.serviceTime;
		$scope.fixedtimediv= false;
		
	};
}]);
