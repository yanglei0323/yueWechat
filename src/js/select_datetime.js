index.controller('selectDatetimeCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams', '$q', '$rootScope',
	function ($scope, $http, $location, $window, $routeParams, $q, $rootScope) {
	
	var designerId = $routeParams.designer_id,
	    reserveTimeArr, workTimeArr;
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
			console.log(data);
			if (1 === data.code) {
				reserveTimeArr = data.data.reservetime;
				workTimeArr = data.data.worktime;
				setStatus(0);
			}
		})
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});
	})();

	function setStatus(index) {
		$scope.appointStatusArr = [];
		var statusArr = ['未预约', '已预约', '休息'];
		var reserveTime = reserveTimeArr[index];
		for (var j = 0; j < reserveTime.length; j++) {
			if (reserveTime.charAt(j) === '0') {
				// 可预约，判断是否工作
				if (workTimeArr[index].charAt(j) == '0') {
					// 可预约
					$scope.appointStatusArr.push({time: sepcificTimeArr[j],
						status: statusArr[0], index: j + 1, useful: true});
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
		console.log($scope.appointStatusArr);
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
		month = month < 10 ? '0' + month + '月': month + '月';
		day = day < 10 ? '0' + day + '日' : day + '日';
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
		for (var i = 0; i < 24; i++) {
			if ((i + 1) == status.index) {
				$scope.appointStatusArr[i].selected = !$scope.appointStatusArr[i].selected;
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
		console.log($scope.timeArr);
		for (var i = 0; i < $scope.timeArr.length; i++) {
			if ($scope.timeArr[i].selected) {
				serviceTime = $scope.timeArr[i].date + ' (' + $scope.timeArr[i].week + ') ';
			}
		}
		serviceTime = serviceTime + sepcificTimeArr[$scope.time - 1];
		$rootScope.serviceTime = serviceTime;
		$location.path('appoint_confirm/' + designerId);
		
	};

}]);