// 时尚发型
index.factory('Load', ['$http', function ($http) {
	var Load = function () {
		this.items = [];
		this.busy = false;
		this.loading = false;
		this.loaded = false;
		this.page = 1;
	};

	Load.prototype.nextPage = function () {
		if (this.busy) {
			return;
		}
		this.busy = true;
		this.loading = true;
		var url = '/home/fashionhair.json';
		$http.post(url, {page: this.page}, postCfg)
		.success(function (data) {
			if (1 === data.code) {
				var fashionHairList = data.data.fashionhairlist;
				if (fashionHairList.length === 0) {
					this.busy = true;
					this.loaded = true;
					this.loading = false;
					return;
				}
				for (var i = 0, j = fashionHairList.length; i < j; i++) {
					fashionHairList[i].imgurl = picBasePath + fashionHairList[i].imgurl;
					this.items.push(fashionHairList[i]);
				}
				this.busy = false;
				this.loading = false;
				this.page += 1;
			}
		}.bind(this))
		.error(function (data) {
			console.log(data);
			// alert('数据请求失败，请稍后再试！');
		});

	};
	return Load;
}]);