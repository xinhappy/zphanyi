//工厂
routeApp.factory('myService', ['$window', function ($window) {
    return {
        //存储单个属性
        set: function (key, value) {
            $window.sessionStorage[key] = value;
        },
        //读取单个属性
        get: function (key, defaultValue) {
            return $window.sessionStorage[key] || defaultValue;
        },
        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            $window.sessionStorage[key] = JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
            return JSON.parse($window.sessionStorage[key] || '{}');
        }

    }
}]);

//轮播指令
routeApp.directive('onFinishRenderFilters', function ($timeout, $rootScope, $http) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                    //更改第一个轮播图链接为网址
                    // $('.mainFirstA').first().removeAttr('ui-sref')
                    // $('.mainFirstA').first().attr('href', '')
                    // $('.mainFirstA').first().click(function () {
                    //     window.location.href = 'http://www.thejamy.com/product/UUKN01138100'
                    // })
                    $('.mainFirstA').last().removeAttr('ui-sref')
                    $('.mainFirstA').last().attr('href', '')
                    $('.mainFirstA').last().click(function () {
                        window.location.href = '#/home'
                    })
                    //加载页面轮播
                    var mainSwiper = new Swiper('.mainSwiper-container', {
                        pagination: '.mainSwiper-pagination',
                        paginationClickable: true
                    })
                    //home主页轮播
                    var homeSwiper = new Swiper('.homeSwiper', {
                        pagination: '.home-pagination',
                        paginationClickable: true,
                        loop: true,
                        autoplay: 3000,
                        onSlideChangeStart: function (swiper) {
                            // console.log(swiper.activeIndex)
                        }
                    })
                    //home主页轮播下层轮播
                    var lbtDetailSwiper = new Swiper('.lbtDetailSwiper-container', {
                        pagination: '.lbtDetailSwiper-pagination',
                        paginationClickable: true,
                        watchActiveIndex: true,
                        loop: true,
                        autoplay: 5000,
                        onSlideChangeStart: function (swiper) {
                            // console.log(swiper.realIndex)
                            //content
                            $('.lbtTitle').eq(swiper.realIndex).css('display', 'block')
                            $('.lbtTitle').not($('.lbtTitle').eq(swiper.realIndex)).css('display', 'none')
                            $('.lbtText').eq(swiper.realIndex).css('display', 'block')
                            $('.lbtText').not($('.lbtText').eq(swiper.realIndex)).css('display', 'none')
                            //index img
                            $('.bottom_index').eq(swiper.realIndex).css('display', 'block')
                            $('.bottom_index').not($('.bottom_index').eq(swiper.realIndex)).css('display', 'none')
                        }
                    })
                })
            }
        }
    };
});
// 下拉列表指令
routeApp.directive('onFinishCaselist', function ($timeout, $rootScope, $http, myService, $cookies) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$emit('caselistFinished');
                //侧滑显示删除按钮
                var expansion = null; //是否存在展开的list
                var container = document.querySelectorAll('.list li a');
                for (var i = 0; i < container.length; i++) {
                    var x, y, X, Y, swipeX, swipeY;
                    container[i].addEventListener('touchstart', function (event) {
                        x = event.changedTouches[0].pageX;
                        y = event.changedTouches[0].pageY;
                        swipeX = true;
                        swipeY = true;
                        // if (expansion) {   //判断是否展开，如果展开则收起
                        //     expansion.className = "";
                        // }
                    });
                    container[i].addEventListener('touchmove', function (event) {

                        X = event.changedTouches[0].pageX;
                        Y = event.changedTouches[0].pageY;
                        // 左右滑动
                        if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                            // 阻止事件冒泡
                            event.stopPropagation();
                            if (X - x > 10) {   //右滑
                                event.preventDefault();
                                this.className = "";    //右滑收起
                            }
                            if (x - X > 10) {   //左滑
                                event.preventDefault();
                                this.className = "swipeleft";   //左滑展开
                                expansion = this;
                            }
                            swipeY = false;
                        }
                        // 上下滑动
                        if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                            swipeX = false;
                        }
                    });
                }

                //套餐服务轮播图
                var setMealSwiper = new Swiper('.setMealSwiper-container', {
                    pagination: '.setMealSwiper-pagination',
                    paginationType: 'fraction',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 60,
                    onImagesReady: function (swiper) {
                        /*
                        console.log(swiper.realIndex)
                        console.log($rootScope.taocanRows)
                        var userData = $cookies.getObject('userData')
                        console.log(userData)
                        function addCart() {
                            if ((typeof (userData.id)) == 'undefined' || userData == '') {
                                $('.detailSubmit').click(function () {
                                    location.href = '#/login'
                                })
                            } else {
                                $('.detailSubmit').hDialog({
                                    box: '#cartSelect',
                                    width: 230,
                                    height: 200,
                                    modalHide: false,
                                    isOverlay: false
                                })
                                var manPrice = $rootScope.taocanRows[swiper.realIndex].manDiscountPrice
                                var nvweiPrice = $rootScope.taocanRows[swiper.realIndex].womanDiscountPriceNot
                                var nvyiPrice = $rootScope.taocanRows[swiper.realIndex].womanDiscountPriceYet
                                $('.manPriceDiv').attr('goodsPrice', manPrice)
                                $('.manPriceSpan').text(manPrice)

                                $('.nvweiPriceDiv').attr('goodsPrice', nvweiPrice)
                                $('.nvweiPriceSpan').text(nvweiPrice)

                                $('.nvyiPriceDiv').attr('goodsPrice', nvyiPrice)
                                $('.nvyiPriceSpan').text(nvyiPrice)
                                $('#cartSelect div').click(function () {
                                    console.log(swiper.realIndex)
                                    var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                                    var cardType = $(this).attr('cardType')
                                    var nickName = userData.nickname
                                    var userId = userData.id
                                    var goodsId = $rootScope.taocanRows[swiper.realIndex].goodsId
                                    var goodsName = $rootScope.taocanRows[swiper.realIndex].goodsName
                                    var supplierId = $rootScope.taocanRows[swiper.realIndex].supplierId
                                    var supplierName = $rootScope.taocanRows[swiper.realIndex].supplierName
                                    console.log(goodsId)
                                    console.log(userId)
                                    console.log(cardType)
                                    console.log($rootScope.taocanRows[swiper.realIndex])
                                    var lifedata = {
                                        "nickName": nickName,
                                        "goodsId": goodsId,
                                        "goodsName": goodsName,
                                        "goodsPrice": goodsPrice,
                                        "goodsType": '1',
                                        "supplierId": supplierId,
                                        "supplierName": supplierName,
                                        "cardType": cardType,
                                        "userId": userId
                                    }
                                    console.log(lifedata)
                                    // $.ajax({
                                    //     url: ip + '/appShop/addGoodsToCar.htm',
                                    //     type: 'POST',
                                    //     data: {
                                    //         "nickName": nickName,
                                    //         "goodsId": goodsId,
                                    //         "goodsName": goodsName,
                                    //         "goodsPrice": goodsPrice,
                                    //         "goodsType": '1',
                                    //         "supplierId": supplierId,
                                    //         "supplierName": supplierName,
                                    //         "cardType": cardType,
                                    //         "userId": userId
                                    //     },
                                    //     dataType: 'json',
                                    //     success: function (data) {
                                    //         console.log(data)
                                    //         if (data.resultCode == '-1') {
                                    //             myService.setObject('userData', '')
                                    //             $('#cartSelect').fadeOut()
                                    //             $('#HOverlay').remove()
                                    //             $('#HCloseBtn').remove()
                                    //             $('#simple-dialogBox').dialogBox({
                                    //                 hasMask: true,
                                    //                 autoHide: true,
                                    //                 time: 800,
                                    //                 content: data.resultDesc
                                    //             })
                                    //             setTimeout(function () {
                                    //                 location.href = '#/login'
                                    //             }, 1100)
                                    //         }
                                    //         if (data.resultCode == '1') {
                                    //             $('#cartSelect').fadeOut()
                                    //             $('#HOverlay').remove()
                                    //             $('#HCloseBtn').remove()
                                    //             $('#simple-dialogBox').dialogBox({
                                    //                 hasMask: true,
                                    //                 autoHide: true,
                                    //                 time: 800,
                                    //                 content: data.resultDesc
                                    //             })
                                    //             setTimeout(function () {
                                    //                 location.href = '#/cart'
                                    //             }, 1000)
                                    //         }
                                    //     }
                                    // })
                                })
                            }
                        }
                        addCart()*/
                    },
                    onSlideChangeStart: function (swiper) {
                        /*
                        console.log(swiper.realIndex)
                        console.log($rootScope.taocanRows)
                        var userData = $cookies.getObject('userData')
                        console.log(userData)
                        function addCart() {
                            if ((typeof (userData.id)) == 'undefined' || userData == '') {
                                $('.detailSubmit').click(function () {
                                    location.href = '#/login'
                                })
                            } else {
                                var manPrice = $rootScope.taocanRows[swiper.realIndex].manDiscountPrice
                                var nvweiPrice = $rootScope.taocanRows[swiper.realIndex].womanDiscountPriceNot
                                var nvyiPrice = $rootScope.taocanRows[swiper.realIndex].womanDiscountPriceYet
                                $('.manPriceDiv').attr('goodsPrice', manPrice)
                                $('.manPriceSpan').text(manPrice)

                                $('.nvweiPriceDiv').attr('goodsPrice', nvweiPrice)
                                $('.nvweiPriceSpan').text(nvweiPrice)

                                $('.nvyiPriceDiv').attr('goodsPrice', nvyiPrice)
                                $('.nvyiPriceSpan').text(nvyiPrice)
                                $('#cartSelect div').click(function () {
                                    var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                                    var cardType = $(this).attr('cardType')
                                    var nickName = userData.nickname
                                    var userId = userData.id
                                    var goodsId = $rootScope.taocanRows[swiper.realIndex].goodsId
                                    var goodsName = $rootScope.taocanRows[swiper.realIndex].goodsName
                                    var supplierId = $rootScope.taocanRows[swiper.realIndex].supplierId
                                    var supplierName = $rootScope.taocanRows[swiper.realIndex].supplierName
                                    console.log(goodsId)
                                    console.log(userId)
                                    console.log(cardType)
                                    console.log($rootScope.taocanRows[swiper.realIndex])
                                    var lifedata = {
                                        "nickName": nickName,
                                        "goodsId": goodsId,
                                        "goodsName": goodsName,
                                        "goodsPrice": goodsPrice,
                                        "goodsType": '1',
                                        "supplierId": supplierId,
                                        "supplierName": supplierName,
                                        "cardType": cardType,
                                        "userId": userId
                                    }
                                    console.log(lifedata)
                                    // $.ajax({
                                    //     url: ip + '/appShop/addGoodsToCar.htm',
                                    //     type: 'POST',
                                    //     data: {
                                    //         "nickName": nickName,
                                    //         "goodsId": goodsId,
                                    //         "goodsName": goodsName,
                                    //         "goodsPrice": goodsPrice,
                                    //         "goodsType": '1',
                                    //         "supplierId": supplierId,
                                    //         "supplierName": supplierName,
                                    //         "cardType": cardType,
                                    //         "userId": userId
                                    //     },
                                    //     dataType: 'json',
                                    //     success: function (data) {
                                    //         console.log(data)
                                    //         if (data.resultCode == '-1') {
                                    //             myService.setObject('userData', '')
                                    //             $('#cartSelect').fadeOut()
                                    //             $('#HOverlay').remove()
                                    //             $('#HCloseBtn').remove()
                                    //             $('#simple-dialogBox').dialogBox({
                                    //                 hasMask: true,
                                    //                 autoHide: true,
                                    //                 time: 800,
                                    //                 content: data.resultDesc
                                    //             })
                                    //             setTimeout(function () {
                                    //                 location.href = '#/login'
                                    //             }, 1100)
                                    //         }
                                    //         if (data.resultCode == '1') {
                                    //             $('#cartSelect').fadeOut()
                                    //             $('#HOverlay').remove()
                                    //             $('#HCloseBtn').remove()
                                    //             $('#simple-dialogBox').dialogBox({
                                    //                 hasMask: true,
                                    //                 autoHide: true,
                                    //                 time: 800,
                                    //                 content: data.resultDesc
                                    //             })
                                    //             setTimeout(function () {
                                    //                 location.href = '#/cart'
                                    //             }, 1000)
                                    //         }
                                    //     }
                                    // })
                                })
                            }
                        }
                        // addCart()*/
                    }

                })
                var selectH = -$('.timeWrap .right .selectContent').height() - 4
                // console.log(selectH)
                $('.timeWrap .right .selectContent').css('top', selectH + 'px')
                //健康咨讯筛选列表
                $rootScope.articleTitleHealth = '韩一资讯'
                $('.timeWrap .right .selectContent').find('div').click(function () {
                    var programCode = $(this).attr('programCode')
                    $rootScope.articleTitleHealth = $(this).attr('articleTittle')
                    console.log($rootScope.articleTitleHealth)
                    console.log(programCode)
                    $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=4' + '&programCode=' + programCode).success(function (data) {
                        console.log(data)
                        $rootScope.selectRows = data.rows
                    })
                    $('.timeWrap .right .selectContent').fadeOut()
                })


            }
        }
    };
});

//循环完成加载图片1
routeApp.directive('repeatImg',function(){
    return {
        restrict: 'A',
        link:function(scope){
            if (scope.$last === true){
                scope.$emit('imgAllFinished');
                var setMealSwiper = new Swiper('.imgList', {
                    //pagination: '.setMealSwiper-pagination',
                    //paginationType: 'fraction',
                    //slidesPerView: 'auto',
                    centeredSlides: true,
                    //paginationClickable: true,
                    spaceBetween: 60,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                })
            }
        }
    }
})
//循环完成加载图片2
routeApp.directive('repeatImgList',function(){
    return {
        restrict: 'A',
        link:function(scope){
            if (scope.$last === true){
                scope.$emit('imglistFinished');
                var setMealSwiper = new Swiper('.setMealSwiper-container', {
                    pagination: '.setMealSwiper-pagination',
                    paginationType: 'fraction',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    observer:true,
                    paginationClickable: true,
                    spaceBetween: 60,
                })
            }
        }
    }
})

