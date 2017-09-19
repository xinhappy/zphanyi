/**
 * Created by life on 2016/12/21.
 */
// var ip='http://http://192.168.24.194:3500/';//life
//var ip = 'http://182.92.184.13:8080';//alicloud
 var ip = '';//alicloud 打包
// var ip = 'http://192.168.27 .219:8080';//xiaolei
// var ip = 'http://192.168.27.229:8080';//haiyue
// var ip = 'http://192.168.27.216:8080';//zhiyong
// var ip = 'http://192.168.27.203:8088';//zhiyong
var routeApp = angular.module('mainApp', ['ui.router', 'ngSanitize', 'ngCookies']);
routeApp.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    });
}).config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.interceptors.push('userInterceptor');
    $urlRouterProvider.when("", "/main");
    $stateProvider
        .state("main", {//加载页面
            url: "/main",
            templateUrl: "views/main.html",
            controller: 'mainCtrl'
        })
        .state("mainTemp", {//加载页面详情
            url: "/mainTemp/:id",
            templateUrl: "views/mainTemp.html",
            controller: 'mainTempCtrl'
        })
        .state("main.detail", {//加载页面详情id
            url: "/mainTemp/:id",
            templateUrl: "views/mainTemp.html",
            controller: 'mainTempCtrl'
        })
        .state("home", {//首页
            url: "/home",
            templateUrl: "views/home.html",
            controller: 'homeCtrl'
        })
        .state("lbtDetail", {//首页轮播详情
            url: "/lbtDetail/:id/:articleId",
            templateUrl: "views/lbtDetail.html",
            controller: 'lbtDetailCtrl'
        })
        .state("home.detail", {//首页轮播详情id
            url: "/lbtDetail/:id/:articleId",
            templateUrl: "views/lbtDetail.html",
            controller: 'lbtDetailCtrl'
        })

        .state("lbtDetailNext", {//首页第二层轮播详情
            url: "/lbtDetailNext/:id/:articleId",
            templateUrl: "views/lbtDetailNext.html",
            controller: 'lbtDetailNextCtrl'
        })
        .state("lbtDetailNext.detail", {//首页第二层轮播详情id
            url: "/lbtDetailNext/:id/:articleId",
            templateUrl: "views/lbtDetailNext.html",
            controller: 'lbtDetailNextCtrl'
        })
        .state("lbtDoctorsInfo", {//医生详细介绍
            url: "/lbtDoctorsInfo",
            templateUrl: "views/lbtDoctorsInfo.html",
            controller: 'lbtDoctorsInfoCtrl'
        })
        .state("login", {//登录页面
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'loginCtrl'
        })
        .state("regist", {//注册页面
            url: "/regist",
            templateUrl: "views/regist.html",
            controller: 'registCtrl'
        })
        .state("forget", {//忘记密码页面
            url: "/forget",
            templateUrl: "views/forget.html",
            controller: 'forgetCtrl'
        })
        .state("exit", {//忘记密码页面
            url: "/exit",
            templateUrl: "views/exit.html",
            controller: 'exitCtrl'
        })
        .state("appoint", {//在线预约
            url: "/appoint",
            templateUrl: "views/appoint.html",
            controller: 'appointCtrl'
        })
        .state("selectMealDetail", {//在线预约套餐详情
            url: "/selectMealDetail",
            templateUrl: "views/selectMealDetail.html",
            controller: 'selectMealDetailCtrl'
        })
        .state("mall", {//韩一商城 产品列表
            url: "/mall",
            templateUrl: "views/mall.html",
            controller: 'mallCtrl'
        })
        .state("productsDetail", {//韩一商城 产品详情
            url: "/productsDetail/:id",
            templateUrl: "views/productsDetail.html",
            controller: 'productsDetailCtrl'
        })
        .state("mall.detail", {//韩一商城 产品详情id
            url: "/productsDetail/:id",
            templateUrl: "views/productsDetail.html",
            controller: 'productsDetailCtrl'
        })
        .state("productsDetailNext", {//韩一商城 产品详情id下一层
            url: "/productsDetailNext",
            templateUrl: "views/productsDetailNext.html",
            controller: 'productsDetailNextCtrl'
        })
        .state("setMeal", {//套餐服务
            url: "/setMeal",
            templateUrl: "views/setMeal.html",
            controller: 'setMealCtrl'
        })
        .state("setMealDetail", {//套餐服务详情
            url: "/setMealDetail/:id",
            templateUrl: "views/setMealDetail.html",
            controller: 'setMealDetailCtrl'
        })
        .state("setMeal.detail", {//套餐服务详情id
            url: "/setMealDetail/:id",
            templateUrl: "views/setMealDetail.html",
            controller: 'setMealDetailCtrl'
        })
        .state("healthNews", {//韩一咨讯
            url: "/healthNews",
            templateUrl: "views/healthNews.html",
            controller: 'healthNewsCtrl'
        })
        .state("healthNewsDetail", {//套餐服务详情
            url: "/healthNewsDetail/:id",
            templateUrl: "views/healthNewsDetail.html",
            controller: 'healthNewsDetailCtrl'
        })
        .state("healthNews.detail", {//套餐服务详情id
            url: "/healthNewsDetail/:id",
            templateUrl: "views/healthNewsDetail.html",
            controller: 'healthNewsDetailCtrl'
        })

        .state("userInfo", {//个人中心
            url: "/userInfo",
            templateUrl: "views/userInfo.html",
            controller: 'userInfoCtrl'
        })
        .state("account", {//个人中心-账户管理
            url: "/account",
            templateUrl: "views/account.html",
            controller: 'accountCtrl'
        })
        .state("addressControl", {//个人中心-地址管理
            url: "/addressControl",
            templateUrl: "views/addressControl.html",
            controller: 'addressControlCtrl'
        })
        .state("membersControl", {//我的联系人
            url: "/membersControl",
            templateUrl: "views/membersControl.html",
            controller: 'membersControlCtrl'
        })
        .state("membersDetail", {//我的联系人详情
            url: "/membersDetail",
            templateUrl: "views/membersDetail.html",
            controller: 'membersDetailCtrl'
        })
        .state("addContacts", {//新增联系人
            url: "/addContacts",
            templateUrl: "views/addContacts.html",
            controller: 'addContactsCtrl'
        })
        .state("editContacts", {//编辑联系人
            url: "/editContacts",
            templateUrl: "views/editContacts.html",
            controller: 'editContactsCtrl'
        })
        //重用membersControl1个页面*************************************
        .state("membersControl1", {//我的联系人
            url: "/membersControl1",
            templateUrl: "views/membersControl1.html",
            controller: 'membersControlCtrl1'
        })
        //end*************************************
        //重用userInfo1个页面*************************************
        .state("editInfo1", {//我的联系人
            url: "/editInfo1",
            templateUrl: "views/editInfo1.html",
            controller: 'editInfoCtrl1'
        })
        //end*************************************
        .state("cart", {//购物车
            url: "/cart",
            templateUrl: "views/cart.html",
            controller: 'cartCtrl'
        })
        .state("editOrder", {//填写订单
            url: "/editOrder",
            templateUrl: "views/editOrder.html",
            controller: 'editOrderCtrl'
        })
        .state("goPay", {//去支付
            url: "/goPay",
            templateUrl: "views/goPay.html",
            controller: 'goPayCtrl'
        })
        .state("goPayDetail", {//从订单详情去支付
            url: "/goPayDetail",
            templateUrl: "views/goPayDetail.html",
            controller: 'goPayDetailCtrl'
        })
        .state("deliveryWay", {//选择配送支付方式
            url: "/deliveryWay",
            templateUrl: "views/deliveryWay.html",
            controller: 'deliveryWayCtrl'
        })
        .state("editInfo", {//编辑体检人信息
            url: "/editInfo",
            templateUrl: "views/editInfo.html",
            controller: 'editInfoCtrl'
        })
        .state("myAppoint", {//我的预约
            url: "/myAppoint",
            templateUrl: "views/myAppoint.html",
            controller: 'myAppointCtrl'
        })
        .state("myAppointDetail", {//我的预约-详情
            url: "/myAppointDetail",
            templateUrl: "views/myAppointDetail.html",
            controller: 'myAppointDetailCtrl'
        })
        .state("selectMeal", {//选择套餐
            url: "/selectMeal",
            templateUrl: "views/selectMeal.html",
            controller: 'selectMealCtrl'
        })
        .state("waitPay", {//代付款
            url: "/waitPay",
            templateUrl: "views/waitPay.html",
            controller: 'waitPayCtrl'
        })
        .state("allOrder", {//全部订单
            url: "/allOrder",
            templateUrl: "views/allOrder.html",
            controller: 'allOrderCtrl'
        })
        .state("waitDeliver", {//待收货
            url: "/waitDeliver",
            templateUrl: "views/waitDeliver.html",
            controller: 'waitDeliverCtrl'
        })
        .state("orderDetail", {//订单详情
            url: "/orderDetail",
            templateUrl: "views/orderDetail.html",
            controller: 'orderDetailCtrl'
        })
        .state("addAddress", {//新增收货地址
            url: "/addAddress",
            templateUrl: "views/addAddress.html",
            controller: 'addAddressCtrl'
        })
        .state("addAddress1", {//新增收货地址1重用
            url: "/addAddress1",
            templateUrl: "views/addAddress1.html",
            controller: 'addAddressCtrl1'
        })
        .state("editAddress", {//编辑收货人地址
            url: "/editAddress",
            templateUrl: "views/editAddress.html",
            controller: 'editAddressCtrl'
        })
        .state("editAddress1", {//编辑收货人地址重用
            url: "/editAddress1",
            templateUrl: "views/editAddress1.html",
            controller: 'editAddressCtrl1'
        })
        .state("province", {//省
            url: "/province",
            templateUrl: "views/province.html",
            controller: 'provinceCtrl'
        })
        .state("city", {//市
            url: "/city",
            templateUrl: "views/city.html",
            controller: 'cityCtrl'
        })
        .state("county", {//县
            url: "/county",
            templateUrl: "views/county.html",
            controller: 'countyCtrl'
        })
        //重用省市县************************************
        .state("province1", {//省
            url: "/province1",
            templateUrl: "views/province1.html",
            controller: 'provinceCtrl1'
        })
        .state("city1", {//市
            url: "/city1",
            templateUrl: "views/city1.html",
            controller: 'cityCtrl1'
        })
        .state("county1", {//县
            url: "/county1",
            templateUrl: "views/county1.html",
            controller: 'countyCtrl1'
        })
        //end************************************
        //重用省市县************************************
        .state("province2", {//省
            url: "/province2",
            templateUrl: "views/province2.html",
            controller: 'provinceCtrl2'
        })
        .state("city2", {//市
            url: "/city2",
            templateUrl: "views/city2.html",
            controller: 'cityCtrl2'
        })
        .state("county2", {//县
            url: "/county2",
            templateUrl: "views/county2.html",
            controller: 'countyCtrl2'
        })
        //end************************************
        //重用省市县3************************************
        .state("province3", {//省
            url: "/province3",
            templateUrl: "views/province3.html",
            controller: 'provinceCtrl3'
        })
        .state("city3", {//市
            url: "/city3",
            templateUrl: "views/city3.html",
            controller: 'cityCtrl3'
        })
        .state("county3", {//县
            url: "/county3",
            templateUrl: "views/county3.html",
            controller: 'countyCtrl3'
        })
        //end************************************
        .state("accountSafety", {//账户安全
            url: "/accountSafety",
            templateUrl: "views/accountSafety.html",
            controller: 'accountSafetyCtrl'
        })
        .state("modifyPassword", {//修改密码(获取验证码)
            url: "/modifyPassword",
            templateUrl: "views/modifyPassword.html",
            controller: 'modifyPasswordCtrl'
        })
        .state("editPassword", {//修改密码(填写新密码)
            url: "/editPassword",
            templateUrl: "views/editPassword.html",
            controller: 'editPasswordCtrl'
        })
        .state("idVerify", {//实名认证
            url: "/idVerify",
            templateUrl: "views/idVerify.html",
            controller: 'idVerifyCtrl'
        })
        .state("modifyRealName", {//修改真实姓名
            url: "/modifyRealName",
            templateUrl: "views/modifyRealName.html",
            controller: 'modifyRealNameCtrl'
        })
        .state("modifyId", {//修改身份证号
            url: "/modifyId",
            templateUrl: "views/modifyId.html",
            controller: 'modifyIdCtrl'
        })
        .state("myInfo", {//个人信息
            url: "/myInfo",
            templateUrl: "views/myInfo.html",
            controller: 'myInfoCtrl'
        })
        .state("modifyNickname", {//修改昵称
            url: "/modifyNickname",
            templateUrl: "views/modifyNickname.html",
            controller: 'modifyNicknameCtrl'
        })
        .state("modifyUserSex", {//修改性别
            url: "/modifyUserSex",
            templateUrl: "views/modifyUserSex.html",
            controller: 'modifyUserSexCtrl'
        })
        .state("modifyUserBirthday", {//修改出生日期
            url: "/modifyUserBirthday",
            templateUrl: "views/modifyUserBirthday.html",
            controller: 'modifyUserBirthdayCtrl'
        })
        .state("selectAddress", {//购物选择收货地址
            url: "/selectAddress",
            templateUrl: "views/selectAddress.html",
            controller: 'selectAddressCtrl'
        })
        .state("setMealDetail1", {//套餐侧边栏详情页
            url: "/setMealDetail1",
            templateUrl: "views/setMealDetail1.html",
            controller: 'setMealDetailCtrl1'
        })
        .state("queryReport", {//体检报告
            url: "/queryReport",
            templateUrl: "views/queryReport.html",
            controller: 'queryReportCtrl'
        })
        .state("totalSug", {//综述及建议
            url: "/totalSug",
            templateUrl: "views/totalSug.html",
            controller: 'totalSugCtrl'
        })
        .state("healthRep", {//体检报告（选项卡）
            url: "/healthRep",
            templateUrl: "views/healthRep.html",
            controller: 'healthRepCtrl'
        })
        .state("imgRep", {//图片报告
            url: "/imgRep",
            templateUrl: "views/imgRep.html",
            controller: 'imgRepCtrl'
        })
        .state("imgDetail", {//图片报告详情
            url: "/imgDetail/:id",
            templateUrl: "views/imgDetail.html",
            controller: 'imgDetailCtrl'
        })
        .state("editPortrait", {//上传头像
            url: "/editPortrait",
            templateUrl: "views/editPortrait.html",
            controller: 'editPortraitCtrl'
        })
        .state("queryhx", {//huanxin
            url: "/queryhx",
            templateUrl: "views/queryhx.html",
            controller: 'queryhxCtrl'
        })
        .state("healthProject", {//健康管理方案
            url: "/healthProject",
            templateUrl: "views/healthProject.html",
            controller: 'healthProjectCtrl'
        })
        .state("imgShow", {//图片报告图片展示页
            url: "/imgShow",
            templateUrl: "views/imgShow.html",
            controller: 'imgShowCtrl'
        })
        .state("pdfShow", {//图片报告Pdf展示页
            url: "/pdfShow",
            templateUrl: "views/pdfShow.html",
            controller: 'pdfShowCtrl'
        })
        .state("report", {//报告解读
            url: "/report",
            templateUrl: "views/report.html",
            controller: 'reportCtrl'
        })
        .state("report.index", {//报告解读列表
            url: "/index",
            templateUrl: "views/reportList.html",
            controller: 'reportListCtrl',
            params:{'key':''}
        })
        .state("reportDetail", {//报告解读详情
            url: "/reportDetail/:id",
            templateUrl: "views/reportDetail.html",
            controller: 'reportDetailCtrl'
        })
});
