var transFn = function(data) {
            return $.param(data);
        },
        postCfg = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        },
        picBasePath = 'http://photo.yueyishujia.com:8112';
var index = angular.module('index',
	['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'ngFileUpload', 'infinite-scroll']);
index.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', {
			templateUrl: '../html/home.html',
			controller: 'homeCtrl'
		})
		.when('/stylist', {
			templateUrl: '../html/stylist.html',
			controller: 'stylistCtrl'
		})
		.when('/appointment', {
			templateUrl: '../html/appointment.html',
			controller: 'appointmentCtrl'
		})
		.when('/order', {
			templateUrl: '../html/order.html',
			controller: 'orderCtrl'
		})
		.when('/my', {
			templateUrl: '../html/my.html',
			controller: 'myCtrl'
		})
		.when('/login', {
			templateUrl: '../html/login.html',
			controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: '../html/register.html',
			controller: 'registerCtrl'
		})
		.when('/fast_login', {
			templateUrl: '../html/fast_login.html',
			controller: 'fastLoginCtrl'
		})
		.when('/forget_pwd', {
			templateUrl: '../html/forget_pwd.html',
			controller: 'forgetPwdCtrl'
		})
		.when('/addr_manage', {
			templateUrl: '../html/addr_manage.html',
			controller: 'addrManageCtrl'
		})
		.when('/add_receiver', {
			templateUrl: '../html/add_receiver.html',
			controller: 'addReceiverCtrl'
		})
		.when('/setting', {
			templateUrl: '../html/setting.html',
			controller: 'settingCtrl'
		})
		.when('/address', {
			templateUrl: '../html/address.html',
			controller: 'addressCtrl'
		})
		.when('/cart', {
			templateUrl: '../html/cart.html',
			controller: 'cartCtrl'
		})
		.when('/balance', {
			templateUrl: '../html/balance.html',
			controller: 'balanceCtrl'
		})
		.when('/home_package', {
			templateUrl: '../html/home_package.html',
			controller: 'homePackageCtrl'
		})

		.when('/packageorder', {
			templateUrl: '../html/packageorder.html',
			controller: 'packageorderCtrl'
		})
		.when('/collection', {
			templateUrl: '../html/collection.html',
			controller: 'collectionCtrl'
		})
		.when('/complete_info', {
			templateUrl: '../html/complete_info.html',
			controller: 'completeInfoCtrl'
		})
		.when('/recharge', {
			templateUrl: '../html/recharge.html',
			controller: 'rechargeCtrl'
		})
		.when('/coupon', {
			templateUrl: '../html/coupon.html',
			controller: 'couponCtrl'
		})
		.when('/activity', {
			templateUrl: '../html/activity.html',
			controller: 'activityCtrl'
		})
		.when('/point_mall', {
			templateUrl: '../html/point_mall.html',
			controller: 'pointMallCtrl'
		})
		.when('/point_goods_detail/:id', {
			templateUrl: '../html/point_goods_detail.html',
			controller: 'pointGoodsDetailCtrl'
		})
		.when('/point_order_confirm', {
			templateUrl: '../html/point_order_confirm.html',
			controller: 'pointOrderConfirmCtrl'
		})
		.when('/point_mall_search', {
			templateUrl: '../html/point_mall_search.html',
			controller: 'pointMallSearchCtrl'
		})
		.when('/order_confirm', {
			templateUrl: '../html/order_confirm.html',
			controller: 'orderConfirmCtrl'
		})
		.when('/change_tip', {
			templateUrl: '../html/change_tip.html',
			controller: 'changeTipCtrl'
		})
		.when('/pay_recharge', {
			templateUrl: '../html/pay_recharge.html',
			controller: 'payRechargeCtrl'
		})
		.when('/pay_goods/:order_id', {
			templateUrl: '../html/pay_goods.html',
			controller: 'payGoodsCtrl'
		})
		.when('/mall', {
			templateUrl: '../html/mall.html',
			controller: 'mallCtrl'
		})
		.when('/store', {
			templateUrl: '../html/store.html',
			controller: 'storeCtrl'
		})
		.when('/store_detail/:store_id', {
			templateUrl: '../html/store_detail.html',
			controller: 'storeDetailCtrl'
		})
		.when('/order_detail/:id', {
			templateUrl: '../html/order_detail.html',
			controller: 'orderDetailCtrl'
		})
		.when('/mall_goods_detail/:id', {
			templateUrl: '../html/mall_goods_detail.html',
			controller: 'mallGoodsDetailCtrl'
		})
		.when('/fashion_hairstyle', {
			templateUrl: '../html/fashion_hairstyle.html',
			controller: 'fashionHairStyleCtrl'
		})
		.when('/fashion_information', {
			templateUrl: '../html/fashion_information.html',
			controller: 'fashionInformationCtrl'
		})
		.when('/fashion_hair_info', {
			templateUrl: '../html/fashion_hair_info.html',
			controller: 'fashionHairInfoCtrl'
		})
		.when('/stylist_detail/:id', {
			templateUrl: '../html/stylist_detail.html',
			controller: 'stylistDetailCtrl'
		})
		.when('/stylist_comment/:id', {
			templateUrl: '../html/stylist_comment.html',
			controller: 'stylistCommentCtrl'
		})
		.when('/order_comment/:id', {
			templateUrl: '../html/order_comment.html',
			controller: 'orderCommentCtrl'
		})
		.when('/select_datetime/:designer_id', {
			templateUrl: '../html/select_datetime.html',
			controller: 'selectDatetimeCtrl'
		})
		.when('/appoint_confirm/:id', {
			templateUrl: '../html/appoint_confirm.html',
			controller: 'appointConfirmCtrl'
		})
		.when('/goods_comment/:id', {
			templateUrl: '../html/goods_comment.html',
			controller: 'goodsCommentCtrl'
		})
		.when('/home_search', {
			templateUrl: '../html/home_search.html',
			controller: 'homeSearchCtrl'
		})
		.when('/designer_search', {
			templateUrl: '../html/designer_search.html',
			controller: 'designerSearchCtrl'
		})
		.when('/remark_designer/:order_id', {
			templateUrl: '../html/remark_designer.html',
			controller: 'remarkDesignerCtrl'
		})
		.when('/store_search', {
			templateUrl: '../html/store_search.html',
			controller: 'storeSearchCtrl'
		})
		.when('/mall_search', {
			templateUrl: '../html/mall_search.html',
			controller: 'mallSearchCtrl'
		})
		.when('/edit_info', {
			templateUrl: '../html/edit_info.html',
			controller: 'editInfoCtrl'
		})
		.when('/select_store', {
			templateUrl: '../html/select_store.html',
			controller: 'selectStoreCtrl'
		})
		.when('/select_designer/:store_id', {
			templateUrl: '../html/select_designer.html',
			controller: 'selectDesignerCtrl'
		})
		.when('/select_coupon', {
			templateUrl: '../html/select_coupon.html',
			controller: 'selectCouponCtrl'
		})
		.when('/refund/:id', {
			templateUrl: '../html/refund.html',
			controller: 'refundCtrl'
		})
		.when('/go_pay', {
			templateUrl: '../html/go_pay.html',
			controller: 'goPayCtrl'
		})
		.when('/stylist_work_detail/:id', {
			templateUrl: '../html/stylist_work_detail.html',
			controller: 'stylistWorkDetailCtrl'
		})
		.when('/feedback', {
			templateUrl: '../html/feedback.html',
			controller: 'feedbackCtrl'
		})
		.when('/menu_detail/:id', {
			templateUrl: '../html/menu_detail.html',
			controller: 'menuDetailCtrl'
		})
		.when('/brand_detail/:id', {
			templateUrl: '../html/brand_detail.html',
			controller: 'brandDetailCtrl'
		})
		.when('/flash_sale_list', {
			templateUrl: '../html/flash_sale_list.html',
			controller: 'flashSaleListCtrl'
		})
		.when('/pay_service/:id', {
			templateUrl: '../html/pay_service.html',
			controller: 'payServiceCtrl'
		})
		.when('/about_us', {
			templateUrl: '../html/about_us.html',
		})
		.when('/use_msg', {
			templateUrl: '../html/use_msg.html',
		})
		.when('/stylist_life_pics', {
			templateUrl: '../html/stylist_life_pics.html',
			controller: 'stylistLifePicsCtrl'
		})
		.when('/goods_detail_img', {
			templateUrl: '../html/goods_detail_img.html',
			controller: 'goodsDetailImgCtrl'
		})
		.when('/select_city', {
			templateUrl: '../html/select_city.html',
			controller: 'selectCityCtrl'
		})
		.when('/invite', {
			templateUrl: '../html/invite.html',
			controller: 'inviteCtrl'
		})
		.when('/packagedesigner', {
			templateUrl: '../html/packagedesigner.html',
			controller: 'packagedesignerCtrl'
		})
		.when('/get_invitation', {
			templateUrl: '../html/get_invitation.html',
			controller: 'getInvitationCtrl'
		})
		.when('/coin_mall', {
			templateUrl: '../html/coin_mall.html',
			controller: 'coinMallCtrl'
		})
		.when('/fashion_info', {
			templateUrl: '../html/fashion_info.html',
			controller: 'fashionInfoCtrl'
		})
		.when('/change_record', {
			templateUrl: '../html/change_record.html',
			controller: 'changeRecordCtrl'
		})
		.when('/coin_goods', {
			templateUrl: '../html/coin_goods.html',
			controller: 'coinGoodsCtrl'
		})
		.when('/change_record_detail', {
			templateUrl: 'change_record_detail.html',
			controller: 'changeRecordDetailCtrl'
		})
		.when('/download_page', {
			templateUrl: 'download_page.html',
			controller: 'downloadCtrl'
		})
		.when('/my_balance', {
			templateUrl: 'my_balance.html',
			controller: 'myBalanceCtrl'
		})
		.when('/complete_info_wx', {
			templateUrl: 'complete_info_wx.html',
			controller: 'completeInfoWxCtrl'
		})
		.when('/balance_record', {
			templateUrl: 'balance_record.html',
			controller: 'balanceRecordCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);


// 获取地理位置并设置到localStorage中，通过code进行登录
(function init() {
	var wx_url=window.location.href;
	var wxCode = getUrlParam('code'),
		redirectUrl = getUrlParam('redirect'),
		jobId = getUrlParam('jobid');
	if (!sessionStorage.getItem('login') || sessionStorage.getItem('wxCode') != wxCode) {
		$.ajax({
			url: '/user/wxpublogin.json',
			type: 'POST',
			dataType: 'JSON',
			async:false,
			data: {code: wxCode},
			success: function (resp) {
				console.log(wx_url);
				if (1 === resp.code) {
					sessionStorage.setItem('login', '1');
					sessionStorage.setItem('wxCode', wxCode);
					var user = resp.data;
					sessionStorage.setItem('user', JSON.stringify(user));
					if (user.telephone === '') {
						// 跳转到完善手机信息页面
						window.location.href = 'index.html/complete_info_wx';
					}
					if (redirectUrl){
						sessionStorage.setItem('reload', '1');
						if(jobId){
							window.location.href = '/webapp/build/html/'+redirectUrl+'?jobid='+jobId;
						}else{
							window.location.href = '/webapp/build/html/'+redirectUrl;
						}
					}
				}else{
				}
			},
			error: function (resp) {
				// alert('数据请求失败，请稍后再试！');
				// location.reload();
			}
		});
	}
	
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
    	alert('当前浏览器不支持navigator.geolacation');
    }
})();

function showPosition(position) {
	var positionx =  position.coords.latitude,
	    positiony =  position.coords.longitude;
	localStorage.setItem('positionx', positionx);
	localStorage.setItem('positiony', positiony);
}

// 获取url参数
function getUrlParam(name){  
    //构造一个含有目标参数的正则表达式对象  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    //匹配目标参数  
    var r = window.location.search.substr(1).match(reg);  
    //返回参数值  
    if (r !== null) return unescape(r[2]);  
    return null;  
} 