//购物车逻辑指令
routeApp.directive('shopCar', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {
                //购物车Icheck
                $rootScope.sumTotal = 0; //总计
                $('.cartProductsWrap input').iCheck({
                    checkboxClass: 'icheckbox_minimal-pink',
                    radioClass: 'iradio_minimal'
                })
                // $('.cartProductsWrap input').on('ifChanged', function (event) {
                //     var checkedSize = $('.cartProductsWrap').find('.checked').length
                //     console.log(checkedSize)
                //     console.log($('.cartProductsWrap input').length)
                // })
                $('.cartProductsWrap input').on('ifChecked', function (event) {
                    var checkedSize = $('.cartProductsWrap').find('.checked').length
                    // console.log(checkedSize)
                    // console.log($('.cartProductsWrap input').length)
                    var selectIndex = $(this).parent().parent().parent().index()
                    console.log(666666)
                    console.log(selectIndex)
                    if (checkedSize == ($('.cartProductsWrap input').length - 1)) {
                        $('.purchase .icheckbox_minimal-pink').addClass('checked')
                    }
                    $rootScope.cartRows[selectIndex].check = true
                    $scope.$apply(function () {
                        // console.log($rootScope.cartRows[selectIndex])
                        return $rootScope.cartRows[selectIndex].check = true
                    })

                })
                $('.cartProductsWrap input').on('ifUnchecked', function (event) {
                    var checkedSize = $('.cartProductsWrap').find('.checked').length
                    // console.log(checkedSize)
                    // console.log($('.cartProductsWrap input').length)
                    var selectIndex = $(this).parent().parent().parent().index()
                    if (checkedSize == ($('.cartProductsWrap input').length)) {
                        $('.purchase .icheckbox_minimal-pink').removeClass('checked')
                    }
                    var selectIndex = $(this).parent().parent().parent().index()
                    $rootScope.cartRows[selectIndex].check = false

                    $scope.$apply(function () {
                        // console.log('选中')
                        // console.log($rootScope.cartRows[selectIndex].check)
                        return $rootScope.cartRows[selectIndex].check = false
                    });
                })
                $('.purchase input').iCheck({
                    checkboxClass: 'icheckbox_minimal-pink',
                    radioClass: 'iradio_minimal',
                    increaseArea: '20%'
                })
                $('.purchase input').on('ifChecked', function (event) {
                    $('.cartProductsWrap input').iCheck('check')
                    $scope.$apply(function () {
                        // console.log('选中')
                        // console.log($rootScope.cartRows[selectIndex].check)
                        for (var i in $rootScope.cartRows) {
                            return $rootScope.cartRows[i].check = true
                        }

                    });
                });
                $('.purchase input').on('ifUnchecked', function (event) {
                    $('.cartProductsWrap input').iCheck('uncheck');
                    $scope.$apply(function () {
                        for (var i in $rootScope.cartRows) {
                            return $rootScope.cartRows[i].check = false
                        }

                    })
                })
                $rootScope.goPurchase = function () {
                    myService.setObject('checkedAddressData', '')
                    myService.setObject('checkDeliveryWay', '')
                    var checkedSize = $('.cartProductsWrap').find('.checked').length
                    if (checkedSize == 0) {
                        $('#simple-dialogBox').dialogBox({
                            hasMask: true,
                            autoHide: true,
                            time: 1000,
                            content: '您还没有选择任何商品'
                        })
                        myService.setObject('checkData', '')
                        myService.setObject('sumTotal', '')
                        return false
                    }
                    if (checkedSize > 0) {
                        location.href = '#/editOrder'
                    }
                    console.log(checkedSize)
                }

                $rootScope.$watch('cartRows', function (newValue, oldValue, scope) {
                    $rootScope.sumTotal = 0; //总计
                    for (var i in newValue) {
                        var total = newValue[i].goodsNum * newValue[i].goodsPrice; //计算出新的结果
                        console.log(newValue)
                        if (newValue[i].check) {
                            $rootScope.sumTotal += total;
                            myService.setObject('sumTotal', $rootScope.sumTotal)
                        }
                    }
                    var checkData = []
                    function findChecked() {
                        for (var i in $rootScope.cartRows) {
                            var checkedCheck = $rootScope.cartRows[i].check
                            if (checkedCheck == true) {
                                console.log(i)
                                checkData.push($rootScope.cartRows[i])
                                console.log(checkData)
                                myService.setObject('checkData', checkData)
                                // $scope.checkData = myService.getObject('checkData')
                            }

                        }
                    }
                    findChecked()
                    // console.log($scope.checkData.length)
                    // if(typeof $scope.checkData == 'undefined'){
                    //     console.log('什么也没选')
                    // }else{
                    //     console.log('至少选了一个')

                    // }
                    // $scope.all = ($scope.count == newValue.length); //如果所有的都选中的话，那么全选也应该选中
                }, true);
                //对购物车数量进行编辑
                //minus
                $rootScope.minus = function () {
                    if (this.item.goodsNum == 1) {
                        return false
                    }
                    this.item.goodsNum = this.item.goodsNum - 1

                    if (this.item.cardType == '男性') {
                        var cardType = '0'
                        // console.log(this.item.cardType)
                    }
                    if (this.item.cardType == '女性未婚') {
                        var cardType = '1'
                    }
                    if (this.item.cardType == '女性已婚') {
                        var cardType = '2'
                    }
                    var userId = $rootScope.userId
                    var goodsId = this.item.goodsId
                    console.log(cardType)
                    function minus() {
                        $.ajax({
                            url: ip + '/appShop/updateMyCar.htm',
                            type: 'POST',
                            data: {
                                "flag": 0,
                                "cardType": cardType,
                                "goodsId": goodsId,
                                "userId": userId
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)

                            }
                        })
                    }
                    minus()
                }

                $rootScope.add = function () {
                    console.log(this.item.cardType)
                    this.item.goodsNum = this.item.goodsNum + 1
                    if (this.item.cardType == '男性') {
                        var cardType = '0'
                        // console.log(this.item.cardType)
                    }
                    if (this.item.cardType == '女性未婚') {
                        var cardType = '1'
                    }
                    if (this.item.cardType == '女性已婚') {
                        var cardType = '2'
                    }
                    var userId = $rootScope.userId
                    var goodsId = this.item.goodsId
                    console.log(cardType)
                    function add() {
                        $.ajax({
                            url: ip + '/appShop/updateMyCar.htm',
                            type: 'POST',
                            data: {
                                "flag": 1,
                                "cardType": cardType,
                                "goodsId": goodsId,
                                "userId": userId
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)

                            }
                        })
                    }
                    add()
                }
            }
        }
    };
});
// 韩一咨讯指令
routeApp.directive('onFinishZixun', function ($timeout, $rootScope, $http) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$emit('zixunFinished');
                var healthNewsSwiper = new Swiper('.healthNewsSwiper-container', {
                    pagination: '.healthNewsSwiper-pagination',
                    slidesPerView: 2.43,
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 5,
                    centeredSlides: false
                })
            }
        }
    };
});
// indexCtrl
routeApp.controller('indexCtrl', function ($scope, $window, $location, $rootScope, $http, myService, $cookieStore, $cookies) {
    $rootScope.goback = function () {
        window.history.go(-1)
        return false
    }

    //判断是否登录
    $rootScope.isLogin = function () {
        $scope.favoriteCookie = $cookies.getObject('userData')
        //console.log('cookie')
        //console.log($scope.favoriteCookie)
        // console.log(typeof $scope.favoriteCookie.id)
        if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
            $('#userCenter').attr('href', '#/login')
            $('#appointLink').attr('href', '#/login')
            $('#easemob').attr({'href':'#/login','onclick':''})
            $('#easemob1').attr({'href':'#/login','onclick':''})
        } else {
            $('#userCenter').attr('href', '#/userInfo')
            $('#appointLink').attr('href', '#/appoint')
            $('#easemob').attr({'onclick': "easemobim.bind()",href:''})
            $('#easemob1').attr({'onclick': "easemobim.bind()",href:''})
            easemobim.config={
                tenantId: '36239',
                to:'kefuchannelimid_408921',
                appKey:'1138170216115188#kefuchannelapp36239',
                //环信移动客服域，固定值，请按照示例配置
                domain: '//kefu.easemob.com',
                //您网站上im.html文件的完整路径
                path: './',
                //访客插件static的路径
                //staticPath: './static',
                resources:true,
                //eventCollector:true,
                //visitor:{
                //    trueName:$scope.favoriteCookie.user,
//                userNickname:sessionStorage.getItem('easmInfo').user
//                },
                user:{
                    username:$cookies.getObject('easmInfo').user,
                    password:$cookies.getObject('easmInfo').psw,
                },
                unused: ''
            }
        }
    }
    $rootScope.isLogin();
});
// 登录
routeApp.controller('loginCtrl', function ($scope, $window, $location, $state, $rootScope, $http, myService, $cookieStore, $cookies) {
    $scope.usrData = {
        loginTerminal: '4'
    }
    $scope.sub = function () {
        var checkMsg = ''
        // if ($('input[name="telephone"]').val() == '' || $('input[name="verifyCode"]').val() == '' || $('input[name="password"]').val() == '' || $('input[name="passwordAgain"]').val() == '') {
        if ($('input[name="telephone"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号不能为空！'
            })
            return false
        }
        if ($('input[name="password"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '密码不能为空！'
            })
            return false
        }
        $http({
            method: 'POST',
            url: ip + "/appMember/login.htm",
            data: $.param($scope.usrData),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data)
                if (data.resultCode == '1') {
                    // myService.setObject('userData', data.object)
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 30);
                    var easmInfo={
                        user:data.object.telephone,
                        psw:data.object.id
                    }
                    $cookies.putObject('easmInfo',easmInfo)
                    $cookies.putObject('userData', data.object, { 'expires': expireDate })
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                    setTimeout(function () {
                        $state.go('home')
                    }, 1100)
                } else {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: data.resultDesc
                    })
                }
            })
    }
});
// 注册
routeApp.controller('registCtrl', function ($scope, $window, $location, $rootScope, $http, myService) {
    //倒计时60s
    var wait = 60;
    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            o.style.border = '1px solid #D42323'
            o.style.color = '#D42323'
            o.value = "重新发送";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.style.border = '1px solid #808080'
            o.style.color = '#808080'
            o.value = wait + "s";
            wait--
            setTimeout(function () {
                time(o)
            }, 1000)
        }
    }
    //获取验证码
    $('#reqCode').click(function () {
        if ($('#regist_telephone').val() == '') {
            swal({
                showConfirmButton: false,
                width: 180,
                padding: 10,
                autoHide: true,
                timer: 1000,
                text: '手机号不能为空！'
            })
            return false
        }
        time(this)
        var telephone = $('#regist_telephone').val()
        $http.get(ip + '/appMember/smsValidation.htm?telephone=' + telephone + '&flag=0').success(function (data) {
            console.log(data)
        })
    })
    $scope.usrData = {
        registerTerminal: '4'
    }
    $scope.sub = function () {
        var checkMsg = ''
        // if ($('input[name="telephone"]').val() == '' || $('input[name="verifyCode"]').val() == '' || $('input[name="password"]').val() == '' || $('input[name="passwordAgain"]').val() == '') {
        if ($('input[name="telephone"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号不能为空！'
            })
            return false
        }
        //手机验证
        function testNumbers() {
            var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
            var value = $('input[name="telephone"]').val()
            if (isMob.test(value)) {
                return true
            }
            else {
                checkMsg += '手机号格式不正确！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号格式不正确！'
                })
                return false
            }
        }
        testNumbers()
        if ($('input[name="verifyCode"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '验证码不能为空！'
            })
            return false
        }
        if ($('input[name="password"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '密码不能为空！'
            })
            return false
        }
        //密码验证
        function testPassword() {
            var isPassword = /^.{6,}$/
            var value = $('input[name="password"]').val()
            if (isPassword.test(value)) {
                return true
            }
            else {
                checkMsg += '密码格式不正确！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '密码格式不正确！'
                })
                return false
            }
        }
        testPassword()
        if ($('input[name="passwordAgain"]').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '确认密码不能为空！'
            })
            return false
        }
        if ($('input[name="password"]').val() != $('input[name="passwordAgain"]').val()) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '两次密码输入不一致！'
            })
            return false
        }
        if (checkMsg != '') {
            console.log(checkMsg)
            return false
        }
        $http({
            method: 'POST',
            url: ip + "/appMember/registerOne.htm",
            data: $.param($scope.usrData),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data)
                if (data.resultCode == '1') {
                    //同步到联系人表
                    $http.post(ip + '/appMember/syncPersonInfor.htm?telephone=' + $('#regist_telephone').val()).success(function (data) {
                        console.log(data)
                    })
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                    setTimeout(function () {
                        location.href = '#/login'
                    }, 1000)
                } else {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                }
            });
    }

});
// 个人中心
routeApp.controller('userInfoCtrl', function ($scope, $rootScope, $http, myService) {
    $scope.imgIp = ip
    // if ($scope.favoriteCookie == undefined || $scope.userData == '') {
    //     $('*').hide()
    //     location.href = '#/home'
    // }
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        if (data.resultCode == '1') {
            $scope.accountData = data.object
            console.log($scope.accountData.userCard)
            $scope.queryReport = function () {
                if ($scope.accountData.userCard == null) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '您还未进行实名认证'
                    })
                    return false
                    // setTimeout(function () {
                    //     location.href = '#/idVerify'
                    // }, 1300)
                } else if ($scope.accountData.userCard != null) {
                    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone).success(function (data) {
                        console.log(data)
                        $scope.selectData = data.rows
                        if ($scope.selectData.length == 0) {
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 1000,
                                content: '暂无数据'
                            })
                            return false
                        }
                        else {
                            location.href = '#/queryReport'
                        }
                    })
                }
            }
            /*
            $scope.healthProject = function () {
                console.log($scope.accountData.userCard)
                if ($scope.accountData.userCard == null) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '您还未进行实名认证'
                    })
                    return false
                    // setTimeout(function () {
                    //     location.href = '#/idVerify'
                    // }, 1300)
                } else {
                    location.href = '#/healthProject'
                }
            }
            */
            $scope.healthProject = function () {
                if ($scope.accountData.userCard == null) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '您还未进行实名认证'
                    })
                    return false
                    // setTimeout(function () {
                    //     location.href = '#/idVerify'
                    // }, 1300)
                } else if ($scope.accountData.userCard != null) {
                    $http.get(ip + '/appSetMeal/queryForDate.htm?userId=' + $scope.favoriteCookie.id+ '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone).success(function (data) {
                        console.log(data)
                        $scope.selectData = data.rows
                        if ($scope.selectData.length == 0) {
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 1000,
                                content: '暂无数据'
                            })
                            return false
                        }
                        else {
                            location.href = '#/healthProject'
                        }
                    })
                }
            }
        } else if (data.resultCode == '-1') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 800,
                content: data.resultDesc
            })
            location.href = '#/login'
        } else {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 800,
                content: data.resultDesc
            })
        }
    })/*
    $scope.jiedu=function(){
        $('#simple-dialogBox').dialogBox({
            hasMask: true,
            autoHide: true,
            time: 800,
            content: '暂未开放'
        })
    }*/
    $scope.toSend=function(){
        $('#simple-dialogBox').dialogBox({
            hasMask: true,
            autoHide: true,
            time: 800,
            content: '暂无数据'
        })
    }
    $scope.appraise=function(){
        $('#simple-dialogBox').dialogBox({
            hasMask: true,
            autoHide: true,
            time: 800,
            content: '暂无数据'
        })
    }
});
// 使用验证码登录
routeApp.controller('forgetCtrl', function ($scope, $window, $state, $location, $rootScope, $http, myService, $cookieStore, $cookies) {
    //倒计时60s
    var wait = 60;
    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            o.style.border = '1px solid #D42323'
            o.style.color = '#D42323'
            o.value = "重新发送";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.style.border = '1px solid #808080'
            o.style.color = '#808080'
            o.value = wait + "s";
            wait--
            setTimeout(function () {
                time(o)
            }, 1000)
        }
    }
    $('#forget_reqCode').click(function () {
        time(this)
        var telephone = $('#qrcodeTelephone').val()
        $http.get(ip + '/appMember/smsValidation.htm?telephone=' + telephone + '&flag=1').success(function (data) {
            console.log(data)
        })
    })

    $scope.userData = {
        loginTerminal: '4'
    }
    $scope.sub = function () {

        console.log($scope.userData)
        // if ($('input[name="telephone"]').val() == '' || $('input[name="verifyCode"]').val() == '' || $('input[name="password"]').val() == '' || $('input[name="passwordAgain"]').val() == '') {
        // if ($('input[name="telephone"]').val() == '') {
        //     $('#simple-dialogBox').dialogBox({
        //         hasMask: true,
        //         autoHide: true,
        //         time: 1000,
        //         content: '手机号不能为空！'
        //     })
        //     return false
        // }
        // if ($('input[name="password"]').val() == '') {
        //     $('#simple-dialogBox').dialogBox({
        //         hasMask: true,
        //         autoHide: true,
        //         time: 1000,
        //         content: '密码不能为空！'
        //     })
        //     return false
        // }
        $http({
            method: 'POST',
            url: ip + "/appMember/loginVerifyCode.htm",
            data: $.param($scope.userData),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data)
                if (data.resultCode == '1') {
                    // myService.setObject('userData', data.object)
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 30);
                    $cookies.putObject('userData', data.object, { 'expires': expireDate })
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                    setTimeout(function () {
                        $state.go('home')
                    }, 1100)
                } else {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: data.resultDesc
                    })
                }
            })
    }
});
// 退出登录
routeApp.controller('exitCtrl', function ($scope, $window, $location, $rootScope, $http, myService, $cookies) {
    $scope.userData = $cookies.getObject('userData')
    console.log($scope.userData)
    var userId = $scope.favoriteCookie.id
    $rootScope.exit = function () {
        $http.post(ip + '/appMember/logout.htm?userId=' + userId).success(function (data) {
            console.log(data)
            myService.setObject('userData', '')
            $cookies.putObject('easmInfo','')
            $scope.userData = ''
            $cookies.putObject('userData', '')
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 800,
                content: '退出成功'
            })
            setTimeout(function () {
                location.href = '#/home'
            }, 1000)
        })
        $scope.userData = $cookies.getObject('userData')
    }
    $rootScope.isLogin()
});
//加载页面
routeApp.controller('mainCtrl', function ($scope, $rootScope, $http, myService) {
    $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=2').success(function (data) {
        console.log(data);
        $scope.imgIp = ip
        $scope.rows = data.rows
    })
});
//加载页面详情
routeApp.controller('mainTempCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    var id = $stateParams.id
    $http.get(ip + '/appCms/queryCmsInformation.htm?programCode=' + id + '&flag=6').success(function (data) {
        console.log(data)
        var oldArticleContextStyle = data.object.articleContextStyle
        var newArticleContextStyle = $sce.trustAsHtml(oldArticleContextStyle);
        $scope.articleContextStyle = newArticleContextStyle
        //console.log(id)
        //console.log($scope.articleContextStyle)
    })
});
//主页
routeApp.controller('homeCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $cookieStore) {
    $rootScope.isLogin()
    //轮播图
    $http.get(ip + '/appCms/queryCms.htm?programCode=ZYLBT' + '&terminalType=4').success(function (data) {
        console.log(data);
        $scope.imgIp = ip
        $scope.rows = data.rows
        // $scope.video = function () {
        //     if (this.item.publishedMedia == '1') {
        //         alert(1)
        //         // $('.mainFirstA').last().removeAttr('ui-sref')
        //         // $('.mainFirstA').last().attr('href', '')
        //         // $('.mainFirstA').last().click(function () {
        //         //     window.location.href = '#/home'
        //         // })
        //     }
        // }
    })
});
// 主页轮播图详情
routeApp.controller('lbtDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    //轮播图
    var id = $stateParams.id
    var articleId = $stateParams.articleId
    $http.get(ip + '/appCms/queryCms.htm?programCode=' + id + '&articleId=' + articleId + '&terminalType=4').success(function (data) {
        //console.log(data)
        //console.log(id)
        //console.log(articleId)
        $scope.data = data
        $scope.imgIp = ip
        $scope.rows = data.rows
        $scope.deliverData = function () {
            //console.log(this.item)
            myService.setObject('deliverData', this.item)
        }
    })
});

//主页轮播图下层lbtDetailNext
routeApp.controller('lbtDetailNextCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    //轮播图
    var id = $stateParams.id
    var articleId = $stateParams.articleId
    $scope.deliverData = myService.getObject('deliverData')
    //console.log(8888888888)
    //console.log($scope.deliverData)
    $http.get(ip + '/appCms/queryCms.htm?programCode=' + id + '&articleId=' + articleId + '&terminalType=4').success(function (data) {
        //console.log(data)
        //console.log(id)
        //console.log(articleId)
        $scope.data = data
        $scope.imgIp = ip
        $scope.rows = data.rows
        if($scope.rows[0]==undefined){
            $scope.show=true;
        }else{
            $scope.show=false;
            var oldArticleContextStyle = $scope.rows[0].articleContextStyle;
            var newArticleContextStyle = $sce.trustAsHtml(oldArticleContextStyle);
            $scope.articleContextStyle = newArticleContextStyle
        }
        /*
        if ($scope.rows[0] != undefined) {
            //console.log(99999999)
            $('#doctorsInfo').hide()
            $('.imgList').hide()
        } else {
            $('#doctorsInfo').show()
        }


        if (oldArticleContextStyle == '') {
            $('#articleContextStyle').hide()
        }
        */
    })
    $http.get(ip + '/appDoctor/queryDoctors.htm').success(function (data) {
        //console.log(data)
        $scope.doctors = data
        $scope.doctorsInfo = function () {
            console.log(this.item)
            myService.setObject('doctorsInfo', this.item)
            window.location.href = '#/lbtDoctorsInfo'
        }
    })

});

// 医生介绍详情
routeApp.controller('lbtDoctorsInfoCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    //获取上页医生数据
    $scope.doctorsInfo = myService.getObject('doctorsInfo')
    var olddoctorDescriptionStyle = $scope.doctorsInfo.doctorDescriptionStyle
    var newdoctorDescriptionStyle = $sce.trustAsHtml(olddoctorDescriptionStyle);
    $scope.doctorDescriptionStyle = newdoctorDescriptionStyle
    console.log($scope.doctorsInfo)
});
//在线预约指令            
routeApp.directive('appointFinished', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {
                //选择已购买套餐进行预约
                console.log($('#buyTaocan .labelMargin').text())
                $('#square-radio-1').on('ifChecked', function (event) {
                    var yigouLength = myService.get(yigouLength)
                    console.log('yigouLength')
                    $('#buyTaocan .labelMargin').html($rootScope.yigou[0].cardName + '(' + $rootScope.yigou[0].cardNo + ')')
                    $rootScope.yigouMeal = $rootScope.yigou[0]
                    myService.setObject('yigouMeal', $rootScope.yigouMeal)
                    myService.setObject('appointmentType', '0')
                    $('.allMask').show()
                    $('.buyTaocan').show()
                    $('.buyTaocan').find('div').click(function () {
                        $('#buyTaocan .labelMargin').html($(this).html())
                        console.log($(this).index())
                        $rootScope.yigouMeal = $rootScope.yigou[$(this).index()]
                        myService.setObject('yigouMeal', $rootScope.yigouMeal)
                        console.log($rootScope.yigouMeal)
                        $('.allMask').hide()
                        $('.buyTaocan').hide()
                    })
                    $('#buyTaocan .labelMargin').click(function () {
                        $('.allMask').show()
                        $('.buyTaocan').show()
                    })
                    $('.allMask').click(function () {
                        $('.allMask').hide()
                        $('.buyTaocan').hide()
                    })
                })


            }
        }
    };
});

