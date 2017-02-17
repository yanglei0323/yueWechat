index.controller('feedbackCtrl',
    ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {
    

    // 监听值的变化并改变提交按钮的样式
    $scope.$watch('feedback', function (newValue, oldValue, scope) {
        // 去除前后空格
        if ('undefined' === typeof(newValue) ||
            '' === newValue.replace(/(^\s*)|(\s*$)/g, '')) {
            $scope.isFeedbackEmpty = true;
        }
        else {
            $scope.isFeedbackEmpty = false;
        }
    });

    
    $scope.submitFeedback = function () {
        var feedbackText = $scope.feedback.replace(/(^\s*)|(\s*$)/g, ''),
            data = {
                content: feedbackText
            };
        var feedbackPromise = $http.post('/user/feedback.json', data, postCfg);
        console.log(feedbackText);
        feedbackPromise.then(function (resp) {
            if (-1 === resp.data.code) {
                $location.path('login');
                return;
            }
            if (1 === resp.data.code) {
                alert('提交成功');
                $window.history.back();
            }
        }, function (resp) {
            // alert('数据请求失败，请稍后再试！');
        });
    };
}]);