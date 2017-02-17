index.controller('goodsCommentCtrl',
	['$scope', '$http', '$location', '$window', '$routeParams',
	function ($scope, $http, $location, $window, $routeParams) {
	
	var goodsId = $routeParams.id;

	// 获取商品评论信息
	function getCommentList(type) {
		$scope.isAll = (type === 'all') ? true : false;
		$scope.isGood = (type === 'good') ? true : false;
		$scope.isMiddle = (type === 'middle') ? true : false;
		$scope.isBad = (type === 'bad') ? true : false;
		$scope.isImg = (type === 'img') ? true : false;
		var data = {
			id: goodsId,
			type: type
		};
		$http.post('/shop/getallgoodscomment.json', data, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				var commentList = data.data.goodscommentlist,
					starUrl1 = '../../assets/images/star_h.png',
	                starUrl2 = '../../assets/images/star.png';
				for (var i = 0; i < commentList.length; i++) {
					commentList[i].starUrl = [];
					commentList[i].imgArr = [];
					commentList[i].user.imgurl = picBasePath + commentList[i].user.imgurl;
					commentList[i].user.vipimgurl = picBasePath + commentList[i].user.vipimgurl;
					for (var j = 0; j < commentList[i].imgurllist.length; j++) {
						commentList[i].imgArr.push({path: picBasePath + commentList[i].imgurllist[j]});
					}
					for (var k = 0; k < commentList[i].star; k++) {
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
		});
	}

	$scope.getCommentList = getCommentList;

	(function init() {
		// 获取商品评论统计信息
		$http.post('/shop/getallgoodscommentofstatistic.json', {id: goodsId}, postCfg)
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
}]);