// 在线预约
routeApp.controller('appointCtrl', function ($scope, $rootScope, $http, myService) {
    $rootScope.isLogin()
    $('.inputWrap input').iCheck({
        radioClass: 'iradio_square-green',
    })
    // if ($scope.favoriteCookie == undefined || $scope.userData == '') {
    //     location.href = '#/login'
    // }

    //获取列表
    $http.get(ip + '/appAppointment/queryMyCard.htm?memberId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $rootScope.yigou = data.rows
        console.log($rootScope.yigou.length)
        myService.set('yigouLength', $rootScope.yigou.length)
    })
    // $('#square-radio-1').on('ifChecked', function (event) {
    //     var yigouLength = myService.get(yigouLength)
    //     console.log('yigouLength')

    // })
    //套餐卡号预约
    $('#square-radio-2').on('ifChecked', function (event) {
        myService.setObject('appointmentType', '1')
    })

    //选择套餐后预约
    $('#square-radio-3').on('ifChecked', function (event) {
        myService.setObject('appointmentType', '2')
    })



    $rootScope.appointNext = function () {
        var checkedSize = $('.inputWrap').find('.checked').length
        console.log(checkedSize)
        if (checkedSize == '0') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 800,
                content: '请选择预约方式'
            })
            return false
        }
        var buyTaocanChecked = $('#buyTaocan').find('.checked').length
        var cardNoChecked = $('#cardNo').find('.checked').length
        var mealAfterChecked = $('#mealAfter').find('.checked').length
        if (buyTaocanChecked == '1') {
            console.log('选择了已购买套餐预约')
            var yigouLength = myService.get('yigouLength')
            console.log(yigouLength)
            if (yigouLength == 0) {
                // alert('您未购买过套餐')
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '您未购买过套餐'
                })
                return false
            }
            location.href = '#/editInfo'
        }
        if (cardNoChecked == '1') {
            // location.href = '#/editInfo'
            console.log('选择了卡号预约')
            var inputCardNo = $('#inputCardNo').val()
            console.log(inputCardNo)
            if (inputCardNo == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '请输入体检卡号'
                })
                return false
            }
            $http.get(ip + '/appAppointment/queryByCardNo.htm?cardNo=' + inputCardNo).success(function (data) {
                console.log(data)
                if (data.resultCode == '0') {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                }
                if (data.resultCode == '1') {
                    myService.setObject('yigouMeal', data.object)
                    location.href = '#/editInfo'
                }
            })
        }
        if (mealAfterChecked == '1') {
            location.href = '#/selectMeal'
        }
    }
});
// 韩一商城 商品列表
routeApp.controller('mallCtrl', function ($scope, $rootScope, $http, myService) {
    $rootScope.isLogin()
    $http.get(ip + '/appShop/queryGoodsAll.htm?limit=20&page=1').success(function (data) {
        console.log(data)
        $scope.imgIp = ip;
        for(var i=0;i<data.rows.length;i++){
            if(data.rows[i].manDiscountPrice===null){
                data.rows[i].manDiscountPrice=0
            }
            if(data.rows[i].womanDiscountPriceNot===null){
                data.rows[i].womanDiscountPriceNot=0
            }
            if(data.rows[i].womanDiscountPriceYet===null){
                data.rows[i].womanDiscountPriceYet=0
            }
            if(data.rows[i].manPrice===null){
                data.rows[i].manPrice=0
            }
            if(data.rows[i].womanPriceNot===null){
                data.rows[i].womanPriceNot=0
            }
            if(data.rows[i].womanPriceYet===null){
                data.rows[i].womanPriceYet=0
            }
            data.rows[i].manDiscountPrice=parseInt(data.rows[i].manDiscountPrice);
            data.rows[i].womanDiscountPriceNot=parseInt(data.rows[i].womanDiscountPriceNot);
            data.rows[i].womanDiscountPriceYet=parseInt(data.rows[i].womanDiscountPriceYet);
        }
        $scope.rows = data.rows
    })
});
// 韩一商城 商品详情
routeApp.controller('productsDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    // $scope.userData = $cookies.getObject('userData')
    var id = $stateParams.id
    $http.get(ip + '/appShop/queryGoodsDetail.htm?id=' + id + '&articleId=').success(function (data) {
        console.log(data)
        // console.log(id)
        $scope.imgIp = ip;
        $scope.data = data.object;
        $scope.hiddenData={};
        $scope.hiddenData.manDiscountPrice=$scope.data.manDiscountPrice;
        $scope.hiddenData.womanDiscountPriceNot=$scope.data.womanDiscountPriceNot;
        $scope.hiddenData.womanDiscountPriceYet=$scope.data.womanDiscountPriceYet;
        console.log($scope.hiddenData)

        $scope.data.manDiscountPrice=parseInt($scope.data.manDiscountPrice);
        $scope.data.womanDiscountPriceNot=parseInt($scope.data.womanDiscountPriceNot);
        $scope.data.womanDiscountPriceYet=parseInt($scope.data.womanDiscountPriceYet);

        console.log($scope.data)
        myService.setObject('nextData', $scope.data)
        myService.setObject('hiddenData', $scope.hiddenData)
        //右边高度居中自适应
        var detailDecH = $('.detailDec').height()
        // console.log(detailDecH)
        $('.detailDec .right').css('height', detailDecH + 32 + 'px')
        console.log($scope.data.stockNum)
        if ($scope.data.stockNum <= 0) {
            console.log($scope.data.stockNum)
            // $('.detailSubmit').css('background', '#adadad')
            // $('.detailSubmit').click(function () {
            //     $('#simple-dialogBox').dialogBox({
            //         hasMask: true,
            //         autoHide: true,
            //         time: 800,
            //         content: '该商品库存不足'
            //     })
            // })
            //加入购物车列表
            $scope.addCart = function () {
                if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
                    $('.detailSubmit').click(function () {
                        location.href = '#/login'
                    })
                } else {
                    $('.detailSubmit').hDialog({
                        box: '#cartSelect',
                        width: 230,
                        height: 200,
                        modalHide: false
                        // isOverlay: false
                    })
                    $('#cartSelect div').click(function () {
                        console.log($(this).attr('goodsPrice'))
                        var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                        var cardType = $(this).attr('cardType')
                        var nickName = $scope.favoriteCookie.nickname
                        var goodsId = $scope.data.id
                        var goodsName = $scope.data.goodsName
                        var goodsType = $scope.data.goodsType
                        var supplierId = $scope.data.supplierId
                        var supplierName = $scope.data.supplierName
                        var userId = $scope.favoriteCookie.id
                        console.log(supplierName)
                        console.log(userId)
                        console.log(cardType)
                        $.ajax({
                            url: ip + '/appShop/addGoodsToCar.htm',
                            type: 'post',
                            data: {
                                "nickName": nickName,
                                "goodsId": goodsId,
                                "goodsName": goodsName,
                                "goodsPrice": goodsPrice,
                                "goodsType": goodsType,
                                "supplierId": supplierId,
                                "supplierName": supplierName,
                                "cardType": cardType,
                                "userId": userId
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                if (data.resultCode == '-1') {
                                    myService.setObject('userData', '')
                                    $('#cartSelect').fadeOut()
                                    $('#HOverlay').remove()
                                    $('#HCloseBtn').remove()
                                    $('#simple-dialogBox').dialogBox({
                                        hasMask: true,
                                        autoHide: true,
                                        time: 800,
                                        content: data.resultDesc
                                    })
                                    setTimeout(function () {
                                        location.href = '#/login'
                                    }, 1100)
                                }
                                if (data.resultCode == '1') {
                                    $('#cartSelect').fadeOut()
                                    $('#HOverlay').remove()
                                    $('#HCloseBtn').remove()
                                    $('#simple-dialogBox').dialogBox({
                                        hasMask: true,
                                        autoHide: true,
                                        time: 800,
                                        content: data.resultDesc
                                    })
                                    setTimeout(function () {
                                        location.href = '#/cart'
                                    }, 1100)
                                }
                            }
                        })
                    })
                }
            }
            $scope.addCart()
        } else {
            //加入购物车列表
            $scope.addCart = function () {
                if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
                    $('.detailSubmit').click(function () {
                        location.href = '#/login'
                    })
                } else {
                    $('.detailSubmit').hDialog({
                        box: '#cartSelect',
                        width: 230,
                        height: 200,
                        modalHide: false
                        // isOverlay: false
                    })
                    $('#cartSelect div').click(function () {
                        var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                        var cardType = $(this).attr('cardType')
                        var nickName = $scope.favoriteCookie.nickname
                        var goodsId = $scope.data.id
                        var goodsName = $scope.data.goodsName
                        var goodsType = $scope.data.goodsType
                        var supplierId = $scope.data.supplierId
                        var supplierName = $scope.data.supplierName
                        var userId = $scope.favoriteCookie.id
                        console.log(supplierName)
                        console.log(userId)
                        console.log(cardType)
                        $.ajax({
                            url: ip + '/appShop/addGoodsToCar.htm',
                            type: 'post',
                            data: {
                                "nickName": nickName,
                                "goodsId": goodsId,
                                "goodsName": goodsName,
                                "goodsPrice": goodsPrice,
                                "goodsType": goodsType,
                                "supplierId": supplierId,
                                "supplierName": supplierName,
                                "cardType": cardType,
                                "userId": userId
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                if (data.resultCode == '-1') {
                                    myService.setObject('userData', '')
                                    $('#cartSelect').fadeOut()
                                    $('#HOverlay').remove()
                                    $('#HCloseBtn').remove()
                                    $('#simple-dialogBox').dialogBox({
                                        hasMask: true,
                                        autoHide: true,
                                        time: 800,
                                        content: data.resultDesc
                                    })
                                    setTimeout(function () {
                                        location.href = '#/login'
                                    }, 1100)
                                }
                                if (data.resultCode == '1') {
                                    $('#cartSelect').fadeOut()
                                    $('#HOverlay').remove()
                                    $('#HCloseBtn').remove()
                                    $('#simple-dialogBox').dialogBox({
                                        hasMask: true,
                                        autoHide: true,
                                        time: 800,
                                        content: data.resultDesc
                                    })
                                    setTimeout(function () {
                                        location.href = '#/cart'
                                    }, 1100)
                                }
                            }
                        })
                    })
                }
            }
            $scope.addCart()
        }

    })


});
// 韩一商城 商品详情下一层
routeApp.controller('productsDetailNextCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.data = myService.getObject('nextData')
    $scope.hiddenData = myService.getObject('hiddenData')
    $scope.imgIp = ip
    console.log($scope.data)
    //点击全屏显示图片
    $('.detailNext').click(function () {
        console.log(1)
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=yes')
        $('#imgFullscreen').css('display', 'block')
        $('#imgFullscreen').siblings().css('display', 'none')
        $('.productsStyle').css('display', 'none')
    })
    $('#imgFullscreen').click(function () {
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no')
        $('#imgFullscreen').css('display', 'none')
        $(this).siblings().css('display', 'block')
        $('.productsStyle').css('display', 'none')
        $('#cartSelect').css('display', 'none')
    })
    if ($scope.data.stockNum <= 0) {
        console.log($scope.data.stockNum)
        // $('.detailSubmit').css('background', '#adadad')
        // $('.detailSubmit').click(function () {
        //     $('#simple-dialogBox').dialogBox({
        //         hasMask: true,
        //         autoHide: true,
        //         time: 800,
        //         content: '该商品库存不足'
        //     })
        // })
        //加入购物车列表
        $scope.addCart = function () {
            if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
                $('.detailSubmit').click(function () {
                    location.href = '#/login'
                })
            } else {
                $('.detailSubmit').hDialog({
                    box: '#cartSelect',
                    width: 230,
                    height: 200,
                    modalHide: false
                    // isOverlay: false
                })
                $('#cartSelect div').click(function () {
                    var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                    console.log(goodsPrice)
                    var cardType = $(this).attr('cardType')
                    var nickName = $scope.favoriteCookie.nickname
                    var goodsId = $scope.data.id
                    var goodsName = $scope.data.goodsName
                    var goodsType = $scope.data.goodsType
                    var supplierId = $scope.data.supplierId
                    var supplierName = $scope.data.supplierName
                    var userId = $scope.favoriteCookie.id
                    console.log(supplierName)
                    console.log(userId)
                    console.log(cardType)
                    $.ajax({
                        url: ip + '/appShop/addGoodsToCar.htm',
                        type: 'post',
                        data: {
                            "nickName": nickName,
                            "goodsId": goodsId,
                            "goodsName": goodsName,
                            "goodsPrice": goodsPrice,
                            "goodsType": goodsType,
                            "supplierId": supplierId,
                            "supplierName": supplierName,
                            "cardType": cardType,
                            "userId": userId
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            if (data.resultCode == '-1') {
                                myService.setObject('userData', '')
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/login'
                                }, 1100)
                            }
                            if (data.resultCode == '1') {
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/cart'
                                }, 1100)
                            }
                        }
                    })
                })
            }
        }
        $scope.addCart()
    } else {
        //加入购物车列表
        $scope.addCart = function () {
            if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
                $('.detailSubmit').click(function () {
                    location.href = '#/login'
                })
            } else {
                $('.detailSubmit').hDialog({
                    box: '#cartSelect',
                    width: 230,
                    height: 200,
                    modalHide: false
                    // isOverlay: false
                })
                $('#cartSelect div').click(function () {
                    var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                    var cardType = $(this).attr('cardType')
                    var nickName = $scope.favoriteCookie.nickname
                    var goodsId = $scope.data.id
                    var goodsName = $scope.data.goodsName
                    var goodsType = $scope.data.goodsType
                    var supplierId = $scope.data.supplierId
                    var supplierName = $scope.data.supplierName
                    var userId = $scope.favoriteCookie.id
                    console.log(supplierName)
                    console.log(userId)
                    console.log(cardType)
                    $.ajax({
                        url: ip + '/appShop/addGoodsToCar.htm',
                        type: 'POST',
                        data: {
                            "nickName": nickName,
                            "goodsId": goodsId,
                            "goodsName": goodsName,
                            "goodsPrice": goodsPrice,
                            "goodsType": goodsType,
                            "supplierId": supplierId,
                            "supplierName": supplierName,
                            "cardType": cardType,
                            "userId": userId
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            if (data.resultCode == '-1') {
                                myService.setObject('userData', '')
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/login'
                                }, 1100)
                            }
                            if (data.resultCode == '1') {
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/cart'
                                }, 1100)
                            }
                        }
                    })
                })
            }
        }
        $scope.addCart()
    }
});
// 套餐服务
routeApp.controller('setMealCtrl', function ($scope, $rootScope, $http, myService, $state, $stateParams, $sce, $cookies) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appSetMeal/querySetMeal.htm').success(function (data) {
        console.log(data)
        $rootScope.taocanRows = data.rows
    })
    $scope.slideData = function () {
        myService.setObject('slideData', this.item)
        $state.go('setMealDetail1')
    }
    $scope.addCart = function () {
        console.log(1111)
        console.log($('.swiper-pagination-current').text())
        var lifeIndex = $('.swiper-pagination-current').text() - 1
        console.log(lifeIndex)
        $('.allMask').fadeIn()
        $('#cartSelect2').fadeIn()

        if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
            location.href = '#/login'
        } else {
            console.log(99999999999)
            console.log(lifeIndex)
            console.log($rootScope.taocanRows[lifeIndex])
            var manPrice = $rootScope.taocanRows[lifeIndex].manDiscountPrice
            var nvweiPrice = $rootScope.taocanRows[lifeIndex].womanDiscountPriceNot
            var nvyiPrice = $rootScope.taocanRows[lifeIndex].womanDiscountPriceYet
            $('.manPriceDiv').attr('goodsPrice', manPrice)
            $('.manPriceSpan').text(parseInt(manPrice))

            $('.nvweiPriceDiv').attr('goodsPrice', nvweiPrice)
            $('.nvweiPriceSpan').text(parseInt(nvweiPrice))

            $('.nvyiPriceDiv').attr('goodsPrice', nvyiPrice)
            $('.nvyiPriceSpan').text(parseInt(nvyiPrice))
            $('#cartSelect2 section').click(function () {
                $('.allMask').fadeOut()
                $('#cartSelect2').fadeOut()
            })
            $('#cartSelect2 div').click(function () {
                var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                var cardType = $(this).attr('cardType')
                var nickName = $scope.favoriteCookie.nickname
                var userId = $scope.favoriteCookie.id
                var goodsId = $rootScope.taocanRows[lifeIndex].goodsId
                var goodsName = $rootScope.taocanRows[lifeIndex].goodsName
                var supplierId = $rootScope.taocanRows[lifeIndex].supplierId
                var supplierName = $rootScope.taocanRows[lifeIndex].supplierName
                console.log(goodsId)
                console.log(userId)
                console.log(cardType)
                console.log($rootScope.taocanRows[lifeIndex])
                var lifedata = {
                    "nickName": nickName,
                    "goodsId": goodsId,
                    "goodsName": goodsName,
                    "goodsPrice": goodsPrice,
                    "goodsType": '1',
                    "supplierId": supplierId,
                    "supplierName": supplierName,
                    "cardType": cardType,
                    "userId": userId
                }
                console.log(lifedata)
                $.ajax({
                    url: ip + '/appShop/addGoodsToCar.htm',
                    type: 'POST',
                    data: lifedata,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.resultCode == '-1') {
                            // myService.setObject('userData', '')
                            // $('#cartSelect').fadeOut()
                            // $('#HOverlay').remove()
                            // $('#HCloseBtn').remove()
                            $('.allMask').hide()
                            $('#cartSelect2').hide()
                            $cookies.putObject('userData', '')
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 800,
                                content: data.resultDesc
                            })
                            setTimeout(function () {
                                location.href = '#/login'
                            }, 1100)
                        }
                        if (data.resultCode == '1') {
                            // $('#cartSelect').fadeOut()
                            // $('#HOverlay').remove()
                            // $('#HCloseBtn').remove()
                            $('.allMask').fadeOut()
                            $('#cartSelect2').fadeOut()
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 800,
                                content: data.resultDesc
                            })
                            setTimeout(function () {
                                location.href = '#/cart'
                            }, 1100)
                        }
                    }
                })
                $('.allMask').fadeOut()
                $('#cartSelect2').fadeOut()
            })
        }
    }
});
// 套餐服务详情
routeApp.controller('setMealDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    var id = $stateParams.id
    $scope.imgIp = ip
    $http.get(ip + '/appSetMeal/findSetMeal.htm?id=' + id).success(function (data) {
        //console.log(data)
        $scope.imgIp = ip;
        $scope.hiddenData={};
        $scope.data = data.object
        $scope.hiddenData.manDiscountPrice=$scope.data.manDiscountPrice;
        $scope.hiddenData.womanDiscountPriceNot=$scope.data.womanDiscountPriceNot;
        $scope.hiddenData.womanDiscountPriceYet=$scope.data.womanDiscountPriceYet;
        console.log($scope.hiddenData)
        data.object.manDiscountPrice=parseInt(data.object.manDiscountPrice);
        data.object.womanDiscountPriceNot=parseInt(data.object.womanDiscountPriceNot);
        data.object.womanDiscountPriceYet=parseInt(data.object.womanDiscountPriceYet);

        console.log($scope.data)
        $scope.addCart = function () {
            if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
                $('.detailSubmit').click(function () {
                    location.href = '#/login'
                })
            } else {
                $('.detailSubmit').hDialog({
                    box: '#cartSelect',
                    width: 230,
                    height: 200,
                    modalHide: false
                    // isOverlay: false
                })
                $('#cartSelect div').click(function () {
                    var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                    var cardType = $(this).attr('cardType')
                    var nickName = $scope.favoriteCookie.nickname
                    var goodsId = $scope.data.goodsId
                    var goodsName = $scope.data.goodsName
                    // var goodsType = $scope.data.goodsType
                    var supplierId = $scope.data.supplierId
                    var supplierName = $scope.data.supplierName
                    var userId = $scope.favoriteCookie.id
                    console.log(supplierName)
                    console.log(userId)
                    console.log(cardType)
                    $.ajax({
                        url: ip + '/appShop/addGoodsToCar.htm',
                        type: 'POST',
                        data: {
                            "nickName": nickName,
                            "goodsId": goodsId,
                            "goodsName": goodsName,
                            "goodsPrice": goodsPrice,
                            "goodsType": '1',
                            "supplierId": supplierId,
                            "supplierName": supplierName,
                            "cardType": cardType,
                            "userId": userId
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            if (data.resultCode == '-1') {
                                myService.setObject('userData', '')
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/login'
                                }, 1100)
                            }
                            if (data.resultCode == '1') {
                                $('#cartSelect').fadeOut()
                                $('#HOverlay').remove()
                                $('#HCloseBtn').remove()
                                $('#simple-dialogBox').dialogBox({
                                    hasMask: true,
                                    autoHide: true,
                                    time: 800,
                                    content: data.resultDesc
                                })
                                setTimeout(function () {
                                    location.href = '#/cart'
                                }, 1000)
                            }
                        }
                    })
                })
            }
        }
        $scope.addCart()




    })
    //点击全屏显示图片
    $('.detailNext').click(function () {
        console.log(1)
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=yes')
        $('#imgFullscreen').css('display', 'block')
        $('#imgFullscreen').siblings().css('display', 'none')
        $('.productsStyle').css('display', 'none')
    })
    $('#imgFullscreen').click(function () {
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no')
        $('#imgFullscreen').css('display', 'none')
        $(this).siblings().css('display', 'block')
        $('.productsStyle').css('display', 'none')
        $('#cartSelect').css('display', 'none')
    })
});

// 侧边栏套餐服务详情
routeApp.controller('setMealDetailCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip

    $scope.data = myService.getObject('slideData')
    $scope.hiddenData={}
    $scope.hiddenData.manDiscountPrice=$scope.data.manDiscountPrice;
    $scope.hiddenData.womanDiscountPriceNot=$scope.data.womanDiscountPriceNot;
    $scope.hiddenData.womanDiscountPriceYet=$scope.data.womanDiscountPriceYet;
    console.log($scope.hiddenData)
    $scope.data.manDiscountPrice=parseInt(myService.getObject('slideData').manDiscountPrice);
    $scope.data.womanDiscountPriceNot=parseInt(myService.getObject('slideData').womanDiscountPriceNot);
    $scope.data.womanDiscountPriceYet=parseInt(myService.getObject('slideData').womanDiscountPriceYet);
    console.log($scope.data)
    $scope.addCart = function () {
        if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
            $('.detailSubmit').click(function () {
                location.href = '#/login'
            })
        } else {
            $('.detailSubmit').hDialog({
                box: '#cartSelect',
                width: 230,
                height: 200,
                modalHide: false
                // isOverlay: false
            })
            $('#cartSelect div').click(function () {
                var goodsPrice = parseFloat($(this).attr('goodsPrice'))
                console.log(goodsPrice)
                var cardType = $(this).attr('cardType')
                var nickName = $scope.favoriteCookie.nickname
                var goodsId = $scope.data.goodsId
                var goodsName = $scope.data.goodsName
                // var goodsType = $scope.data.goodsType
                var supplierId = $scope.data.supplierId
                var supplierName = $scope.data.supplierName
                var userId = $scope.favoriteCookie.id
                console.log(supplierName)
                console.log(userId)
                console.log(cardType)
                $.ajax({
                    url: ip + '/appShop/addGoodsToCar.htm',
                    type: 'POST',
                    data: {
                        "nickName": nickName,
                        "goodsId": goodsId,
                        "goodsName": goodsName,
                        "goodsPrice": goodsPrice,
                        "goodsType": '1',
                        "supplierId": supplierId,
                        "supplierName": supplierName,
                        "cardType": cardType,
                        "userId": userId
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.resultCode == '-1') {
                            myService.setObject('userData', '')
                            $('#cartSelect').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 800,
                                content: data.resultDesc
                            })
                            setTimeout(function () {
                                location.href = '#/login'
                            }, 1100)
                        }
                        if (data.resultCode == '1') {
                            $('#cartSelect').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            $('#simple-dialogBox').dialogBox({
                                hasMask: true,
                                autoHide: true,
                                time: 800,
                                content: data.resultDesc
                            })
                            setTimeout(function () {
                                location.href = '#/cart'
                            }, 1000)
                        }
                    }
                })
            })
        }
    }
    $scope.addCart()

    //点击全屏显示图片
    $('.detailNext').click(function () {
        console.log(1)
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=yes')
        $('#imgFullscreen').css('display', 'block')
        $('#imgFullscreen').siblings().css('display', 'none')
        $('.productsStyle').css('display', 'none')
    })
    $('#imgFullscreen').click(function () {
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no')
        $('#imgFullscreen').css('display', 'none')
        $(this).siblings().css('display', 'block')
        $('.productsStyle').css('display', 'none')
        $('#cartSelect').css('display', 'none')
    })
});
// 韩一咨讯
routeApp.controller('healthNewsCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    //展示最新时间
    function showTime() {
        var date = new Date()
        var year = date.getFullYear() + "."
        var month = (date.getMonth() + 1) + "."
        month = (month < 10 ? "0" + month : month)
        var now = date.getDate() + " "
        now = (now < 10 ? "0" + now : now)
        var curDate = year + month + now
        console.log(curDate)
        $scope.curDate = curDate
    }
    showTime()
    // 轮播图接口
    $scope.imgIp = ip
    $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=1').success(function (data) {
        // $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=4' + '&programCode=MRYS').success(function (data) {
        console.log(data)
        $rootScope.selectRows = data.rows
    })
    //分类列表
    $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=2' + '&sign=-1').success(function (data) {
        console.log(data)
        $scope.caseList = data.rows
    })
    $('.timeWrap .right .clarify').click(function () {
        $('.timeWrap .right .selectContent').fadeIn()
    })

    $(document).click(function (e) {
        var _con = $('.timeWrap');   // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            $('.timeWrap .right .selectContent').fadeOut()
        }
    });
    $('.timeWrap .right .latest').click(function () {
        $rootScope.articleTitleHealth = '韩一资讯'
        $('.timeWrap .right .selectContent').fadeOut()
        $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=1').success(function (data) {
            // $http.get(ip + '/appCms/queryCmsInformation.htm?terminalType=4' + '&flag=4' + '&programCode=MRYS').success(function (data) {
            console.log(data)
            $rootScope.selectRows = data.rows
        })
    })
});
// 韩一咨讯详情
routeApp.controller('healthNewsDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    var id = $stateParams.id
    $scope.imgIp = ip
    $http.get(ip + '/appCms/queryHealthConsultation.htm?articleId=' + id).success(function (data) {
        var oldArticleContextStyle = data.object.articleContextStyle
        var newArticleContextStyle = $sce.trustAsHtml(oldArticleContextStyle);
        $scope.articleContextStyle = newArticleContextStyle
        console.log($scope.rows)
    })
});
// 购物车
routeApp.controller('cartCtrl', function ($scope, $rootScope, $http, myService) {
    $rootScope.isLogin()


    //判断是否登录
    if ($scope.favoriteCookie == undefined || $scope.favoriteCookie == '') {
        $('.emptyCart').siblings().hide()
        $('.mallHeader').show()
        $('.mallHeader').addClass('mallHeaderStatic')
        $('.bottomBlank').show()
        $('.footerNav').show()
        $('.emptyCart').show()
        $('body').css('backgroundColor', '#ffffff')
    } else {
        //获取购物车数据
        var userId = $scope.favoriteCookie.id
        $rootScope.userId = $scope.favoriteCookie.id
        $http.get(ip + '/appShop/queryMyCar.htm?userId=' + userId).success(function (data) {
            console.log(data)
            if (data.resultCode == -1) {
                console.log(data.resultDesc)
                $('.emptyCart').siblings().hide()
                $('.mallHeader').show()
                $('.mallHeader').addClass('mallHeaderStatic')
                $('.bottomBlank').show()
                $('.footerNav').show()
                $('.emptyCart').show()
                $('body').css('backgroundColor', '#ffffff')
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: data.resultDesc
                })
                setTimeout(function () {
                    location.href = '#/login'
                }, 1000)
                return false
            }
            if (data.rows.length < 1) {
                $('.emptyCart').siblings().hide()
                $('.mallHeader').show()
                $('.mallHeader').addClass('mallHeaderStatic')
                $('.bottomBlank').show()
                $('.footerNav').show()
                $('.emptyCart').show()
                $('body').css('backgroundColor', '#ffffff')
                return false
            }
            $scope.imgIp = ip
            $rootScope.cartRows = data.rows;
            //console.log(data.rows)
            for(var i=0;i<data.rows.length;i++){
                data.rows[i].goodsPrice=parseInt(data.rows[i].goodsPrice)
            }
            $scope.deleteGood = function (index) {
                console.log(this.item)
                $http.post(ip + '/appShop/delCarGoods.htm?ids=' + this.item.id + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
                    console.log(data)
                    if (data.resultCode == '1') {
                        $rootScope.cartRows.splice(index, 1)
                        window.location.reload()
                    }
                })
            }
            for (var i = 0; i < $rootScope.cartRows.length; i++) {
                $rootScope.cartRows[i].check = false
                if ($rootScope.cartRows[i].cardType == '0') {
                    $rootScope.cartRows[i].cardType = '男性'
                }
                if ($rootScope.cartRows[i].cardType == '1') {
                    $rootScope.cartRows[i].cardType = '女性未婚'
                }
                if ($rootScope.cartRows[i].cardType == '2') {
                    $rootScope.cartRows[i].cardType = '女性已婚'
                }
            }
        })
    }
});

