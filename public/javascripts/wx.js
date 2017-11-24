/**
 * 微信相关操作
 * User: heliang
 * Date: 2017/9/7.
 */


axios.post('/wx/wxJssdk/getJssdk', {url: location.href.split('#')[0]}).then((response) => {
    var data = response.data;

    // console.log();

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'chooseImage',
            'uploadImage',
            'previewImage',
            'downloadImage',
            'openLocation',//使用微信内置地图查看地理位置接口
            'getLocation', //获取地理位置接口
            'scanQRCode',
            'onMenuShareQQ',
            'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {

        //朋友圈分享
        wx.onMenuShareTimeline({
            title: '朋友圈分享标题', // 分享标题
            link: 'http://hw.3w.net579.com/wx', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://hw.3w.net579.com/images/2.jpg', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                alert("用户点击分享按钮");
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                alert("用户点击取消按钮");
            }
        });


        //分享给朋友
        wx.onMenuShareAppMessage({
            title: "分享标题",
            desc: "描述",
            link: 'http://hw.3w.net579.com/wx_index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://hw.3w.net579.com/images/2.jpg', // 分享图标
        });

        //检测APi是否可用
        wx.checkJsApi({
            jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // alert(res.checkResult.chooseImage);
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });


        //图片预览

        // function previewImage(current){
        //     wx.previewImage({
        //         current: '', // 当前显示图片的http链接
        //         urls: [] // 需要预览的图片http链接列表
        //     });
        //
        // }

        function getLoaction(callback){
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    callback!=null?callback(latitude,longitude):null;
                }
            });
        }

        
        function openLocationFn(latitude,longitude) {
            wx.openLocation({
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                name: '测试位置', // 位置名
                address: '测试位置详情', // 地址详情说明
                scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: 'http://www.baidu.com' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }



        //下载图片
        function downLoadImg(serverId,callback){
            wx.downloadImage({
                serverId:serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var localId = res.localId; // 返回图片下载后的本地ID
                    callback!=null?callback(localId):null;
                }
            });
        }

        //上传图片
        function uploadImage(localId,callback) {
            wx.uploadImage({
                localId:localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    callback!=null?callback(serverId):null;
                }
            });
        }

        //选取图片
        function chooseImage(){
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    var localId=localIds[0];
                    uploadImage(localId,function(serverId){
                        downLoadImg(serverId,function(localId){
                            img.src=localId;
                        })
                    });
                }
            });
        }

        //扫一扫
        function scanFn(){
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    document.querySelector('#scanMsg').innerHTML=result;
                }
            });
        }

        //获取关注用户信息
        function getFollowUserInfo(){
            axios.get('/wx/getUsers').then((res)=>{
                // console.log(res.data);
                userInfoList=res.data;
                let img=document.querySelector('#pic');
                let cityDom=document.querySelector('#city');
                let countryDom=document.querySelector('#country');
                let nicknameDom=document.querySelector('#nickname');
                let provinceDom=document.querySelector('#province');
                var info=userInfoList[0];
                let {headimgurl,city,country,nickname,province}=info;
                img.src=headimgurl;
                cityDom.innerHTML=city;
                countryDom.innerHTML=country;
                nicknameDom.innerHTML=nickname;
                provinceDom.innerHTML=province;
                // console.log(userInfoList[0].headimgurl);

            })
        }

        getFollowUserInfo();
        //注册按钮事件

        let userInfoList=[];
        var choose=document.querySelector('#choose');
        var img=document.querySelector('#img');
        var openLocation=document.querySelector('#openLocation');
        var scan=document.querySelector('#scan');
        choose.onclick=function(){
            chooseImage()
        };
        openLocation.onclick=function () {
            getLoaction(function(latitude,longitude){
                openLocationFn(latitude,longitude);
            })
        }
        scan.onclick=function(){
            scanFn();
        }
    })
})




