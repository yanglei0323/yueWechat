index.controller('stylistCommentCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams',
	function ($scope, $http, $location, $window, $routeParams) {
	
	var designerId = $routeParams.id;

	(function init(){
		// 获取发型师标签
		$http.post('/designer/remark.json', {designerid: designerId}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				$scope.remarkList = data.data.remarklist;
			}
		})
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});

		// 获取发型师评价数量
		$http.post('/designer/commentcount.json', {designerid: designerId}, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				$scope.statistic = data.data;
			}
		})
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});

		getCommentList('all');
	})();

	

	// 获取发型师评论
	function getCommentList(type) {
		$scope.isAll = (type === 'all') ? true : false;
		$scope.isPerfect = (type === 'perfect') ? true : false;
		$scope.isGood = (type === 'good') ? true : false;
		$scope.isBad = (type === 'bad') ? true : false;
		$scope.isPic = (type === 'pic') ? true : false;
		var data = {
			designerid: designerId,
			page: 1,
			type: type
		};
		$http.post('/designer/comment.json', data, postCfg)
		.success(function (data) {
			console.log(data);
			if (1 === data.code) {
				var commentList = data.data.commentlist,
					starUrl1 = '../../assets/images/star_h.png',
	                starUrl2 = '../../assets/images/star.png';
				for (var i = 0; i < commentList.length; i++) {
					commentList[i].starUrl = [];
					commentList[i].imgArr = [];
					commentList[i].user.imgurl = picBasePath + commentList[i].user.imgurl;
					commentList[i].user.vipimgurl = picBasePath + commentList[i].user.vip.smallimgurl;
					for (var j = 0; j < commentList[i].imgurl.length; j++) {
						commentList[i].imgArr.push({path: picBasePath + commentList[i].imgurl[j]});
					}
					for (var k = 0; k < commentList[i].score; k++) {
			            commentList[i].starUrl.push({'path': starUrl1});
			        }
			        for (var l = k; l < 5; l++) {
			            commentList[i].starUrl.push({'path': starUrl2});
			        }
				}
				$scope.commentList = commentList;
				console.log($scope.commentList);
			}
		})
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});
	}

	$scope.getCommentList = getCommentList;

}]);