// 账户管理
routeApp.controller('accountCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
    })
});
//地址管理指令(体检报告重复使用)
routeApp.directive('addressControl', function ($timeout, $rootScope, $http) {
    return {
        restrict: 'EACM',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {
                // $scope.$emit('ngAddress')
                // $('.addressSelectWrap .isDefaultSpan input').iCheck({
                //     radioClass: 'iradio_square-red',
                // })


                // mtree.js
                // Requires jquery.js and velocity.js (optional but recommended).
                // Copy the below function, add to your JS, and simply add a list <ul class=mtree> ... </ul>
                ; (function ($, window, document, undefined) {

                    // Only apply if mtree list exists
                    if ($('ul.mtree').length) {


                        // Settings
                        var collapsed = true; // Start with collapsed menu (only level 1 items visible)
                        var close_same_level = true; // Close elements on same level when opening new node.
                        var duration = 400; // Animation duration should be tweaked according to easing.
                        var listAnim = true; // Animate separate list items on open/close element (velocity.js only).
                        var easing = 'easeOutQuart'; // Velocity.js only, defaults to 'swing' with jquery animation.


                        // Set initial styles 
                        $('.mtree ul').css({ 'overflow': 'hidden', 'height': (collapsed) ? 0 : 'auto', 'display': (collapsed) ? 'none' : 'block' });

                        // Get node elements, and add classes for styling
                        var node = $('.mtree li:has(ul)');
                        node.each(function (index, val) {
                            $(this).children(':first-child').css('cursor', 'pointer')
                            $(this).addClass('mtree-node mtree-' + ((collapsed) ? 'closed' : 'open'));
                            $(this).children('ul').addClass('mtree-level-' + ($(this).parentsUntil($('ul.mtree'), 'ul').length + 1));
                        });

                        // Set mtree-active class on list items for last opened element
                        $('.mtree li > *:first-child').on('click.mtree-active', function (e) {
                            if ($(this).parent().hasClass('mtree-closed')) {
                                $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
                                $(this).parent().addClass('mtree-active');
                            } else if ($(this).parent().hasClass('mtree-open')) {
                                $(this).parent().removeClass('mtree-active');
                            } else {
                                $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
                                $(this).parent().toggleClass('mtree-active');
                            }
                        });

                        // Set node click elements, preferably <a> but node links can be <span> also
                        node.children(':first-child').on('click.mtree', function (e) {

                            // element vars
                            var el = $(this).parent().children('ul').first();
                            var isOpen = $(this).parent().hasClass('mtree-open');

                            // close other elements on same level if opening 
                            if ((close_same_level || $('.csl').hasClass('active')) && !isOpen) {
                                var close_items = $(this).closest('ul').children('.mtree-open').not($(this).parent()).children('ul');

                                // Velocity.js
                                if ($.Velocity) {
                                    close_items.velocity({
                                        height: 0
                                    }, {
                                            duration: duration,
                                            easing: easing,
                                            display: 'none',
                                            delay: 100,
                                            complete: function () {
                                                setNodeClass($(this).parent(), true)
                                            }
                                        });

                                    // jQuery fallback
                                } else {
                                    close_items.delay(100).slideToggle(duration, function () {
                                        setNodeClass($(this).parent(), true);
                                    });
                                }
                            }

                            // force auto height of element so actual height can be extracted
                            el.css({ 'height': 'auto' });

                            // listAnim: animate child elements when opening
                            if (!isOpen && $.Velocity && listAnim) el.find(' > li, li.mtree-open > ul > li').css({ 'opacity': 0 }).velocity('stop').velocity('list');

                            // Velocity.js animate element
                            if ($.Velocity) {
                                el.velocity('stop').velocity({
                                    //translateZ: 0, // optional hardware-acceleration is automatic on mobile
                                    height: isOpen ? [0, el.outerHeight()] : [el.outerHeight(), 0]
                                }, {
                                        queue: false,
                                        duration: duration,
                                        easing: easing,
                                        display: isOpen ? 'none' : 'block',
                                        begin: setNodeClass($(this).parent(), isOpen),
                                        complete: function () {
                                            if (!isOpen) $(this).css('height', 'auto');
                                        }
                                    });

                                // jQuery fallback animate element
                            } else {
                                setNodeClass($(this).parent(), isOpen);
                                el.slideToggle(duration);
                            }

                            // We can't have nodes as links unfortunately
                            e.preventDefault();
                        });

                        // Function for updating node class
                        function setNodeClass(el, isOpen) {
                            if (isOpen) {
                                el.removeClass('mtree-open').addClass('mtree-closed');
                            } else {
                                el.removeClass('mtree-closed').addClass('mtree-open');
                            }
                        }

                        // List animation sequence
                        if ($.Velocity && listAnim) {
                            $.Velocity.Sequences.list = function (element, options, index, size) {
                                $.Velocity.animate(element, {
                                    opacity: [1, 0],
                                    translateY: [0, -(index + 1)]
                                }, {
                                        delay: index * (duration / size / 2),
                                        duration: duration,
                                        easing: easing
                                    });
                            };
                        }

                        // Fade in mtree after classes are added.
                        // Useful if you have set collapsed = true or applied styles that change the structure so the menu doesn't jump between states after the function executes.
                        if ($('.mtree').css('opacity') == 0) {
                            if ($.Velocity) {
                                $('.mtree').css('opacity', 1).children().css('opacity', 0).velocity('list');
                            } else {
                                $('.mtree').show(200);
                            }
                        }
                    }
                }(jQuery, this, this.document));

            }
        }
    };
});
// 地址管理
routeApp.controller('addressControlCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    // var id = $stateParams.id
    $http.get(ip + '/appMember/queryMemberAddress.htm?userId=' + $scope.favoriteCookie.id + '&page=1' + '&limit=20').success(function (data) {
        console.log(data)
        $rootScope.addressData = data
        $scope.setDefault = function () {
            $http.post(ip + '/appMember/forDefaultAddress.htm?userId=' + $scope.favoriteCookie.id + '&id=' + this.item.id).success(function (data) {
                console.log(data)
                if (data.resultCode == '1') {
                    // window.location.reload()
                    $http.get(ip + '/appMember/queryMemberAddress.htm?userId=' + $scope.favoriteCookie.id + '&page=1' + '&limit=20').success(function (data) {
                        $rootScope.addressData = data
                    })
                } else {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: data.resultDesc
                    })
                }
            })
        }
    })
    $scope.clearData = function () {
        myService.setObject('curProvince', '')
        myService.setObject('curCity', '')
        myService.setObject('curCounty', '')
        myService.setObject('addConsignee', '')
        myService.setObject('addMobilePhone', '')
        myService.setObject('addAddressLast', '')
    }
    //编辑地址
    $scope.editAddress = function () {
        myService.setObject('editAddressData', this.item)
        myService.setObject('editAddressDataId', this.item.id)
        myService.setObject('curProvince', '')
        myService.setObject('curCity', '')
        myService.setObject('curCounty', '')
        myService.setObject('addConsignee', '')
        myService.setObject('addMobilePhone', '')
        myService.setObject('addAddressLast', '')
        window.location.href = '#/editAddress'
    }
    //删除地址
    $scope.deleteAddress = function () {
        console.log(this.item)
        myService.setObject('deleteOneAddress', this.item)
        $('#confirmLayer').dialogBox({
            hasClose: false,
            hasBtn: true,
            width: 200,
            confirmValue: '确定',
            confirm: function () {
                console.log('确定')
                $scope.deleteOneAddress = myService.getObject('deleteOneAddress')
                $http.post(ip + '/appMember/deleteMemberAddress.htm?ids=' + $scope.deleteOneAddress.id).success(function (data) {
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#simple-dialogBox').dialogBox({
                            hasMask: true,
                            autoHide: true,
                            time: 800,
                            content: data.resultDesc
                        })
                        setTimeout(function () {
                            window.location.reload()
                        }, 1100)
                    }
                })
            },
            cancelValue: '取消',
            title: '',
            content: '是否删除该地址？'
        })

    }
});

// 填写订单
routeApp.controller('editOrderCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.checkData = myService.getObject('checkData')
    $scope.sumTotal = myService.getObject('sumTotal')
    //获取用户选择的地址
    $scope.checkedAddressData = myService.getObject('checkedAddressData')
    //console.log($scope.checkedAddressData)
    //console.log($scope.checkedAddressData.id)
    //获取用户选择的配送方式
    $scope.checkDeliveryWay = myService.getObject('checkDeliveryWay')
    //console.log($scope.checkDeliveryWay)
    $http.get(ip + '/appMember/queryMemberAddress.htm?userId=' + $scope.favoriteCookie.id + '&page=1' + '&limit=20').success(function (data) {
        //console.log(data)
        $scope.orderAddressData = data
        console.log($scope.orderAddressData)
        //console.log($scope.orderAddressData.rows.length)
        //console.log($scope.sumTotal)
        //console.log('yixuan')
        //console.log($scope.checkData)
        var ids = ''
        for (var i = 0; i < $scope.checkData.length; i++) {
            console.log($scope.checkData[i].id)
            ids += $scope.checkData[i].id + ','
        }
        //console.log(ids)
        // var ids = $scope.checkData[0].goodsId
        var userId = $scope.favoriteCookie.id
        var userName = $scope.favoriteCookie.nickname
        if ($scope.orderAddressData.rows.length > 0) {
            var addressId = $scope.orderAddressData.rows[0].id
        } else {
            $('.namePhone').text('请增加收货地址')
        }
        if ($scope.checkedAddressData.id != undefined) {
            var addressId = $scope.checkedAddressData.id
        }
        //获取配送方式（设置默认配送方式）
        $http.get(ip + '/appShop/getDeliveryMethod.htm').success(function (data) {
            //console.log(data)
            $scope.deliveryMethodRows = data.rows
            console.log($scope.deliveryMethodRows)
            $scope.defaultDelivery = $scope.deliveryMethodRows[1]
            $scope.deliveryMethod = $scope.defaultDelivery.methodName
            if ($scope.checkDeliveryWay.id != undefined) {
                $scope.deliveryMethod = $scope.checkDeliveryWay.methodName
                $scope.defaultDelivery = {}
                console.log($scope.defaultDelivery.remark)
            }
            $scope.confirmOrderData = {
                "ids": ids,
                "orderChannel": '4',
                "userId": userId,
                "userName": userName,
                "addressId": addressId,
                "deliveryMethod": $scope.deliveryMethod
            }
        })


        $scope.confirmOrder = function () {
            console.log($scope.confirmOrderData)
            if ($('.namePhone').text() == '请增加收货地址') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '请增加收货地址'
                })
                return false
            }
            $.ajax({
                url: ip + '/appShop/createOrderTemp.htm',
                type: 'POST',
                data: $scope.confirmOrderData,
                dataType: 'json',
                success: function (data) {
                    console.log('确认订单')
                    console.log(data)
                    myService.setObject('orderData', data)
                    if (data.resultCode == '1') {
                        location.href = '#/goPay'
                    }
                    else {
                        $('#simple-dialogBox').dialogBox({
                            hasMask: true,
                            autoHide: true,
                            time: 800,
                            content: data.resultDesc
                        })
                    }
                }
            })
        }
    })
});

// 填写订单下一步  去支付
routeApp.controller('goPayCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.checkData = myService.getObject('checkData')
    $scope.sumTotal = myService.getObject('sumTotal')
    $scope.orderData = myService.getObject('orderData')
    console.log($scope.orderData)
    $http.get(ip + '/appShop/alipayPay.htm?orderNo=' + $scope.orderData.resultData + '&flag=1').success(function (data) {
        console.log(data)
        $("#zhifupay").attr("href", "https://openapi.alipay.com/gateway.do?" + data.resultData)
    })
});

// 订单详情跳转去支付页面
routeApp.controller('goPayDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.orderDetailData = myService.getObject('goPayOrder')

    console.log($scope.orderDetailData)
    // $scope.orderData = myService.getObject('orderData')
    $http.get(ip + '/appShop/alipayPay.htm?orderNo=' + $scope.orderDetailData.orderNo + '&flag=1').success(function (data) {
        console.log(data)
        $("#zhifupay").attr("href", "https://openapi.alipay.com/gateway.do?" + data.resultData)
    })
});
// //选择配送支付方式指令
// routeApp.directive('deliveryWay', function ($timeout, $rootScope, $http) {
//     return {
//         restrict: 'A',
//         link: function ($scope, $apply, element, attr) {
//             if ($scope.$last === true) {
//                 // $('.addressSelectWrap .isDefaultSpan input').iCheck({
//                 //     radioClass: 'iradio_square-red',
//                 // })
//                 console.log($('.deliveryWay .payBtn'))

//             }
//         }
//     };
// });

// 选择配送支付方式
routeApp.controller('deliveryWayCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    // $scope.orderDetailData = myService.getObject('goPayOrder')

    // console.log($scope.orderDetailData)
    // // $scope.orderData = myService.getObject('orderData')
    //获取配送方式
    $http.get(ip + '/appShop/getDeliveryMethod.htm').success(function (data) {
        console.log(data)
        $scope.deliveryMethod = data.rows
        $scope.deliveryMethod[0].check = true
        myService.setObject('checkDeliveryWay', $scope.deliveryMethod[0])
    })
    $scope.selectDeliveryWay = function () {
        console.log(this.item)
        for (var i = 0; i < $scope.deliveryMethod.length; i++) {
            $scope.deliveryMethod[i].check = false
        }
        this.item.check = true
        console.log(this.item)
        myService.setObject('checkDeliveryWay', this.item)
    }
});


// 编辑体检人信息
routeApp.controller('editInfoCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    // $rootScope.isLogin()
    // $scope.imgIp = ip
    // $scope.checkData = myService.getObject('checkData')
    // $scope.sumTotal = myService.getObject('sumTotal')
    // $scope.orderData = myService.getObject('orderData')
    // console.log($scope.orderData)
    // $http.get(ip + '/appShop/alipayPay.htm?orderNo=' + $scope.orderData.resultData +'&flag=1').success(function (data) {
    //     console.log(data)
    //     $("#zhifupay").attr("href", "https://openapi.alipay.com/gateway.do?" + data.resultData)
    // })


    //获取选择后的已购买套餐数据
    $scope.yigouMeal = myService.getObject('yigouMeal')
    $scope.yixuanMeal = myService.getObject('curSelectMeal')
    $scope.appointmentType = myService.getObject('appointmentType')
    console.log(2)
    // if ($scope.appointmentType == '2') {
    //     $('.yigouMeal').hide()
    // } else {
    //     $('.yixuanMeal').hide()
    // }
    console.log($scope.yigouMeal)
    $rootScope.tijianData = {}


    //日期选择
    var curDate = new Date();
    var newDate=new Date(curDate.setDate(curDate.getDate()+1));
    if(curDate.getHours()>9){
        newDate=newDate;
    }else{
        newDate=curDate;
    }
    var currYear = (new Date()).getFullYear();
    var opt = {}
    opt.date = {
        preset: 'date'
    }
    opt.time = { preset: 'time', minDate: new Date(2012, 3, 10, 7, 30), maxDate: new Date(2014, 7, 30, 9, 30), stepMinute: 5 };
    opt.datetime = {
        preset: 'datetime'
    }
    // opt.time = {
    //     preset: 'time'
    // };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        lang: 'zh',
        minDate: newDate, //开始年份
        endYear: currYear + 100 //结束年份
    };
    opt.tijianTime = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式  
        lang: 'zh',
        // stepHour: 1,
        stepMinute: 30,
        // minDate: new Date(), //开始年份
        // endYear: currYear + 100 //结束年份
    };
    $("#tijianDate").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    $("#tijianDate").scroller('setDate',newDate,true)
    // $("#tijianDate").val('').scroller('destroy').scroller($.extend(opt['time'], opt['tijianTime']));
    $("#tijianTime").val('').scroller('destroy').scroller($.extend(opt['time'], opt['tijianTime']));
    // var optDateTime = $.extend(opt['datetime'], opt['default']);
    // var optTime = $.extend(opt['time'], opt['default']);
    // $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    // $("#appTime").mobiscroll(optTime).time(optTime); 
    //下面注释部分是上面的参数可以替换改变它的样式
    //希望一起研究插件的朋友加我个人QQ也可以，本人也建个群 291464597 欢迎进群交流。哈哈。这个不能算广告。
    // 直接写参数方法
    //$("#scroller").mobiscroll(opt).date(); 
    // Shorthand for: $("#scroller").mobiscroll({ preset: 'date' });
    //具体参数定义如下
    //{
    //preset: 'date', //日期类型--datatime --time,
    //theme: 'ios', //皮肤其他参数【android-ics light】【android-ics】【ios】【jqm】【sense-ui】【sense-ui】【sense-ui】
    //【wp light】【wp】
    //mode: "scroller",//操作方式【scroller】【clickpick】【mixed】
    //display: 'bubble', //显示方【modal】【inline】【bubble】【top】【bottom】
    //dateFormat: 'yyyy-mm-dd', // 日期格式
    //setText: '确定', //确认按钮名称
    //cancelText: '清空',//取消按钮名籍我
    //dateOrder: 'yymmdd', //面板中日期排列格
    //dayText: '日', 
    //monthText: '月',
    //yearText: '年', //面板中年月日文字
    //startYear: (new Date()).getFullYear(), //开始年份
    //endYear: (new Date()).getFullYear() + 9, //结束年份
    //showNow: true,
    //nowText: "明天",  //
    //showOnFocus: false,
    //height: 45,
    //width: 90,
    //rows: 3,
    //minDate: new Date()  从当前年，当前月，当前日开始}

    // 当预约方式为第三种（选择套餐后预约）
    if ($scope.appointmentType == '2') {
        $('.yigouMeal').hide()
        //已未婚选择框
        $('#yiweiInput').hDialog({
            box: '#yiweiSelect',
            width: 230,
            height: 170,
            modalHide: false,
            isOverlay: false
        })

        $('#yiweiSelect div').click(function () {
            $('#yiweiInput').val($(this).text().trim())
            $('#yiweiSelect').hide()
            $('#HOverlay').remove()
            $('#HCloseBtn').remove()
        })

        //性别选择框
        $('#sexInput').hDialog({
            box: '#sexSelect',
            width: 230,
            height: 170,
            modalHide: false,
            isOverlay: false
        })
        $('#sexSelect div').click(function () {
            $('#sexInput').val($(this).text().trim())
            $('#sexSelect').hide()
            $('#HOverlay').remove()
            $('#HCloseBtn').remove()
        })

        //提交体检人信息
        $scope.confirmAppoint = function () {
            if ($('#yiweiInput').val() == '未婚') {
                var maritalStatus3 = 1
            } else if ($('#yiweiInput').val() == '已婚') {
                var maritalStatus3 = 2
            }
            if ($('#sexInput').val() == '女') {
                var userSex3 = 1
            } else if ($('#sexInput').val() == '男') {
                var userSex3 = 2
            }
            var personName = $('#personName').val()
            var telephone = $('#telephone').val()
            var userCard = $('#userCard').val()
            var appointmentTime = $('#tijianDate').val() + ' ' + $('#tijianTime').val() + ':00'
            var age = parseInt($('#tijianAge').val())
            var height = parseFloat($('#tijianHeight').val())
            var weight = parseFloat($('#tijianWeight').val())
            $scope.maritalStatus = myService.getObject('maritalStatus')
            $scope.userSex = myService.getObject('userSex')
            console.log(appointmentTime)
            $rootScope.tijianData = {
                setMealId: $scope.yixuanMeal.id,
                setMealName: $scope.yixuanMeal.name,
                appointmentTime: appointmentTime,
                appointmentType: $scope.appointmentType,
                // cardNo: $scope.yigouMeal.cardNo,
                // cardId: $scope.yigouMeal.cardId,
                userId: $scope.favoriteCookie.id,
                age: age,
                height: height,
                weight: weight,
                personName: personName,
                telephone: telephone,
                userCard: userCard,
                maritalStatus: maritalStatus3,
                userSex: userSex3
            }
            console.log($rootScope.tijianData)
            console.log(personName)
            if (personName == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '姓名不能为空！'
                })
                return false
            }
            if (telephone == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号不能为空！'
                })
                return false
            }
            var checkMsg = ''
            //手机验证
            function testNumbers() {
                var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
                var value = $('#telephone').val()
                if (isMob.test(value)) {
                    return true
                }
                else {
                    checkMsg += '手机号格式不正确！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '手机号格式不正确！'
                    })
                    return false
                }
            }
            testNumbers()
            if (userCard == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身份证号不能为空！'
                })
                return false
            }
            // 验证身份证号
            function testMid() {
                var code = $('#userCard').val()

                var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
                var tip = "";
                var pass = true;
                if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                    tip = "身份证号格式错误!";
                    pass = false;
                }

                else if (!city[code.substr(0, 2)]) {
                    tip = "地址编码错误!";
                    pass = false;
                }
                else {
                    //18位身份证需要验证最后一位校验位
                    if (code.length == 18) {
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++) {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if (parity[sum % 11] != code[17]) {
                            tip = "身份证号错误!";
                            pass = false;
                        }
                    }
                }
                if (!pass) {
                    checkMsg += tip += '\n'
                    // alert(tip);
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: tip
                    })
                }
                return pass;
            }
            testMid()
            if ($('#tijianAge').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianAge').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '年龄请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '年龄请输入整数！'
                    })
                    return false
                }
            }
            isNumbers()
            if ($('#tijianHeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers1() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianHeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '身高请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '身高请输入整数！'
                    })
                    return false
                }
            }
            isNumbers1()
            if ($('#tijianWeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '体重不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers2() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianWeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '体重请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '体重请输入整数！'
                    })
                    return false
                }
            }
            isNumbers2()
            if ($('#tijianDate').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择日期！'
                })
                return false
            }
            if ($('#tijianTime').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择时间！'
                })
                return false
            }
            if (checkMsg != '') {
                console.log(checkMsg)
                return false
            }
            $.ajax({
                url: ip + '/appAppointment/appointSetMeal.htm',
                type: 'POST',
                data: $rootScope.tijianData,
                dataType: 'json',
                success: function (data) {
                    // console.log('确认订单')
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#confirmFrame').hDialog({
                            width: 250,
                            height: 170,
                            modalHide: false,
                            isOverlay: false,
                            autoShow: true,
                            closeHide: false
                        })
                        $scope.myAppoint = function () {
                            $('#confirmFrame').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            setTimeout(function () {
                                location.href = '#/myAppoint'
                            }, 200);
                        }
                    }
                }
            })
        }
    } else {
        $('.yixuanMeal').hide()
        if ($scope.yigouMeal.cardType == '2') {
            $('#yiweiInput').val('已婚')
            myService.setObject('maritalStatus', '2')
            $('#sexInput').val('女')
            myService.setObject('userSex', '1')
            $('#yiweiInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡婚姻状况不能再修改！'
                })
            })
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })

        } else if ($scope.yigouMeal.cardType == '1') {
            $('#yiweiInput').val('未婚')
            myService.setObject('maritalStatus', '1')
            $('#sexInput').val('女')
            myService.setObject('userSex', '1')
            $('#yiweiInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡婚姻状况不能再修改！'
                })
            })
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })

        } else if ($scope.yigouMeal.cardType == '0') {
            $('#yiweiInput').val('已婚')
            myService.setObject('maritalStatus', '2')
            // $rootScope.tijianData.maritalStatus = '2'
            $('#sexInput').val('男')
            myService.setObject('userSex', '2')
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })
            //已未婚选择框
            $('#yiweiInput').hDialog({
                box: '#yiweiSelect',
                width: 230,
                height: 170,
                modalHide: false,
                isOverlay: false
            })
            //可以选择已未婚情况
            $('#yiweiSelect div').click(function () {
                $('#yiweiInput').val($(this).text().trim())
                if ($('#yiweiInput').val() == '未婚') {
                    myService.setObject('maritalStatus', '1')
                }
                if ($('#yiweiInput').val() == '已婚') {
                    myService.setObject('maritalStatus', '2')
                }
                console.log($rootScope.tijianData.maritalStatus)
                $('#yiweiSelect').hide()
                $('#HOverlay').remove()
                $('#HCloseBtn').remove()
            })
        }



        //提交体检人信息
        $scope.confirmAppoint = function () {
            var personName = $('#personName').val()
            var telephone = $('#telephone').val()
            var userCard = $('#userCard').val()
            var appointmentTime = $('#tijianDate').val() + ' ' + $('#tijianTime').val() + ':00'
            var age = parseInt($('#tijianAge').val())
            var height = parseFloat($('#tijianHeight').val())
            var weight = parseFloat($('#tijianWeight').val())
            $scope.maritalStatus = myService.getObject('maritalStatus')
            $scope.userSex = myService.getObject('userSex')
            console.log(appointmentTime)
            $rootScope.tijianData = {
                setMealId: $scope.yigouMeal.setMealId,
                setMealName: $scope.yigouMeal.cardName,
                appointmentTime: appointmentTime,
                appointmentType: $scope.appointmentType,
                cardNo: $scope.yigouMeal.cardNo,
                cardId: $scope.yigouMeal.cardId,
                userId: $scope.favoriteCookie.id,
                age: age,
                height: height,
                weight: weight,
                personName: personName,
                telephone: telephone,
                userCard: userCard,
                maritalStatus: $scope.maritalStatus,
                userSex: $scope.userSex
            }
            console.log($rootScope.tijianData)
            console.log(personName)
            var checkMsg = ''
            if (personName == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '姓名不能为空！'
                })
                return false
            }
            if (telephone == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号不能为空！'
                })
                return false
            }
            //手机验证
            function testNumbers() {
                var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
                var value = $('#telephone').val()
                if (isMob.test(value)) {
                    return true
                }
                else {
                    checkMsg += '手机号格式不正确！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '手机号格式不正确！'
                    })
                    return false
                }
            }
            testNumbers()
            if (userCard == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身份证号不能为空！'
                })
                return false
            }
            // 验证身份证号
            function testMid() {
                var code = $('#userCard').val()

                var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
                var tip = "";
                var pass = true;
                if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                    tip = "身份证号格式错误!";
                    pass = false;
                }

                else if (!city[code.substr(0, 2)]) {
                    tip = "地址编码错误!";
                    pass = false;
                }
                else {
                    //18位身份证需要验证最后一位校验位
                    if (code.length == 18) {
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++) {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if (parity[sum % 11] != code[17]) {
                            tip = "身份证号错误!";
                            pass = false;
                        }
                    }
                }
                if (!pass) {
                    checkMsg += tip + '\n'
                    // alert(tip);
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: tip
                    })
                }
                return pass;
            }
            testMid()
            if ($('#tijianAge').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianAge').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '年龄请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '年龄请输入整数！'
                    })
                    return false
                }
            }
            isNumbers()
            if ($('#tijianHeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers1() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianHeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '身高请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '身高请输入整数！'
                    })
                    return false
                }
            }
            isNumbers1()
            if ($('#tijianWeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '体重不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers2() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianWeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '体重请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '体重请输入整数！'
                    })
                    return false
                }
            }
            isNumbers2()
            if ($('#tijianDate').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择日期！'
                })
                return false
            }
            if ($('#tijianTime').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择时间！'
                })
                return false
            }
            if (checkMsg != '') {
                console.log(checkMsg)
                return false
            }
            $.ajax({
                url: ip + '/appAppointment/appointSetMeal.htm',
                type: 'POST',
                data: $rootScope.tijianData,
                dataType: 'json',
                success: function (data) {
                    // console.log('确认订单')
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#confirmFrame').hDialog({
                            width: 250,
                            height: 170,
                            modalHide: false,
                            isOverlay: false,
                            autoShow: true,
                            closeHide: false
                        })
                        $scope.myAppoint = function () {
                            $('#confirmFrame').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            setTimeout(function () {
                                location.href = '#/myAppoint'
                            }, 200);
                        }
                    }
                }
            })
        }
    }
});
//重用editInfoCtrl***********************************
// 编辑体检人信息
routeApp.controller('editInfoCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {

    //获取选择后的已购买套餐数据
    $scope.yigouMeal = myService.getObject('yigouMeal')
    $scope.yixuanMeal = myService.getObject('curSelectMeal')
    $scope.appointmentType = myService.getObject('appointmentType')
    // 获取选择的联系人信息
    $scope.membersData = myService.getObject('membersData')
    //console.log(2)
    //console.log($scope.membersData)
    //
    //console.log($scope.yigouMeal)
    //console.log($scope.appointmentType)
    $rootScope.tijianData = {}




    //日期选择
    var currYear = (new Date()).getFullYear();
    var curDate = new Date();
    var newDate=new Date(curDate.setDate(curDate.getDate()+1));
    if(curDate.getHours()>9){
        newDate=newDate;
    }else{
        newDate=curDate;
    }
    var opt = {};
    opt.date = {
        preset: 'date'
    };
    opt.time = { preset: 'time', minDate: new Date(2012, 3, 10, 7, 30), maxDate: new Date(2014, 7, 30, 9, 30), stepMinute: 5 };
    opt.datetime = {
        preset: 'datetime'
    };
    // opt.time = {
    //     preset: 'time'
    // };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        lang: 'zh',
        minDate: new Date(), //开始年份
        endYear: currYear + 100 //结束年份
    };
    opt.tijianTime = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式  
        lang: 'zh',
        // stepHour: 1,
        stepMinute: 30,
        // minDate: new Date(), //开始年份
        // endYear: currYear + 100 //结束年份
    };
    $("#tijianDate").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    $("#tijianDate").scroller('setDate',newDate,true)
    // $("#tijianDate").val('').scroller('destroy').scroller($.extend(opt['time'], opt['tijianTime']));
    $("#tijianTime").val('').scroller('destroy').scroller($.extend(opt['time'], opt['tijianTime']));
    // var optDateTime = $.extend(opt['datetime'], opt['default']);
    // var optTime = $.extend(opt['time'], opt['default']);
    // $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    // $("#appTime").mobiscroll(optTime).time(optTime); 
    //下面注释部分是上面的参数可以替换改变它的样式
    //希望一起研究插件的朋友加我个人QQ也可以，本人也建个群 291464597 欢迎进群交流。哈哈。这个不能算广告。
    // 直接写参数方法
    //$("#scroller").mobiscroll(opt).date(); 
    // Shorthand for: $("#scroller").mobiscroll({ preset: 'date' });
    //具体参数定义如下
    //{
    //preset: 'date', //日期类型--datatime --time,
    //theme: 'ios', //皮肤其他参数【android-ics light】【android-ics】【ios】【jqm】【sense-ui】【sense-ui】【sense-ui】
    //【wp light】【wp】
    //mode: "scroller",//操作方式【scroller】【clickpick】【mixed】
    //display: 'bubble', //显示方【modal】【inline】【bubble】【top】【bottom】
    //dateFormat: 'yyyy-mm-dd', // 日期格式
    //setText: '确定', //确认按钮名称
    //cancelText: '清空',//取消按钮名籍我
    //dateOrder: 'yymmdd', //面板中日期排列格
    //dayText: '日', 
    //monthText: '月',
    //yearText: '年', //面板中年月日文字
    //startYear: (new Date()).getFullYear(), //开始年份
    //endYear: (new Date()).getFullYear() + 9, //结束年份
    //showNow: true,
    //nowText: "明天",  //
    //showOnFocus: false,
    //height: 45,
    //width: 90,
    //rows: 3,
    //minDate: new Date()  从当前年，当前月，当前日开始}

    // 当预约方式为第三种（选择套餐后预约）
    if ($scope.appointmentType == '2') {
        // 赋值选择的联系人信息
        if ($scope.membersData.maritalStatus == '1') {
            $('#yiweiInput').val('未婚')
        } else if ($scope.membersData.maritalStatus == '2') {
            $('#yiweiInput').val('已婚')
        }
        if ($scope.membersData.userSex == '1') {
            $('#sexInput').val('女')
        } else if ($scope.membersData.userSex == '2') {
            $('#sexInput').val('男')
        }
        $('#personName').val($scope.membersData.personName)
        $('#telephone').val($scope.membersData.telephone)
        $('#userCard').val($scope.membersData.userCard)
        $('#tijianAge').val($scope.membersData.age)
        $('#tijianHeight').val($scope.membersData.height)
        $('#tijianWeight').val($scope.membersData.weight)
        $('.yigouMeal').hide()
        //已未婚选择框
        $('#yiweiInput').hDialog({
            box: '#yiweiSelect',
            width: 230,
            height: 170,
            modalHide: false,
            isOverlay: false
        })

        $('#yiweiSelect div').click(function () {
            $('#yiweiInput').val($(this).text().trim())
            $('#yiweiSelect').hide()
            $('#HOverlay').remove()
            $('#HCloseBtn').remove()
        })

        //性别选择框
        $('#sexInput').hDialog({
            box: '#sexSelect',
            width: 230,
            height: 170,
            modalHide: false,
            isOverlay: false
        })
        $('#sexSelect div').click(function () {
            $('#sexInput').val($(this).text().trim())
            $('#sexSelect').hide()
            $('#HOverlay').remove()
            $('#HCloseBtn').remove()
        })

        //提交体检人信息
        $scope.confirmAppoint = function () {
            var personName = $('#personName').val()
            var telephone = $('#telephone').val()
            var userCard = $('#userCard').val()
            var appointmentTime = $('#tijianDate').val() + ' ' + $('#tijianTime').val() + ':00'
            var age = parseInt($('#tijianAge').val())
            var height = parseFloat($('#tijianHeight').val())
            var weight = parseFloat($('#tijianWeight').val())
            if ($('#yiweiInput').val() == '未婚') {
                var maritalStatus3 = 1
            } else if ($('#yiweiInput').val() == '已婚') {
                var maritalStatus3 = 2
            }
            if ($('#sexInput').val() == '女') {
                var userSex3 = 1
            } else if ($('#sexInput').val() == '男') {
                var userSex3 = 2
            }
            // $scope.maritalStatus = myService.getObject('maritalStatus')
            // $scope.userSex = myService.getObject('userSex')
            console.log(appointmentTime)
            $rootScope.tijianData = {
                setMealId: $scope.yixuanMeal.id,
                setMealName: $scope.yixuanMeal.name,
                appointmentTime: appointmentTime,
                appointmentType: $scope.appointmentType,
                // cardNo: $scope.yigouMeal.cardNo,
                // cardId: $scope.yigouMeal.cardId,
                userId: $scope.favoriteCookie.id,
                age: age,
                height: height,
                weight: weight,
                personName: personName,
                telephone: telephone,
                userCard: userCard,
                maritalStatus: maritalStatus3,
                userSex: userSex3
            }
            console.log($rootScope.tijianData)
            var checkMsg = ''
            if (personName == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '姓名不能为空！'
                })
                return false
            }
            if (telephone == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号不能为空！'
                })
                return false
            }
            //手机验证
            function testNumbers() {
                var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
                var value = $('#telephone').val()
                if (isMob.test(value)) {
                    return true
                }
                else {
                    checkMsg += '手机号格式不正确！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '手机号格式不正确！'
                    })
                    return false
                }
            }
            testNumbers()
            if (userCard == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身份证号不能为空！'
                })
                return false
            }
            // 验证身份证号
            function testMid() {
                var code = $('#userCard').val()

                var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
                var tip = "";
                var pass = true;
                if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                    tip = "身份证号格式错误!";
                    pass = false;
                }

                else if (!city[code.substr(0, 2)]) {
                    tip = "地址编码错误!";
                    pass = false;
                }
                else {
                    //18位身份证需要验证最后一位校验位
                    if (code.length == 18) {
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++) {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if (parity[sum % 11] != code[17]) {
                            tip = "身份证号错误!";
                            pass = false;
                        }
                    }
                }
                if (!pass) {
                    // alert(tip);
                    checkMsg += tip + '\n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: tip
                    })
                }
                return pass;
            }
            testMid()
            if ($('#tijianAge').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianAge').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '年龄请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '年龄请输入整数！'
                    })
                    return false
                }
            }
            isNumbers()
            if ($('#tijianHeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers1() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianHeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '身高请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '身高请输入整数！'
                    })
                    return false
                }
            }
            isNumbers1()
            if ($('#tijianWeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '体重不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers2() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianWeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '体重请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '体重请输入整数！'
                    })
                    return false
                }
            }
            isNumbers2()
            if ($('#tijianDate').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择日期！'
                })
                return false
            }
            if ($('#tijianTime').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择时间！'
                })
                return false
            }
            if (checkMsg != '') {
                console.log(checkMsg)
                return false
            }
            $.ajax({
                url: ip + '/appAppointment/appointSetMeal.htm',
                type: 'POST',
                data: $rootScope.tijianData,
                dataType: 'json',
                success: function (data) {
                    // console.log('确认订单')
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#confirmFrame').hDialog({
                            width: 250,
                            height: 170,
                            modalHide: false,
                            isOverlay: false,
                            autoShow: true,
                            closeHide: false
                        })
                        $scope.myAppoint = function () {
                            $('#confirmFrame').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            setTimeout(function () {
                                location.href = '#/myAppoint'
                            }, 200);
                        }
                    }
                }
            })
        }
    } else {
        $('.yixuanMeal').hide()
        if ($scope.yigouMeal.cardType == '2') {
            console.log(89898989898)
            if ($scope.membersData.maritalStatus == '2' && $scope.membersData.userSex == '1') {
                var maritalStatus = '已婚'
                var userSex = '女'
                $('#personName').val($scope.membersData.personName)
                $('#telephone').val($scope.membersData.telephone)
                $('#userCard').val($scope.membersData.userCard)
                $('#tijianAge').val($scope.membersData.age)
                $('#tijianHeight').val($scope.membersData.height)
                $('#tijianWeight').val($scope.membersData.weight)
                // $('#yiweiInput').val(maritalStatus)
                // $('#sexInput').val(userSex)
            } else {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1100,
                    content: '此体检卡只适用于女已婚！'
                })
                return false
            }
            //****************** */
            $('#yiweiInput').val('已婚')
            myService.setObject('maritalStatus', '2')
            $('#sexInput').val('女')
            myService.setObject('userSex', '1')
            $('#yiweiInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡婚姻状况不能再修改！'
                })
            })
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })

        } else if ($scope.yigouMeal.cardType == '1') {
            if ($scope.membersData.maritalStatus == '1' && $scope.membersData.userSex == '1') {
                $('#personName').val($scope.membersData.personName)
                $('#telephone').val($scope.membersData.telephone)
                $('#userCard').val($scope.membersData.userCard)
                $('#tijianAge').val($scope.membersData.age)
                $('#tijianHeight').val($scope.membersData.height)
                $('#tijianWeight').val($scope.membersData.weight)
            } else {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1100,
                    content: '此体检卡只适用于女未婚！'
                })
                return false
            }

            $('#yiweiInput').val('未婚')
            myService.setObject('maritalStatus', '1')
            $('#sexInput').val('女')
            myService.setObject('userSex', '1')
            $('#yiweiInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡婚姻状况不能再修改！'
                })
            })
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })

        } else if ($scope.yigouMeal.cardType == '0') {
            //$('#yiweiInput').val('已婚')
            myService.setObject('maritalStatus', '2')
            $('#sexInput').val('男')
            myService.setObject('userSex', '2')
            if ($scope.membersData.maritalStatus == '1' && $scope.membersData.userSex == '2') {
                $('#personName').val($scope.membersData.personName)
                $('#telephone').val($scope.membersData.telephone)
                $('#userCard').val($scope.membersData.userCard)
                $('#tijianAge').val($scope.membersData.age)
                $('#tijianHeight').val($scope.membersData.height)
                $('#tijianWeight').val($scope.membersData.weight)
                var maritalStatus = '未婚'
                $('#yiweiInput').val(maritalStatus)
                myService.setObject('maritalStatus', '1')
            } else if ($scope.membersData.maritalStatus == '2' && $scope.membersData.userSex == '2') {
                $('#personName').val($scope.membersData.personName)
                $('#telephone').val($scope.membersData.telephone)
                $('#userCard').val($scope.membersData.userCard)
                $('#tijianAge').val($scope.membersData.age)
                $('#tijianHeight').val($scope.membersData.height)
                $('#tijianWeight').val($scope.membersData.weight)
                var maritalStatus = '已婚'
                $('#yiweiInput').val(maritalStatus)
                myService.setObject('maritalStatus', '2')
            } else {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1100,
                    content: '此体检卡只适用于男性！'
                })
                return false
            }
            $('#sexInput').click(function () {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1300,
                    content: '此体检卡性别不能再修改！'
                })
            })
            //已未婚选择框
            $('#yiweiInput').hDialog({
                box: '#yiweiSelect',
                width: 230,
                height: 170,
                modalHide: false,
                isOverlay: false
            })
            //可以选择已未婚情况
            $('#yiweiSelect div').click(function () {
                $('#yiweiInput').val($(this).text().trim())
                if ($('#yiweiInput').val() == '未婚') {
                    myService.setObject('maritalStatus', '1')
                }
                if ($('#yiweiInput').val() == '已婚') {
                    myService.setObject('maritalStatus', '2')
                }
                console.log($rootScope.tijianData.maritalStatus)
                $('#yiweiSelect').hide()
                $('#HOverlay').remove()
                $('#HCloseBtn').remove()
            })
        }



        //提交体检人信息
        $scope.confirmAppoint = function () {
            var personName = $('#personName').val()
            var telephone = $('#telephone').val()
            var userCard = $('#userCard').val()
            var appointmentTime = $('#tijianDate').val() + ' ' + $('#tijianTime').val() + ':00'
            var age = parseInt($('#tijianAge').val())
            var height = parseFloat($('#tijianHeight').val())
            var weight = parseFloat($('#tijianWeight').val())
            $scope.maritalStatus = myService.getObject('maritalStatus')
            $scope.userSex = myService.getObject('userSex')
            console.log(appointmentTime)
            $rootScope.tijianData = {
                setMealId: $scope.yigouMeal.setMealId,
                setMealName: $scope.yigouMeal.cardName,
                appointmentTime: appointmentTime,
                appointmentType: $scope.appointmentType,
                cardNo: $scope.yigouMeal.cardNo,
                cardId: $scope.yigouMeal.cardId,
                userId: $scope.favoriteCookie.id,
                age: age,
                height: height,
                weight: weight,
                personName: personName,
                telephone: telephone,
                userCard: userCard,
                maritalStatus: $scope.maritalStatus,
                userSex: $scope.userSex
            }
            console.log($rootScope.tijianData)
            if (personName == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '姓名不能为空！'
                })
                return false
            }
            if (telephone == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号不能为空！'
                })
                return false
            }
            var checkMsg = ''
            //手机验证
            function testNumbers() {
                var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
                var value = $('#telephone').val()
                if (isMob.test(value)) {
                    return true
                }
                else {
                    checkMsg += '手机号格式不正确！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '手机号格式不正确！'
                    })
                    return false
                }
            }
            testNumbers()
            if (userCard == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身份证号不能为空！'
                })
                return false
            }
            // 验证身份证号
            function testMid() {
                var code = $('#userCard').val()

                var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
                var tip = "";
                var pass = true;
                if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                    tip = "身份证号格式错误!";
                    pass = false;
                }

                else if (!city[code.substr(0, 2)]) {
                    tip = "地址编码错误!";
                    pass = false;
                }
                else {
                    //18位身份证需要验证最后一位校验位
                    if (code.length == 18) {
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++) {
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        if (parity[sum % 11] != code[17]) {
                            tip = "身份证号错误!";
                            pass = false;
                        }
                    }
                }
                if (!pass) {
                    // alert(tip);
                    checkMsg += tip + '\n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: tip
                    })
                }
                return pass;
            }
            testMid()
            if ($('#tijianAge').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianAge').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '年龄请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '年龄请输入整数！'
                    })
                    return false
                }
            }
            isNumbers()
            if ($('#tijianHeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers1() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianHeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '身高请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '身高请输入整数！'
                    })
                    return false
                }
            }
            isNumbers1()
            if ($('#tijianWeight').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '体重不能为空！'
                })
                return false
            }
            //数字验证
            function isNumbers2() {
                var isNumber = /^[0-9]*$/g
                var value = $('#tijianWeight').val()
                if (isNumber.test(value)) {
                    return true
                }
                else {
                    checkMsg += '体重请输入整数！ \n'
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: '体重请输入整数！'
                    })
                    return false
                }
            }
            isNumbers2()
            if ($('#tijianDate').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择日期！'
                })
                return false
            }
            if ($('#tijianTime').val() == '') {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '请选择时间！'
                })
                return false
            }
            if (checkMsg != '') {
                console.log(checkMsg)
                return false
            }
            $.ajax({
                url: ip + '/appAppointment/appointSetMeal.htm',
                type: 'POST',
                data: $rootScope.tijianData,
                dataType: 'json',
                success: function (data) {
                    // console.log('确认订单')
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#confirmFrame').hDialog({
                            width: 250,
                            height: 170,
                            modalHide: false,
                            isOverlay: false,
                            autoShow: true,
                            closeHide: false
                        })
                        $scope.myAppoint = function () {
                            $('#confirmFrame').fadeOut()
                            $('#HOverlay').remove()
                            $('#HCloseBtn').remove()
                            setTimeout(function () {
                                location.href = '#/myAppoint'
                            }, 200);
                        }
                    }
                }
            })
        }
    }
});

// 我的预约指令
routeApp.directive('myAppoint', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if ($scope.$last === true) {
                //我的预约轮播图
                var setMealSwiper = new Swiper('.myAppoint-container', {
                    pagination: '.myAppoint-pagination',
                    paginationType: 'fraction',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 60,
                    onImagesReady: function (swiper) {
                        var curMyAppoint = $scope.myAppointRows[swiper.realIndex]
                        console.log(curMyAppoint)
                        myService.setObject('curMyAppoint', curMyAppoint)
                    },
                    onSlideChangeStart: function (swiper) {
                        console.log(swiper.realIndex)
                        var curMyAppoint = $scope.myAppointRows[swiper.realIndex]
                        myService.setObject('curMyAppoint', curMyAppoint)
                        console.log(curMyAppoint)
                    }
                })
            }
        }
    };
});
// 我的预约
routeApp.controller('myAppointCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    // $scope.checkData = myService.getObject('checkData')
    // $scope.sumTotal = myService.getObject('sumTotal')
    // $scope.orderData = myService.getObject('orderData')
    // console.log($scope.orderData)
    $http.get(ip + '/appAppointment/queryMyAppointment.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.myAppointRows = data.rows
    })
});




// 我的预约-详情
routeApp.controller('myAppointDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curMyAppoint = myService.getObject('curMyAppoint')
    $scope.curMyAppoint.price=parseInt($scope.curMyAppoint.price)
    console.log($scope.curMyAppoint)
    // if($scope.curMyAppoint.cardNo == 'null'){
    //     console.log(1)
    //     // $('.topWrap .kahao').hide()
    // }
});
// 选择套餐指令
routeApp.directive('selectMeal', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if ($scope.$last === true) {
                //我的预约轮播图
                var setMealSwiper = new Swiper('.selectMeal-container', {
                    pagination: '.selectMeal-pagination',
                    paginationType: 'fraction',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 60,
                    onImagesReady: function (swiper) {
                        var curSelectMeal = $scope.selectMealRows[swiper.realIndex]
                        curSelectMeal.manDiscountPrice=parseInt(curSelectMeal.manDiscountPrice)
                        curSelectMeal.womanDiscountPriceNot=parseInt(curSelectMeal.womanDiscountPriceNot)
                        curSelectMeal.womanDiscountPriceYet=parseInt(curSelectMeal.womanDiscountPriceYet)
                        //console.log(curSelectMeal)
                        myService.setObject('curSelectMeal', curSelectMeal)
                    },
                    onSlideChangeStart: function (swiper) {
                        console.log(swiper.realIndex)
                        var curSelectMeal = $scope.selectMealRows[swiper.realIndex]
                        curSelectMeal.manDiscountPrice=parseInt(curSelectMeal.manDiscountPrice)
                        curSelectMeal.womanDiscountPriceNot=parseInt(curSelectMeal.womanDiscountPriceNot)
                        curSelectMeal.womanDiscountPriceYet=parseInt(curSelectMeal.womanDiscountPriceYet)
                        myService.setObject('curSelectMeal', curSelectMeal)
                        //console.log(curSelectMeal)
                    }
                })
            }
        }
    };
});

// 选择套餐
routeApp.controller('selectMealCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appSetMeal/querySetMeal.htm').success(function (data) {
        console.log(data)
        $scope.selectMealRows = data.rows
    })
});

// 代付款
routeApp.controller('waitPayCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryMyOrderNoPay.htm?orderStatus=0' + '&userId=' + $scope.favoriteCookie.id).success(function (data) {

        for(var i=0;i<data.rows.length;i++){
            data.rows[i].goodsNum=0;
            for(var j=0;j<data.rows[i].goodsVoList.length;j++){
                console.log(data.rows[i].goodsVoList[j].goodsNum)
                data.rows[i].goodsNum+=data.rows[i].goodsVoList[j].goodsNum;
            }
        }
        $scope.waitPay = data.rows
    })
    $scope.orderDetail = function () {
        console.log(this.item)
        myService.setObject('orderDetail', this.item)
    }
});

// 全部订单
routeApp.controller('allOrderCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryMyOrderNoPay.htm?' + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
        //console.log(data)
        for(var i=0;i<data.rows.length;i++){
            data.rows[i].goodsNum=0;
            for(var j=0;j<data.rows[i].goodsVoList.length;j++){
                //console.log(data.rows[i].goodsVoList[j].goodsNum)
                data.rows[i].goodsNum+=data.rows[i].goodsVoList[j].goodsNum;
            }
        }
        $scope.waitPay = data.rows
    })
    $scope.orderDetail = function () {
        //console.log(this.item)
        myService.setObject('orderDetail', this.item)
    }
});

// 待收货
routeApp.controller('waitDeliverCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryMyOrderNoPay.htm?orderStatus=2' + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        for(var i=0;i<data.rows.length;i++){
            data.rows[i].goodsNum=0;
            for(var j=0;j<data.rows[i].goodsVoList.length;j++){
                console.log(data.rows[i].goodsVoList[j].goodsNum)
                data.rows[i].goodsNum+=data.rows[i].goodsVoList[j].goodsNum;
            }
        }
        $scope.waitPay = data.rows
    })
    $scope.orderDetail = function () {
        console.log(this.item)
        myService.setObject('orderDetail', this.item)
    }
});

// 订单详情
routeApp.controller('orderDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.orderDetail = myService.getObject('orderDetail')
    console.log($scope.orderDetail)
    $scope.logistics=function(){
        $('#simple-dialogBox').dialogBox({
            hasMask: true,
            autoHide: true,
            time: 800,
            content: '暂无数据'
        })
    }
    //去支付
    $scope.goPayDetail = function () {
        myService.setObject('goPayOrder', $scope.orderDetail)
        window.location.href = '#/goPayDetail'
    }
    //取消订单
    $scope.cancleOrder = function () {
        $('#confirmLayer').dialogBox({
            hasClose: false,
            hasBtn: true,
            width: 200,
            confirmValue: '确定',
            confirm: function () {
                $http.post(ip + '/appShop/cancelOrder.htm?id=' + $scope.orderDetail.id).success(function (data) {
                    console.log(data)
                    if (data.resultCode == '1') {
                        $('#simple-dialogBox').dialogBox({
                            hasMask: true,
                            autoHide: true,
                            time: 800,
                            content: data.resultDesc
                        })
                        setTimeout(function () {
                            $rootScope.goback()
                            window.location.reload()
                        }, 1100)
                    }
                })
            },
            cancelValue: '取消',
            title: '',
            content: '是否取消该订单？'
        });
    }
});
// 人员管理指令
routeApp.directive('memberDirective', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if ($scope.$last === true) {
                //侧滑显示删除按钮
                var expansion = null; //是否存在展开的list
                var container = document.querySelectorAll('.list li a');
                for (var i = 0; i < container.length; i++) {
                    var x, y, X, Y, swipeX, swipeY;
                    container[i].addEventListener('touchstart', function (event) {
                        x = event.changedTouches[0].pageX;
                        y = event.changedTouches[0].pageY;
                        swipeX = true;
                        swipeY = true;
                        // if (expansion) {   //判断是否展开，如果展开则收起
                        //     expansion.className = "";
                        // }
                    });
                    container[i].addEventListener('touchmove', function (event) {

                        X = event.changedTouches[0].pageX;
                        Y = event.changedTouches[0].pageY;
                        // 左右滑动
                        if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                            // 阻止事件冒泡
                            event.stopPropagation();
                            if (X - x > 10) {   //右滑
                                event.preventDefault();
                                this.className = "";    //右滑收起
                            }
                            if (x - X > 10) {   //左滑
                                event.preventDefault();
                                this.className = "swipeleft";   //左滑展开
                                expansion = this;
                            }
                            swipeY = false;
                        }
                        // 上下滑动
                        if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                            swipeX = false;
                        }
                    });
                }



            }
        }
    };
});

// 人员管理-我的联系人
routeApp.controller('membersControlCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    console.log(document.referrer)
    $scope.imgIp = ip
    $http.get(ip + '/appAppointment/queryContactsByMemberId.htm?memberId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.membersRows = data.rows
    })
    $scope.membersData = function (userType) {
        console.log(this.item)
        //console.log(userType);
        myService.setObject('userType', userType)
        myService.setObject('membersData', this.item)
        window.location.href = '#/membersDetail'
    }

    $scope.deleteMember = function (index) {
        console.log(this.item)

        $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
            console.log(data)
            if (data.resultCode == '1') {
                $scope.membersRows.splice(index, 1)
            }
        })
    }
});

// 人员管理-我的联系人详情
routeApp.controller('membersDetailCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.membersData = myService.getObject('membersData')
    console.log($scope.membersData)
    $scope.editContact = function () {
        myService.setObject('editData', $scope.membersData)
        window.location.href = '#/editContacts'
    }
});

// 人员管理-新增联系人
routeApp.controller('addContactsCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip

    // 已未婚选择框
    $('#yiweiInput').hDialog({
        box: '#yiweiSelect',
        width: 230,
        height: 170,
        modalHide: false,
        isOverlay: false
    })

    $('#yiweiSelect div').click(function () {
        $('#yiweiInput').val($(this).text().trim())
        $('#yiweiSelect').hide()
        $('#HOverlay').remove()
        $('#HCloseBtn').remove()
    })

    //性别选择框
    $('#sexInput').hDialog({
        box: '#sexSelect',
        width: 230,
        height: 170,
        modalHide: false,
        isOverlay: false
    })
    $('#sexSelect div').click(function () {
        $('#sexInput').val($(this).text().trim())
        $('#sexSelect').hide()
        $('#HOverlay').remove()
        $('#HCloseBtn').remove()
    })
    $scope.saveContacts = function () {
        console.log($('#personName').val())
        var personName = $('#personName').val()
        var telephone = $('#telephone').val()
        var userCard = $('#userCard').val()
        var age = parseInt($('#tijianAge').val())
        var height = parseFloat($('#tijianHeight').val())
        var weight = parseFloat($('#tijianWeight').val())
        var maritalStatus = $('#yiweiInput').val()
        if (maritalStatus == '已婚') {
            maritalStatus = '2'
        }
        if (maritalStatus == '未婚') {
            maritalStatus = '1'
        }
        var userSex = $('#sexInput').val()
        if (userSex == '男') {
            userSex = '2'
        }
        if (userSex == '女') {
            userSex = '1'
        }
        $rootScope.contactsData = {
            userId: $scope.favoriteCookie.id,
            age: age,
            height: height,
            weight: weight,
            personName: personName,
            telephone: telephone,
            userCard: userCard,
            maritalStatus: maritalStatus,
            userSex: userSex,
            userType:1
        }
        console.log($rootScope.contactsData)

        if (personName == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '姓名不能为空！'
            })
            return false
        }
        if (telephone == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号不能为空！'
            })
            return false
        }
        var checkMsg = ''
        //手机验证
        function testNumbers() {
            var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
            var value = $('#telephone').val()
            if (isMob.test(value)) {
                return true
            }
            else {
                checkMsg += '手机号格式不正确！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号格式不正确！'
                })
                return false
            }
        }
        testNumbers()
        if (userCard == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '身份证号不能为空！'
            })
            return false
        }
        // 验证身份证号
        function testMid() {
            var code = $('#userCard').val()

            var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
            var tip = "";
            var pass = true;
            if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                tip = "身份证号格式错误!";
                pass = false;
            }

            else if (!city[code.substr(0, 2)]) {
                tip = "地址编码错误!";
                pass = false;
            }
            else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17]) {
                        tip = "身份证号错误!";
                        pass = false;
                    }
                }
            }
            if (!pass) {
                // alert(tip);
                checkMsg += tip + '\n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: tip
                })
            }
            return pass;
        }
        testMid()
        if ($('#tijianAge').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '年龄不能为空！'
            })
            return false
        }
        //数字验证
        function isNumbers() {
            var isNumber = /^[0-9]*$/g
            var value = $('#tijianAge').val()
            if (isNumber.test(value)) {
                return true
            }
            else {
                checkMsg += '年龄请输入整数！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄请输入整数！'
                })
                return false
            }
        }
        isNumbers()
        if ($('#tijianHeight').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '身高不能为空！'
            })
            return false
        }
        //数字验证
        function isNumbers1() {
            var isNumber = /^[0-9]*$/g
            var value = $('#tijianHeight').val()
            if (isNumber.test(value)) {
                return true
            }
            else {
                checkMsg += '身高请输入整数！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高请输入整数！'
                })
                return false
            }
        }
        isNumbers1()
        if ($('#tijianWeight').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '体重不能为空！'
            })
            return false
        }
        //数字验证
        var isNumber2 = /^[0-9]*$/g
        var value2 = $('#tijianWeight').val()
        if (!isNumber2.test(value2)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '体重请输入整数！'
            })
            return false
        }
        if (checkMsg != '') {
            console.log(checkMsg)
            return false
        }
        $.ajax({
            url: ip + '/appAppointment/addAppointmentPerson.htm',
            type: 'POST',
            data: $rootScope.contactsData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    window.history.go(-1)
                    return false
                }
            }
        })
    }
});


// 人员管理-编辑联系人
routeApp.controller('editContactsCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.editData = myService.getObject('editData')
    console.log($scope.editData)
    //赋值上一页数据
    $('#personName').val($scope.editData.personName)
    $('#telephone').val($scope.editData.telephone)
    $('#userCard').val($scope.editData.userCard)
    $('#tijianAge').val($scope.editData.age)
    $('#tijianHeight').val($scope.editData.height)
    $('#tijianWeight').val($scope.editData.weight)
    if ($scope.editData.maritalStatus == '2') {
        var maritalStatus = '已婚'
    }
    if ($scope.editData.maritalStatus == '1') {
        var maritalStatus = '未婚'
    }
    $('#yiweiInput').val(maritalStatus)
    if ($scope.editData.userSex == '2') {
        var userSex = '男'
    }
    if ($scope.editData.userSex == '1') {
        var userSex = '女'
    }
    $('#sexInput').val(userSex)
    // 已未婚选择框
    $('#yiweiInput').hDialog({
        box: '#yiweiSelect',
        width: 230,
        height: 170,
        modalHide: false,
        isOverlay: false
    })

    $('#yiweiSelect div').click(function () {
        $('#yiweiInput').val($(this).text().trim())
        $('#yiweiSelect').hide()
        $('#HOverlay').remove()
        $('#HCloseBtn').remove()
    })

    //性别选择框
    $('#sexInput').hDialog({
        box: '#sexSelect',
        width: 230,
        height: 170,
        modalHide: false,
        isOverlay: false
    })
    $('#sexSelect div').click(function () {
        $('#sexInput').val($(this).text().trim())
        $('#sexSelect').hide()
        $('#HOverlay').remove()
        $('#HCloseBtn').remove()
    })
    $scope.saveContacts = function () {
        console.log($('#personName').val())
        var personName = $('#personName').val()
        var telephone = $('#telephone').val()
        var userCard = $('#userCard').val()
        var age = parseInt($('#tijianAge').val())
        var height = parseFloat($('#tijianHeight').val())
        var weight = parseFloat($('#tijianWeight').val())
        var maritalStatus = $('#yiweiInput').val()
        if (maritalStatus == '已婚') {
            maritalStatus = '2'
        }
        if (maritalStatus == '未婚') {
            maritalStatus = '1'
        }
        var userSex = $('#sexInput').val()
        if (userSex == '男') {
            userSex = '2'
        }
        if (userSex == '女') {
            userSex = '1'
        }
        var id = $scope.editData.id
        $rootScope.contactsData = {
            userId: $scope.favoriteCookie.id,
            age: age,
            height: height,
            weight: weight,
            personName: personName,
            telephone: telephone,
            userCard: userCard,
            maritalStatus: maritalStatus,
            userSex: userSex,
            id: id,
            userType:myService.getObject('userType')
        }
        console.log($rootScope.contactsData)
        var checkMsg = ''
        if (personName == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '姓名不能为空！'
            })
            return false
        }
        if (telephone == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号不能为空！'
            })
            return false
        }
        //手机验证
        function testNumbers() {
            var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
            var value = $('#telephone').val()
            if (isMob.test(value)) {
                return true
            }
            else {
                checkMsg += '手机号格式不正确！\n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '手机号格式不正确！'
                })
                return false
            }
        }
        testNumbers()
        if (userCard == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '身份证号不能为空！'
            })
            return false
        }
        // 验证身份证号
        function testMid() {
            var code = $('#userCard').val()

            var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
            var tip = "";
            var pass = true;
            if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                tip = "身份证号格式错误!";
                pass = false;
            }

            else if (!city[code.substr(0, 2)]) {
                tip = "地址编码错误!";
                pass = false;
            }
            else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17]) {
                        tip = "身份证号错误!";
                        pass = false;
                    }
                }
            }
            if (!pass) {
                // alert(tip);
                checkMsg += tip + '\n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: tip
                })
            }
            return pass;
        }
        testMid()
        if (maritalStatus == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '婚姻状况不能为空！'
            })
            return false
        }
        if (userSex == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '性别不能为空！'
            })
            return false
        }
        if ($('#tijianAge').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '年龄不能为空！'
            })
            return false
        }
        //数字验证
        function isNumbers() {
            var isNumber = /^[0-9]*$/g
            var value = $('#tijianAge').val()
            if (isNumber.test(value)) {
                return true
            }
            else {
                checkMsg += '年龄请输入整数！\n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '年龄请输入整数！'
                })
                return false
            }
        }
        isNumbers()
        if ($('#tijianHeight').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '身高不能为空！'
            })
            return false
        }
        //数字验证
        function isNumbers1() {
            var isNumber = /^[0-9]*$/g
            var value = $('#tijianHeight').val()
            if (isNumber.test(value)) {
                return true
            }
            else {
                checkMsg += '身高请输入整数！\n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '身高请输入整数！'
                })
                return false
            }
        }
        isNumbers1()
        if ($('#tijianWeight').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '体重不能为空！'
            })
            return false
        }
        //数字验证
        var isNumber2 = /^[0-9]*$/g
        var value2 = $('#tijianWeight').val()
        if (!isNumber2.test(value2)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '体重请输入整数！'
            })
            return false
        }
        if (checkMsg != '') {
            console.log(checkMsg)
            return false
        }
        console.log(1111111111111)
        $.ajax({
            url: ip + '/appAppointment/addAppointmentPerson.htm',
            type: 'POST',
            data: $rootScope.contactsData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    window.location.href = '#/membersControl'
                }
            }
        })
    }
});



//重新利用membersControlCtrl**************************************************************************
// 人员管理-我的联系人
routeApp.controller('membersControlCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    console.log(document.referrer)
    $scope.imgIp = ip
    $http.get(ip + '/appAppointment/queryContactsByMemberId.htm?memberId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.membersRows = data.rows
    })
    $scope.membersData = function () {
        console.log(this.item)
        myService.setObject('membersData', this.item)
        window.location.href = '#/editInfo1'
    }

    $scope.deleteMember = function (index) {
        console.log(this.item)

        $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
            console.log(data)
            if (data.resultCode == '1') {
                $scope.membersRows.splice(index, 1)
            }
        })
    }
});

//end*****************


// 新增收货地址
routeApp.controller('addAddressCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $state, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $scope.curCity = myService.getObject('curCity')
    $scope.curCounty = myService.getObject('curCounty')
    console.log($scope.curProvince)
    console.log($scope.curCity)
    console.log($scope.curCounty)
    // $scope.membersData = function () {
    //     console.log(this.item)
    //     myService.setObject('membersData', this.item)
    //     window.location.href = '#/editInfo1'
    // }
    $scope.saveTwoData = function () {
        myService.setObject('addConsignee', $('#consignee').val())
        myService.setObject('addMobilePhone', $('#mobilePhone').val())
        myService.setObject('addAddressLast', $('#address').val())
    }
    $scope.addConsignee = myService.getObject('addConsignee')
    if (typeof $scope.addConsignee == 'string') {
        $('#consignee').val($scope.addConsignee)
    }
    $scope.addMobilePhone = myService.getObject('addMobilePhone')
    if (typeof $scope.addMobilePhone == 'string') {
        $('#mobilePhone').val($scope.addMobilePhone)
    }
    $scope.addAddressLast = myService.getObject('addAddressLast')
    if (typeof $scope.addAddressLast == 'string') {
        $('#address').val($scope.addAddressLast)
    }

    console.log($scope.addAddressLast)

    $scope.saveAddress = function () {
        if ($('#consignee').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '收货人不能为空！'
            })
            return false
        }
        if ($('#mobilePhone').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '联系方式不能为空！'
            })
            return false
        }
        //手机验证
        var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
        var value = $('#mobilePhone').val()
        if (!isMob.test(value)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号格式不正确！'
            })
            return false
        }
        if ($scope.curProvince.text == '' || $scope.curProvince.text == undefined) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '所在地区不能为空！'
            })
            return false
        }
        if ($('#address').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '详细地址不能为空！'
            })
            return false
        }
        console.log($('#consignee').val())
        var consignee = $('#consignee').val()
        var mobilePhone = $('#mobilePhone').val()
        var address = $('#address').val()
        var province = $scope.curProvince.text
        var city = $scope.curCity.text
        var county = $scope.curCounty.text
        $scope.addressData = {
            memberId: $scope.favoriteCookie.id,
            consignee: consignee,
            mobilePhone: mobilePhone,
            address: address,
            province: province,
            city: city,
            county: county
        }
        console.log($scope.addressData)


        $.ajax({
            url: ip + '/appMember/saveMemberAddress.htm',
            type: 'POST',
            data: $scope.addressData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('addressControl')
                }
            }
        })
    }
});

// 重用新增收货地址1
routeApp.controller('addAddressCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $state, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $scope.curCity = myService.getObject('curCity')
    $scope.curCounty = myService.getObject('curCounty')
    console.log($scope.curProvince)
    console.log($scope.curCity)
    console.log($scope.curCounty)
    // $scope.membersData = function () {
    //     console.log(this.item)
    //     myService.setObject('membersData', this.item)
    //     window.location.href = '#/editInfo1'
    // }
    $scope.saveTwoData = function () {
        myService.setObject('addConsignee', $('#consignee').val())
        myService.setObject('addMobilePhone', $('#mobilePhone').val())
        myService.setObject('addAddressLast', $('#address').val())
    }
    $scope.addConsignee = myService.getObject('addConsignee')
    if (typeof $scope.addConsignee == 'string') {
        $('#consignee').val($scope.addConsignee)
    }
    $scope.addMobilePhone = myService.getObject('addMobilePhone')
    if (typeof $scope.addMobilePhone == 'string') {
        $('#mobilePhone').val($scope.addMobilePhone)
    }
    $scope.addAddressLast = myService.getObject('addAddressLast')
    if (typeof $scope.addAddressLast == 'string') {
        $('#address').val($scope.addAddressLast)
    }

    console.log($scope.addAddressLast)

    $scope.saveAddress = function () {
        console.log($('#consignee').val())
        var consignee = $('#consignee').val()
        var mobilePhone = $('#mobilePhone').val()
        var address = $('#address').val()
        var province = $scope.curProvince.text
        var city = $scope.curCity.text
        var county = $scope.curCounty.text
        if ($('#consignee').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '收货人不能为空！'
            })
            return false
        }
        if ($('#mobilePhone').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '联系方式不能为空！'
            })
            return false
        }
        //手机验证
        var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
        var value = $('#mobilePhone').val()
        if (!isMob.test(value)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号格式不正确！'
            })
            return false
        }
        if ($scope.curProvince.text == '' || $scope.curProvince.text == undefined) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '所在地区不能为空！'
            })
            return false
        }
        if ($('#address').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '详细地址不能为空！'
            })
            return false
        }
        $scope.addressData = {
            memberId: $scope.favoriteCookie.id,
            consignee: consignee,
            mobilePhone: mobilePhone,
            address: address,
            province: province,
            city: city,
            county: county
        }
        console.log($scope.addressData)

        $.ajax({
            url: ip + '/appMember/saveMemberAddress.htm',
            type: 'POST',
            data: $scope.addressData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('selectAddress')
                }
            }
        })
    }
});
// 编辑收货人
routeApp.controller('editAddressCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $state, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.editAddressData = myService.getObject('editAddressData')
    $scope.editAddressDataId = myService.getObject('editAddressDataId')
    console.log($scope.editAddressData)
    //赋值上一页数据      editAddressDataId
    $('#consignee').val($scope.editAddressData.consignee)
    $('#mobilePhone').val($scope.editAddressData.mobilePhone)
    $('#address').val($scope.editAddressData.address)
    var province = $scope.editAddressData.province
    var city = $scope.editAddressData.city
    var county = $scope.editAddressData.county
    $scope.curProvince = myService.getObject('curProvince')
    console.log(typeof $scope.curProvince)
    if ($scope.curProvince != '' && typeof $scope.curProvince == 'object') {
        console.log($scope.curProvince)
        var province = $scope.curProvince.text
    }
    $scope.curCity = myService.getObject('curCity')
    if ($scope.curCity != '' && typeof $scope.curCity == 'object') {
        console.log($scope.curCity)
        var city = $scope.curCity.text
    }
    $scope.curCounty = myService.getObject('curCounty')
    if ($scope.curCounty != '' && typeof $scope.curCounty == 'object') {
        console.log($scope.curCounty)
        var county = $scope.curCounty.text
    }
    $scope.saveTwoData = function () {
        myService.setObject('addConsignee', $('#consignee').val())
        myService.setObject('addMobilePhone', $('#mobilePhone').val())
        myService.setObject('addAddressLast', $('#address').val())
    }
    $scope.addConsignee = myService.getObject('addConsignee')
    if ($scope.addConsignee != '' && typeof $scope.addConsignee == 'string') {
        console.log($scope.addConsignee)
        $('#consignee').val($scope.addConsignee)
    }
    $scope.addMobilePhone = myService.getObject('addMobilePhone')
    if ($scope.addMobilePhone != '' && typeof $scope.addConsignee == 'string') {
        $('#mobilePhone').val($scope.addMobilePhone)
    }
    $scope.addAddressLast = myService.getObject('addAddressLast')
    if ($scope.addAddressLast != '' && typeof $scope.addConsignee == 'string') {
        $('#address').val($scope.addAddressLast)
    }
    $scope.editAddressForm = function () {
        console.log($('#consignee').val())
        var consignee = $('#consignee').val()
        var mobilePhone = $('#mobilePhone').val()
        var address = $('#address').val()
        $scope.editAddressFormData = {
            memberId: $scope.favoriteCookie.id,
            consignee: consignee,
            mobilePhone: mobilePhone,
            address: address,
            province: province,
            city: city,
            county: county,
            id: $scope.editAddressDataId
        }
        console.log($scope.editAddressFormData)
        if ($('#consignee').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '收货人不能为空！'
            })
            return false
        }
        if ($('#mobilePhone').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '联系方式不能为空！'
            })
            return false
        }
        //手机验证
        var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
        var value = $('#mobilePhone').val()
        if (!isMob.test(value)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号格式不正确！'
            })
            return false
        }
        if ($('#address').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '详细地址不能为空！'
            })
            return false
        }

        $.ajax({
            url: ip + '/appMember/saveMemberAddress.htm',
            type: 'POST',
            data: $scope.editAddressFormData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('addressControl')
                }
            }
        })
    }
});

// 重用编辑收货人
// 编辑收货人
routeApp.controller('editAddressCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $state, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.editAddressData = myService.getObject('editGoodAddressData')
    $scope.editAddressDataId = myService.getObject('editGoodAddressDataId')
    console.log($scope.editAddressData)
    //赋值上一页数据      editAddressDataId
    $('#consignee').val($scope.editAddressData.consignee)
    $('#mobilePhone').val($scope.editAddressData.mobilePhone)
    $('#address').val($scope.editAddressData.address)
    var province = $scope.editAddressData.province
    var city = $scope.editAddressData.city
    var county = $scope.editAddressData.county
    $scope.curProvince = myService.getObject('curProvince')
    console.log(typeof $scope.curProvince)
    if ($scope.curProvince != '' && typeof $scope.curProvince == 'object') {
        console.log($scope.curProvince)
        var province = $scope.curProvince.text
    }
    $scope.curCity = myService.getObject('curCity')
    if ($scope.curCity != '' && typeof $scope.curCity == 'object') {
        console.log($scope.curCity)
        var city = $scope.curCity.text
    }
    $scope.curCounty = myService.getObject('curCounty')
    if ($scope.curCounty != '' && typeof $scope.curCounty == 'object') {
        console.log($scope.curCounty)
        var county = $scope.curCounty.text
    }
    $scope.saveTwoData = function () {
        myService.setObject('addConsignee', $('#consignee').val())
        myService.setObject('addMobilePhone', $('#mobilePhone').val())
        myService.setObject('addAddressLast', $('#address').val())
    }
    $scope.addConsignee = myService.getObject('addConsignee')
    if ($scope.addConsignee != '' && typeof $scope.addConsignee == 'string') {
        console.log($scope.addConsignee)
        $('#consignee').val($scope.addConsignee)
    }
    $scope.addMobilePhone = myService.getObject('addMobilePhone')
    if ($scope.addMobilePhone != '' && typeof $scope.addConsignee == 'string') {
        $('#mobilePhone').val($scope.addMobilePhone)
    }
    $scope.addAddressLast = myService.getObject('addAddressLast')
    if ($scope.addAddressLast != '' && typeof $scope.addConsignee == 'string') {
        $('#address').val($scope.addAddressLast)
    }
    $scope.editAddressForm = function () {
        console.log($('#consignee').val())
        var consignee = $('#consignee').val()
        var mobilePhone = $('#mobilePhone').val()
        var address = $('#address').val()
        $scope.editAddressFormData = {
            memberId: $scope.favoriteCookie.id,
            consignee: consignee,
            mobilePhone: mobilePhone,
            address: address,
            province: province,
            city: city,
            county: county,
            id: $scope.editAddressDataId
        }
        console.log($scope.editAddressFormData)
        if ($('#consignee').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '收货人不能为空！'
            })
            return false
        }
        if ($('#mobilePhone').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '联系方式不能为空！'
            })
            return false
        }
        //手机验证
        var isMob = /^((\+?86)|(\(\+86\)))?(1[3578]\d{9})$/
        var value = $('#mobilePhone').val()
        if (!isMob.test(value)) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '手机号格式不正确！'
            })
            return false
        }
        if ($('#address').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '详细地址不能为空！'
            })
            return false
        }
        $.ajax({
            url: ip + '/appMember/saveMemberAddress.htm',
            type: 'POST',
            data: $scope.editAddressFormData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('selectAddress')
                }
            }
        })
    }
});


// 省
routeApp.controller('provinceCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryProvince.htm').success(function (data) {
        console.log(data)
        $scope.provinceData = data.rows
    })
    $scope.goCity = function () {
        console.log(this.item)
        myService.setObject('curProvince', this.item)
        $state.go('city')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 市
routeApp.controller('cityCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $http.get(ip + '/appShop/queryCity.htm?provinceId=' + $scope.curProvince.value).success(function (data) {
        console.log(data)
        $scope.cityData = data.rows
    })
    $scope.goCounty = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCity', this.item)
        $state.go('county')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 县
routeApp.controller('countyCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curCity = myService.getObject('curCity')
    $http.get(ip + '/appShop/queryCounty.htm?cityId=' + $scope.curCity.value).success(function (data) {
        console.log(data)
        $scope.countyData = data.rows
    })
    $scope.goAddAddress = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCounty', this.item)
        $state.go('addAddress')
    }
});

//重用省市县****************************************
// 省1
routeApp.controller('provinceCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryProvince.htm').success(function (data) {
        console.log(data)
        $scope.provinceData = data.rows
    })
    $scope.goCity = function () {
        console.log(this.item)
        myService.setObject('curProvince', this.item)
        $state.go('city1')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 市1
routeApp.controller('cityCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $http.get(ip + '/appShop/queryCity.htm?provinceId=' + $scope.curProvince.value).success(function (data) {
        console.log(data)
        $scope.cityData = data.rows
    })
    $scope.goCounty = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCity', this.item)
        $state.go('county1')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 县
routeApp.controller('countyCtrl1', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curCity = myService.getObject('curCity')
    $http.get(ip + '/appShop/queryCounty.htm?cityId=' + $scope.curCity.value).success(function (data) {
        console.log(data)
        $scope.countyData = data.rows
    })
    $scope.goAddAddress = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCounty', this.item)
        myService.setObject('editAddressData', '')
        $state.go('editAddress')
    }
});
//end**********************************************
//重用省市县2****************************************
// 省2
routeApp.controller('provinceCtrl2', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryProvince.htm').success(function (data) {
        console.log(data)
        $scope.provinceData = data.rows
    })
    $scope.goCity = function () {
        console.log(this.item)
        myService.setObject('curProvince', this.item)
        $state.go('city2')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 市1
routeApp.controller('cityCtrl2', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $http.get(ip + '/appShop/queryCity.htm?provinceId=' + $scope.curProvince.value).success(function (data) {
        console.log(data)
        $scope.cityData = data.rows
    })
    $scope.goCounty = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCity', this.item)
        $state.go('county2')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 县
routeApp.controller('countyCtrl2', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curCity = myService.getObject('curCity')
    $http.get(ip + '/appShop/queryCounty.htm?cityId=' + $scope.curCity.value).success(function (data) {
        console.log(data)
        $scope.countyData = data.rows
    })
    $scope.goAddAddress = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCounty', this.item)
        myService.setObject('editGoodAddressData', '')
        $state.go('editAddress1')
    }
});
//end**********************************************

//重用省市县3****************************************
// 省3
routeApp.controller('provinceCtrl3', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appShop/queryProvince.htm').success(function (data) {
        console.log(data)
        $scope.provinceData = data.rows
    })
    $scope.goCity = function () {
        console.log(this.item)
        myService.setObject('curProvince', this.item)
        $state.go('city3')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 市3
routeApp.controller('cityCtrl3', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curProvince = myService.getObject('curProvince')
    $http.get(ip + '/appShop/queryCity.htm?provinceId=' + $scope.curProvince.value).success(function (data) {
        console.log(data)
        $scope.cityData = data.rows
    })
    $scope.goCounty = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCity', this.item)
        $state.go('county3')
    }

    // $scope.deleteMember = function (index) {
    //     console.log(this.item)

    //     $http.post(ip + '/appAppointment/deleteMemberContacts.htm?ids=' + this.item.id).success(function (data) {
    //         console.log(data)
    //         if (data.resultCode == '1') {
    //             $scope.membersRows.splice(index, 1)
    //         }
    //     })
    // }
});

// 县
routeApp.controller('countyCtrl3', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.curCity = myService.getObject('curCity')
    $http.get(ip + '/appShop/queryCounty.htm?cityId=' + $scope.curCity.value).success(function (data) {
        console.log(data)
        $scope.countyData = data.rows
    })
    $scope.goAddAddress = function () {
        // console.log(this.item)
        // myService.setObject('membersData', this.item)
        myService.setObject('curCounty', this.item)
        myService.setObject('editGoodAddressData', '')
        $state.go('addAddress1')
    }
});
//end**********************************************

// 账户安全
routeApp.controller('accountSafetyCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    // $scope.curCity = myService.getObject('curCity')
    // $http.get(ip + '/appShop/queryCounty.htm?cityId=' + $scope.curCity.value).success(function (data) {
    //     console.log(data)
    //     $scope.countyData = data.rows
    // })
    // $scope.goAddAddress = function () {
    //     // console.log(this.item)
    //     // myService.setObject('membersData', this.item)
    //     myService.setObject('curCounty', this.item)
    //     myService.setObject('editAddressData', '')
    //     $state.go('editAddress')
    // }
});

// 修改密码（获取验证码）
routeApp.controller('modifyPasswordCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    //倒计时60s
    var wait = 60;
    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            o.style.border = '1px solid #D42323'
            o.style.color = '#D42323'
            o.value = "重新发送";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.style.border = '1px solid #808080'
            o.style.color = '#808080'
            o.value = wait + "s";
            wait--
            setTimeout(function () {
                time(o)
            }, 1000)
        }
    }
    //获取验证码
    $('#reqCode').click(function () {
        time(this)
        $http.get(ip + '/appMember/smsValidation.htm?telephone=' + $scope.favoriteCookie.telephone + '&flag=2').success(function (data) {
            console.log(data)
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: data.resultDesc
            })
        })
    })
    //提交下一步
    $scope.codePhoneNext = function () {
        var verifyCode = $('#inputCode').val()
        console.log(verifyCode)
        $scope.codePhone = {
            verifyCode: verifyCode,
            telephone: $scope.favoriteCookie.telephone
        }
        console.log($scope.codePhone)

        if ($('#inputCode').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '验证码不能为空！'
            })
            return false
        }

        $.ajax({
            url: ip + '/appMember/verifyPwd.htm',
            type: 'POST',
            data: $scope.codePhone,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 900,
                        content: data.resultDesc
                    })
                    setTimeout(function () {
                        $state.go('editPassword')
                    }, 800);
                } else {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: data.resultDesc
                    })
                }
            }
        })
    }
});

// 修改密码（填写新密码）
routeApp.controller('editPasswordCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state, $cookies) {
    $rootScope.isLogin()
    $scope.imgIp = ip

    //提交新密码
    $scope.modifyPassword = function () {
        var newPassword = $('#newPassword').val()
        console.log($('#newPassword').val())
        $scope.modifyPasswordData = {
            userId: $scope.favoriteCookie.id,
            flag: '6',
            worth: newPassword
        }
        console.log($scope.modifyPasswordData)
        if ($('#newPassword').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '密码不能为空！'
            })
            return false
        }
        //密码验证
        var checkMsg = ''
        function testPassword() {
            var isPassword = /^.{6,}$/
            var value = $('#newPassword').val()
            if (isPassword.test(value)) {
                return true
            }
            else {
                checkMsg += '密码格式不正确！ \n'
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '密码格式不正确！'
                })
                return false
            }
        }
        testPassword()
        if ($('#newPasswordAgain').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '确认密码不能为空！'
            })
            return false
        }
        if ($('#newPassword').val() != $('#newPasswordAgain').val()) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '两次密码输入不一致！'
            })
            return false
        }
        if (checkMsg != '') {
            console.log(checkMsg)
            return false
        }
        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifyPasswordData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    // $state.go('addressControl')
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 1000,
                        content: data.resultDesc
                    })
                    $scope.modifyExit = function () {
                        $http.post(ip + '/appMember/logout.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
                            console.log(data)
                            // myService.setObject('userData', '')
                            $scope.userData = ''
                            $cookies.putObject('userData', '')
                            setTimeout(function () {
                                location.href = '#/home'
                            }, 1000)
                        })
                        $scope.userData = $cookies.getObject('userData')
                    }
                    $scope.modifyExit()
                }
            }
        })
    }


});

//  实名认证
routeApp.controller('idVerifyCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
    })
});

// 修改真实姓名
routeApp.controller('modifyRealNameCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
    })
    $scope.modifySave = function () {
        var realName = $('#realName').val()
        $scope.modifySaveData = {
            userId: $scope.favoriteCookie.id,
            flag: '4',
            worth: realName
        }
        console.log($scope.modifySaveData)

        if ($('#realName').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '真实姓名不能为空！'
            })
            return false
        }

        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifySaveData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('idVerify')
                }
            }
        })
    }

});

// 修改身份证号
routeApp.controller('modifyIdCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
    })
    $scope.modifySave = function () {
        var idCard = $('.idCard').val()
        $scope.modifySaveData = {
            userId: $scope.favoriteCookie.id,
            flag: '5',
            worth: idCard
        }
        console.log($scope.modifySaveData)
        if ($('.idCard').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '身份证号不能为空！'
            })
            return false
        }
        // 验证身份证号
        var checkMsg = ''
        function testMid() {
            var code = $('.idCard').val()

            var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
            var tip = "";
            var pass = true;
            if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
                tip = "身份证号格式错误!";
                pass = false;
            }

            else if (!city[code.substr(0, 2)]) {
                tip = "地址编码错误!";
                pass = false;
            }
            else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17]) {
                        tip = "身份证号错误!";
                        pass = false;
                    }
                }
            }
            if (!pass) {
                checkMsg += tip += '\n'
                // alert(tip);
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: tip
                })
            }
            return pass;
        }
        testMid()
        if (checkMsg != '') {
            console.log(checkMsg)
            return false
        }
        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifySaveData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('idVerify')
                }
            }
        })
    }

});

// 个人信息
routeApp.controller('myInfoCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
        if ($scope.accountData.userBirthday != null) {
            $scope.subDate = $scope.accountData.userBirthday.substr(0, 10)
        }
    })

});

// 修改昵称
routeApp.controller('modifyNicknameCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
        $scope.subDate = $scope.accountData.userBirthday.substr(0, 10)
    })
    $scope.modifySave = function () {
        var worthData = $('.worthData').val()
        $scope.modifySaveData = {
            userId: $scope.favoriteCookie.id,
            flag: '1',
            worth: worthData
        }
        console.log($scope.modifySaveData)
        if ($('.worthData').val() == '') {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1000,
                content: '昵称不能为空！'
            })
            return false
        }

        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifySaveData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('myInfo')
                }
            }
        })
    }

});

// 修改性别
routeApp.controller('modifyUserSexCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
        if ($scope.accountData.userBirthday != null) {
            $scope.subDate = $scope.accountData.userBirthday.substr(0, 10)
        }
    })
    $('.worthData').click(function () {
        console.log($(this).val())
        var worthData = $(this).val()
        $scope.modifySaveData = {
            userId: $scope.favoriteCookie.id,
            flag: '2',
            worth: worthData
        }
        console.log($scope.modifySaveData)
        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifySaveData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('myInfo')
                }
            },
            error: function (data) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 1000,
                    content: '服务器繁忙'
                })
            }
        })
    })

});

// 修改出生日期
routeApp.controller('modifyUserBirthdayCtrl', function ($scope, $rootScope, $http, myService, $stateParams, $sce, $state) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryMemberInfo.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.accountData = data.object
        $scope.subDate = $scope.accountData.userBirthday.substr(0, 10)
    })
    //日期选择
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = {
        preset: 'date'
    };
    opt.time = { preset: 'time', minDate: new Date(2012, 3, 10, 7, 30), maxDate: new Date(2014, 7, 30, 9, 30), stepMinute: 5 };
    opt.datetime = {
        preset: 'datetime'
    };
    // opt.time = {
    //     preset: 'time'
    // };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        lang: 'zh',
        startYear: currYear - 100, //开始年份
        endYear: currYear + 100 //结束年份
    };
    opt.tijianTime = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式  
        lang: 'zh',
        // stepHour: 1,
        stepMinute: 30,
        // minDate: new Date(), //开始年份
        // endYear: currYear + 100 //结束年份
    };
    $("#userBirthday").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    // $("#tijianDate").val('').scroller('destroy').scroller($.extend(opt['time'], opt['tijianTime']));

    // var optDateTime = $.extend(opt['datetime'], opt['default']);
    // var optTime = $.extend(opt['time'], opt['default']);
    // $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    // $("#appTime").mobiscroll(optTime).time(optTime); 
    //下面注释部分是上面的参数可以替换改变它的样式
    // 直接写参数方法
    //$("#scroller").mobiscroll(opt).date(); 
    // Shorthand for: $("#scroller").mobiscroll({ preset: 'date' });
    //具体参数定义如下
    //{
    //preset: 'date', //日期类型--datatime --time,
    //theme: 'ios', //皮肤其他参数【android-ics light】【android-ics】【ios】【jqm】【sense-ui】【sense-ui】【sense-ui】
    //【wp light】【wp】
    //mode: "scroller",//操作方式【scroller】【clickpick】【mixed】
    //display: 'bubble', //显示方【modal】【inline】【bubble】【top】【bottom】
    //dateFormat: 'yyyy-mm-dd', // 日期格式
    //setText: '确定', //确认按钮名称
    //cancelText: '清空',//取消按钮名籍我
    //dateOrder: 'yymmdd', //面板中日期排列格
    //dayText: '日', 
    //monthText: '月',
    //yearText: '年', //面板中年月日文字
    //startYear: (new Date()).getFullYear(), //开始年份
    //endYear: (new Date()).getFullYear() + 9, //结束年份
    //showNow: true,
    //nowText: "明天",  //
    //showOnFocus: false,
    //height: 45,
    //width: 90,
    //rows: 3,
    //minDate: new Date()  从当前年，当前月，当前日开始}
    $scope.modifySave = function () {
        var worthData = $('#userBirthday').attr('placeholder')
        console.log($('#userBirthday').val())
        if ($('#userBirthday').val() != '') {
            var worthData = $('#userBirthday').val() + ' ' + '00:00:00'
        }
        console.log(worthData)
        $scope.modifySaveData = {
            userId: $scope.favoriteCookie.id,
            flag: '3',
            worth: worthData
        }
        console.log($scope.modifySaveData)
        $.ajax({
            url: ip + '/appMember/saveMemberInfo.htm',
            type: 'POST',
            data: $scope.modifySaveData,
            dataType: 'json',
            success: function (data) {
                // console.log('确认订单')
                console.log(data)
                if (data.resultCode == '1') {
                    $state.go('myInfo')
                }
            }
        })
    }

});

//选择收货地址
routeApp.controller('selectAddressCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    // var id = $stateParams.id
    $http.get(ip + '/appMember/queryMemberAddress.htm?userId=' + $scope.favoriteCookie.id + '&page=1' + '&limit=20').success(function (data) {
        console.log(data)
        $rootScope.addressData = data
        $scope.checkedAddress = function () {
            myService.setObject('checkedAddressData', this.item)
            $state.go('editOrder')
        }
        $scope.editGoodAddress = function () {
            console.log('you')
            myService.setObject('editAddressData', this.item)
            myService.setObject('editAddressDataId', this.item.id)
            myService.setObject('curProvince', '')
            myService.setObject('curCity', '')
            myService.setObject('curCounty', '')
            myService.setObject('addConsignee', '')
            myService.setObject('addMobilePhone', '')
            myService.setObject('addAddressLast', '')
            myService.setObject('editGoodAddressData', this.item)
            myService.setObject('editGoodAddressDataId', this.item.id)
            $state.go('editAddress1')
        }
    })
    $scope.clearData = function () {
        myService.setObject('curProvince', '')
        myService.setObject('curCity', '')
        myService.setObject('curCounty', '')
        myService.setObject('addConsignee', '')
        myService.setObject('addMobilePhone', '')
        myService.setObject('addAddressLast', '')
    }
});
//编辑头像
routeApp.controller('editPortraitCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    function uploadImg() {
        var btn4 = $("#law_scan4").uploadFile({
            // url: ip+"/cmsWeb/upload.htm?businessData="+goal_procuratial+'&businessModel=ATTORNEYBOX',
            url: ip + "/appMember/saveMemberPhoto.htm?id=" + $scope.favoriteCookie.id,
            //url: "http://192.168.24.30:8080/cmsWeb/upload.do?businessData="+goal_procuratial+'&businessModel=ATTORNEYBOX',
            // fileSuffixs: ["jpg", "png", "gif", "jpeg"],
            // fileSuffixs: ["jpg", "png", "gif", "jpeg", "*"],
            maximumFilesUpload: 1,//最大文件上传数
            onComplete: function (msg) {
                console.log(msg);
                $state.go('myInfo')
                // console.log(goal_lawyer)
                // var newMsg = $.parseJSON(msg);
                // console.log(newMsg);
                // $('#finish4').html(newMsg.resultDesc);

            },
            onAllComplete: function () {

            },

            isGetFileSize: true,//是否获取上传文件大小，设置此项为true时，将在onChosen回调中返回文件fileSize和获取大小时的错误提示文本errorText
            onChosen: function (file, obj, fileSize, errorText) {
                var newFileSize = parseInt(fileSize);
                if (!errorText && newFileSize <= 5120) {
                    $("#file_size").text(file + "文件大小为：" + fileSize + "KB");
                } else {
                    alert('文件大小不能大于5M');
                    return false;
                }
                return true;//返回false将取消当前选择的文件
            },
            perviewElementId: "fileList4", //设置预览图片的元素id
            perviewImgStyle: { width: '100px', height: '100px' }//设置预览图片的样式
        });

        var upload4 = btn4.data("uploadFileData");

        $("#law_files4").click(function () {
            upload4.submitUpload();

        });
    }
    uploadImg()
});
//体检报告
routeApp.controller('queryReportCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    myService.set('selectCheckNum', '')
    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.selectData = data.rows
        if ($scope.selectData.length == 0) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1500,
                content: '暂无数据'
            })
            setTimeout(function () {
                $rootScope.goback()
            }, 1500);
            return false
        }
        $http.get(ip + '/appMember/queryRightData.htm?checkTimes=' + $scope.selectData[0].checkNum + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
            console.log(data)
            $scope.selectDataOne = data
        })
    })
});
//选择日期指令
routeApp.directive('queryReport', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {
                console.log($rootScope.newselectDataOne)
                $('.spanSpan').click(function () {
                    $('.allMask').show()
                    $('.selectHealthDate').show()
                })
                $('.selectHealthDate').find('div').click(function () {
                    console.log($(this).html())
                    $('.selectHealthDateSpan').html($(this).html())
                    myService.set('selectCheckNum', $(this).attr('checknum'))
                    var selectCheckNum = myService.get('selectCheckNum')
                    console.log(selectCheckNum)

                    $http.get(ip + '/appMember/queryRightData.htm?checkTimes=' + selectCheckNum + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
                        console.log(data)
                        $rootScope.newselectDataOne = data
                        console.log($rootScope.newselectDataOne)
                    })
                    $('.allMask').hide()
                    $('.selectHealthDate').hide()
                })
            }
        }
    }
})

//综述及建议
routeApp.controller('totalSugCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        console.log(data)
        $scope.selectData = data.rows
        var selectCheckNum = myService.get('selectCheckNum');
        console.log(selectCheckNum)
        if (selectCheckNum == undefined) {
            $http.get(ip + '/appMember/queryReport.htm?checkTimes=' + $scope.selectData[0].checkNum + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
                console.log(data)
                $scope.data = data.rows[0]
                $scope.newSummary = $scope.data.summary.replace(/\r\n/g, '<br/> \r\n')
                $scope.newAdvice = $scope.data.advice.replace(/\r\n/g, '<br/> \r\n')
            })
        } else {
            $http.get(ip + '/appMember/queryReport.htm?checkTimes=' + selectCheckNum + '&userId=' + $scope.favoriteCookie.id).success(function (data) {
                console.log(data)
                $scope.data = data.rows[0]
                $scope.newSummary = $scope.data.summary.replace(/\r\n/g, '<br/> \r\n')
                $scope.newAdvice = $scope.data.advice.replace(/\r\n/g, '<br/> \r\n')
            })
        }


    })
});
//体检报告（选项卡）
routeApp.controller('healthRepCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id).success(function (data) {
        $scope.selectData = data.rows
        $http.get(ip + '/appMember/queryDepartment.htm').success(function (data) {
            console.log(data)
            $scope.healthData = data.rows
            for (var i = 0; i < $scope.healthData.length; i++) {
                for (var m = 0; m < $scope.healthData[i].list.length; m++) {
                    $scope.healthData[i].list[m].check = false
                }
            }
            console.log($scope.healthData)
            $scope.explainShow = function () {
                alert(1)
            }
            var btn = true
            $scope.getLevel3 = function () {
                $('.reportTable').hide()
                $('#healthSummary').hide()
                if (this.item2.check == false) {
                    btn = true
                }
                if (this.item2.check == true) {
                    btn = false
                }
                if (btn) {
                    for (var i = 0; i < $scope.healthData.length; i++) {
                        for (var m = 0; m < $scope.healthData[i].list.length; m++) {
                            $scope.healthData[i].list[m].check = false
                        }
                    }
                    this.item2.check = true
                    var selectCheckNum = myService.get('selectCheckNum')
                    console.log(selectCheckNum)
                    if (selectCheckNum == undefined) {
                        $http.get(ip + '/appMember/queryCheckResult.htm?deptName=' + this.item2.code + '&userId=' + $scope.favoriteCookie.id + '&checkTimes=' + $scope.selectData[0].checkNum).success(function (data) {
                            console.log(data)
                            $scope.level3Data = data.rows
                            $('.reportTable').show()
                            $('#healthSummary').show()
                            console.log($scope.level3Data.length)
                            console.log($scope.healthData)
                            if ($scope.level3Data.length != 0) {
                                $scope.level3DataSummary = $scope.level3Data[0].summary
                                $scope.newSummary = $scope.level3DataSummary.replace(/\r\n/g, '<br/> \r\n')
                            }
                        })
                    } else {
                        $http.get(ip + '/appMember/queryCheckResult.htm?deptName=' + this.item2.code + '&userId=' + $scope.favoriteCookie.id + '&checkTimes=' + selectCheckNum).success(function (data) {
                            console.log(data)
                            $scope.level3Data = data.rows
                            $('.reportTable').show()
                            $('#healthSummary').show()
                            console.log($scope.level3Data.length)
                            console.log($scope.healthData)
                            if ($scope.level3Data.length != 0) {
                                $scope.level3DataSummary = $scope.level3Data[0].summary
                                $scope.newSummary = $scope.level3DataSummary.replace(/\r\n/g, '<br/> \r\n')
                            }
                        })
                    }

                } else {
                    this.item2.check = false
                }
                btn = !btn
            }
        })
    })


});
//图片报告
routeApp.controller('imgRepCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip;
    var id = $stateParams.id;
    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id).success(function(data){
        $scope.selectData = data.rows;
        var selectCheckNum = myService.get('selectCheckNum');
        if(selectCheckNum==undefined){
            $http.get(ip+'/appSetMeal/queryPictureState1.htm?inspectNum=' + $scope.selectData[0].checkNum).success(function(res){
                $scope.dan=res.rows.slice(0,6);
                $scope.pin=res.rows.slice(6);
                myService.setObject('imgRepData', res.rows)
            })
        }else{
            $http.get(ip+'/appSetMeal/queryPictureState1.htm?inspectNum='+selectCheckNum).success(function(res){
                $scope.dan=res.rows.slice(0,6);
                $scope.pin=res.rows.slice(6);
                myService.setObject('imgRepData', res.rows)
            })
        }

    })


    $scope.rentichengfen = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400111' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    /*
    $scope.TCD = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400112' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.dongmai = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400113' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.feigongneng = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400114' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.xindiantu = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400121' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.tingli = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400122' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }

    $scope.shentinianling = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400123' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.jiating = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400124' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.yufang = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400131' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.yingyan = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400132' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.DR = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400211' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.gumidu = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400212' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.CT = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400213' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.heci = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400214' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.PET = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400221' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.caichao = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400222' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.neikuijing = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400223' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.jingshen = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400224' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }
    $scope.yandi = function () {
        $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject=400231' + '&inspectNum=A003').success(function (data) {
            console.log(data)
            $scope.imgRepData = data
            console.log($scope.imgRepData)
            if (data.rows.length < 1) {
                $('#simple-dialogBox').dialogBox({
                    hasMask: true,
                    autoHide: true,
                    time: 800,
                    content: '暂无数据'
                })
                return false
            }
            if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                myService.setObject('imgRepData', $scope.imgRepData)
                window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
            } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                myService.setObject('imgRepData', $scope.imgRepData)
                $state.go('imgShow')
            }
        })
    }*/
});
//图片报告详情
routeApp.controller('imgDetailCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin();
    $scope.imgIp = ip;
    var id = $stateParams.id;
    /*
    $scope.imgAll=[
        {physicalProject: "400111",physicalProjectName: "TCD"},
        {physicalProject: "400112",physicalProjectName: "动脉硬化"},
        {physicalProject: "400113",physicalProjectName: "肺功能"},
        {physicalProject: "400114",physicalProjectName: "心电图"},
        {physicalProject: "400121",physicalProjectName: "听力检测"},
        {physicalProject: "400122",physicalProjectName: "精神压力分析"},
        {physicalProject: "400211",physicalProjectName: "DR"},
        {physicalProject: "400212",physicalProjectName: "骨密度"},
        {physicalProject: "400213",physicalProjectName: "CT"},
        {physicalProject: "400214",physicalProjectName: "核磁"},
        {physicalProject: "400221",physicalProjectName: "PET CT"},
        {physicalProject: "400222",physicalProjectName: "彩超"},
        {physicalProject: "400223",physicalProjectName: "内窥镜"},
        {physicalProject: "400224",physicalProjectName: "眼底照相"},
    ];*/
    $http.get(ip + '/appMember/queryCheckTime.htm?userId=' + $scope.favoriteCookie.id).success(function(data){
        $scope.selectData = data.rows;
        var selectCheckNum = myService.get('selectCheckNum');
        if(selectCheckNum==undefined){
            $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject='+id + '&inspectNum='+$scope.selectData[0].checkNum).success(function (data) {
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    $state.go('imgRep')
                    return false
                }
            })
        }else{
            $http.get(ip + '/appSetMeal/queryMyPicture.htm?userId=' + $scope.favoriteCookie.id + '&physicalProject='+id + '&inspectNum='+selectCheckNum).success(function (data) {
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    $state.go('imgRep')
                    return false
                }
            })
        }
    })
    $scope.imgAll=myService.getObject('imgRepData');
    for(var i=$scope.imgAll.length-1;i>=0;i--){
        if($scope.imgAll[i].imgList.length===0){
            $scope.imgAll.splice(i,1);
        }else if($scope.imgAll[i].physicalProject==id){
            $scope.first=$scope.imgAll[i];
            $scope.imgAll.splice(i,1);
        }
    }
    $scope.imgAll.unshift($scope.first);
});
//图片报告图片展示页
routeApp.controller('imgShowCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.imgData = myService.getObject('imgRepData')
    console.log($scope.imgData)
});
//图片报告Pdf展示页
routeApp.controller('pdfShowCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.pdfData = myService.getObject('imgRepData')
    console.log($scope.pdfData)
});
// 健康管理方案指令
routeApp.directive('healthProject', function ($timeout, $rootScope, $http, myService) {
    return {
        restrict: 'A',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {
                console.log($rootScope.newselectDataOne)
                $('.spanSpan').click(function () {
                    $('.allMask').show()
                    $('.selectHealthDate').show()
                })
                $('.selectHealthDate').find('div').click(function () {
                    console.log($(this).html())
                    $('.selectHealthDateSpan').html($(this).html())
                    myService.set('queryDateTime', $(this).attr('checknum'))
                    var queryDateTime = myService.get('queryDateTime')
                    console.log(queryDateTime)
                    $('.allMask').hide()
                    $('.selectHealthDate').hide()
                })
            }
        }
    }
})
//健康管理方案
routeApp.controller('healthProjectCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    myService.set('queryDateTime', '')


    $http.get(ip + '/appSetMeal/queryForDate.htm?userId=' + $scope.favoriteCookie.id + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone).success(function (data) {
        console.log(data)
        $scope.queryDate = data.rows
        if ($scope.queryDate.length == 0) {
            $('#simple-dialogBox').dialogBox({
                hasMask: true,
                autoHide: true,
                time: 1500,
                content: '暂无数据'
            })
            setTimeout(function () {
                $rootScope.goback()
            }, 1500);
            return false
        }
        for (var i = 0; i < $scope.queryDate.length; i++) {
            $scope.queryDate[i].checkTime = $scope.queryDate[i].checkTime.substr(0, 10)
        }

        $scope.projectOne = function () {
            var queryDateTime = myService.get('queryDateTime')
            console.log(queryDateTime)
            if (queryDateTime == undefined) {
                var createTime = $scope.queryDate[0].checkTime + ' ' + '00:00:00'
            }
            if (queryDateTime != undefined) {
                var createTime = myService.get('queryDateTime') + ' ' + '00:00:00'
            }
            console.log(createTime)
            $http.get(ip + '/appSetMeal/queryMyManagePlan.htm?userId=' + $scope.favoriteCookie.id + '&manageType=5011' + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone + '&checkTime=' + createTime).success(function (data) {
                console.log(data)
                $scope.imgRepData = data
                console.log($scope.imgRepData)
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    return false
                }
                if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
                } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    $state.go('imgShow')
                }
            })
        }
        $scope.projectTwo = function () {
            var queryDateTime = myService.get('queryDateTime')
            console.log(queryDateTime)
            if (queryDateTime == undefined) {
                var createTime = $scope.queryDate[0].checkTime + ' ' + '00:00:00'
            }
            if (queryDateTime != undefined) {
                var createTime = myService.get('queryDateTime') + ' ' + '00:00:00'
            }
            $http.get(ip + '/appSetMeal/queryMyManagePlan.htm?userId=' + $scope.favoriteCookie.id + '&manageType=5012' + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone + '&checkTime=' + createTime).success(function (data) {
                console.log(data)
                $scope.imgRepData = data
                console.log($scope.imgRepData)
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    return false
                }
                if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
                } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    $state.go('imgShow')
                }
            })
        }
        $scope.projectThree = function () {
            var queryDateTime = myService.get('queryDateTime')
            console.log(queryDateTime)
            if (queryDateTime == undefined) {
                var createTime = $scope.queryDate[0].checkTime + ' ' + '00:00:00'
            }
            if (queryDateTime != undefined) {
                var createTime = myService.get('queryDateTime') + ' ' + '00:00:00'
            }
            $http.get(ip + '/appSetMeal/queryMyManagePlan.htm?userId=' + $scope.favoriteCookie.id + '&manageType=5021' + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone + '&checkTime=' + createTime).success(function (data) {
                console.log(data)
                $scope.imgRepData = data
                console.log($scope.imgRepData)
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    return false
                }
                if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
                } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    $state.go('imgShow')
                }
            })
        }
        $scope.projectFour = function () {
            var queryDateTime = myService.get('queryDateTime')
            console.log(queryDateTime)
            if (queryDateTime == undefined) {
                var createTime = $scope.queryDate[0].checkTime + ' ' + '00:00:00'
            }
            if (queryDateTime != undefined) {
                var createTime = myService.get('queryDateTime') + ' ' + '00:00:00'
            }
            $http.get(ip + '/appSetMeal/queryMyManagePlan.htm?userId=' + $scope.favoriteCookie.id + '&manageType=5022' + '&userCard=' + $scope.favoriteCookie.userCard + '&telephone=' + $scope.favoriteCookie.telephone + '&checkTime=' + createTime).success(function (data) {
                console.log(data)
                $scope.imgRepData = data
                console.log($scope.imgRepData)
                if (data.rows.length < 1) {
                    $('#simple-dialogBox').dialogBox({
                        hasMask: true,
                        autoHide: true,
                        time: 800,
                        content: '暂无数据'
                    })
                    return false
                }
                if ($scope.imgRepData.rows[0].fileType == 'pdf' || $scope.imgRepData.rows[0].fileType == 'docx' || $scope.imgRepData.rows[0].fileType == 'DOCX' || $scope.imgRepData.rows[0].fileType == 'PDF' || $scope.imgRepData.rows[0].fileType == 'XPS' || $scope.imgRepData.rows[0].fileType == 'xps') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    window.location.href = ip + $scope.imgRepData.rows[0].fileUrl
                } else if ($scope.imgRepData.rows[0].fileType == 'png' || $scope.imgRepData.rows[0].fileType == 'PNG' || $scope.imgRepData.rows[0].fileType == 'jpg' || $scope.imgRepData.rows[0].fileType == 'JPG' || $scope.imgRepData.rows[0].fileType == 'jpeg' || $scope.imgRepData.rows[0].fileType == 'JPEG') {
                    myService.setObject('imgRepData', $scope.imgRepData)
                    $state.go('imgShow')
                }
            })
        }
    })

});

//选择套餐进入详情页进行预约
routeApp.controller('selectMealDetailCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip
    $scope.data = myService.getObject('curSelectMeal')
    //点击全屏显示图片
    $('.detailNext').click(function () {
        console.log(1)
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=yes')
        $('#imgFullscreen').css('display', 'block')
        $('#imgFullscreen').siblings().css('display', 'none')
        $('.productsStyle').css('display', 'none')
    })
    $('#imgFullscreen').click(function () {
        $('#viewId').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no')
        $('#imgFullscreen').css('display', 'none')
        $(this).siblings().css('display', 'block')
        $('.productsStyle').css('display', 'none')
        $('#cartSelect').css('display', 'none')
    })
});


//体检报告指令
routeApp.directive('healthRep', function ($timeout, $rootScope, $http) {
    return {
        restrict: 'A',
        link: function ($scope, $apply, element, attr) {
            if ($scope.$last === true) {

            }
        }
    }
})

//huanxin
routeApp.controller('queryhxCtrl', function ($scope, $state, $rootScope, $http, myService, $stateParams, $sce) {
    $rootScope.isLogin()
    $scope.imgIp = ip

    // var query = new URI(window.location).search(true);
    var username = myService.getObject('easmInfo').user;
    var password = myService.getObject('easmInfo').psw;
    var touser = '1138170216115188#kefuchannelapp36239';
    var conn = new WebIM.connection({
        https: WebIM.config.https,
        url: WebIM.config.xmppURL,
        isAutoLogin: WebIM.config.isAutoLogin,
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions
    });


    function registerUser(username, password) {
        var options = {
            username: username,
            password: password,
            nickname: username,
            appKey: WebIM.config.appkey,
            success: function (message) {
                login(username, password);
            },
            error: function (message) {
                switch (message.type) {
                    case 17:
                        login(username, password);
                        break;
                    default:
                        break;
                }
            },
            apiUrl: WebIM.config.apiURL
        };

        WebIM.utils.registerUser(options);
    }

    function login(username, password) {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: username,
            pwd: password,
            appKey: WebIM.config.appkey
        };

        conn.open(options);
    }

    if (username && password) {
        login(username, password);
    }
    conn.listen({
        onOpened: function (message) { //连接成功回调
            console.log(message)
            //如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            conn.setPresence();
        },
        onClosed: function (message) {
        }, //连接关闭回调
        onTextMessage: function (message) {
            console.log(message)
            if (!message.error) {
                message.self = false;
                $scope.chatlist.push(message);
                $scope.$apply();
            }
        }, //收到文本消息
        onEmojiMessage: function (message) {
        }, //收到表情消息
        onPictureMessage: function (message) {
        }, //收到图片消息
        onCmdMessage: function (message) {
        }, //收到命令消息
        onAudioMessage: function (message) {
        }, //收到音频消息
        onLocationMessage: function (message) {
        }, //收到位置消息
        onFileMessage: function (message) {
        }, //收到文件消息
        onVideoMessage: function (message) {
        }, //收到视频消息
        onPresence: function (message) {
        }, //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
        onRoster: function (message) {
        }, //处理好友申请
        onInviteMessage: function (message) {
        }, //处理群组邀请
        onOnline: function () {

        }, //本机网络连接成功
        onOffline: function () {
        }, //本机网络掉线
        onError: function (message) {
            console.log(message)
        } //失败回调
    });

    $scope.chatlist = [];
    $scope.msg = null;
    $scope.sendmsg = function () {
        if ($scope.msg) {
            var id = conn.getUniqueId();
            var msg = new WebIM.message('txt', id);
            msg.set({
                msg: $scope.msg,
                to: touser,
                success: function (id, serverMsgId) {
                    $scope.chatlist.push({
                        data: $scope.msg,
                        from: username,
                        to: touser,
                        self: true
                    });
                    $scope.msg = null;
                    $scope.$apply();
                }
            });
            conn.send(msg.body);
        }
    }

});

//报告解读
routeApp.controller('reportCtrl',function($scope,$state){
    $scope.formData={};
    $scope.search=function(){
        console.log($scope.formData.key)
        $state.go('report.index',{key:$scope.formData.key})
    }
})
//报告解读列表
routeApp.controller('reportListCtrl',function($scope,$http,$stateParams){
    $http.get(ip+'/appCms/getReportInfoTitle.htm?key='+$stateParams.key).success(function(data){
        console.log(data)
        $scope.data=data;
    })
})
//报告解读详情
routeApp.controller('reportDetailCtrl',function($scope,$http,$stateParams,$sce){
    $http.get(ip+'/appCms/getReportInfoContent.htm?id='+$stateParams.id).success(function(data){
        console.log(data)
        $scope.data=data[0];
        $scope.content=$sce.trustAsHtml(data[0].content)
    })
})