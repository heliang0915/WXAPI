/**
 *
 * User: heliang
 * Date: 2017/9/8.
 */
var express = require('express');
var router = express.Router();
const sha1 = require('sha1')
const request = require('request')
const wxconfig = require('../wxconfig')
const redis =require('../util/RedisUtil')();

//接受微信服务器返回的信息并在本地生成签名与微信服务器签名校验并返回状态
router.get('/wxJssdk', function(req, res){
    var wx = req.query
    var token = 'heliang0915'
    var timestamp = wx.timestamp
    var nonce = wx.nonce
    // 1）将token、timestamp、nonce三个参数进行字典序排序
    var list = [token, timestamp, nonce].sort()
    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    var str = list.join('')
    var result = sha1(str)
    // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (result === wx.signature) {
        res.send(wx.echostr) // 返回微信传来的echostr，表示校验成功，此处不能返回其它
    } else {
        res.send(false)
    }
})
//获取js sdk信息 包含accessToken
router.post('/wxJssdk/getJssdk', (req, res) => {
    function getJsApiTicket(access_token){

        let timestamp =2222; // 时间戳
        let nonce_str = 'wx'  // 密钥，字符串任意，可以随机生成
        let url =req.body.url;  // req.query.url  // 使用接口的url链接，不包含#后的内容
        redis.getFormRedis('signature',function(err,signature){
            if(signature){
                console.log("从缓存中取出signature:"+signature);
                res.send({
                    appId: wxconfig.appid,
                    timestamp: timestamp,
                    nonceStr: nonce_str,
                    signature: signature,
                })
            }else{
                request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
                    console.log(body);
                    let jsapi_ticket = JSON.parse(body).ticket
                    // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
                    let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
                    // 用sha1加密
                    let signature = sha1(str)
                    redis.setToRedis('signature',signature)
                    console.log(signature);
                    res.send({
                        appId: wxconfig.appid,
                        timestamp: timestamp,
                        nonceStr: nonce_str,
                        signature: signature,
                    })
                })
            }
        })
        // request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
        //     console.log(body);
        //     let jsapi_ticket = JSON.parse(body).ticket
        //
        //     console.log("url>>>"+url);
        //     // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
        //     let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
        //     // 用sha1加密
        //     let signature = sha1(str)
        //     console.log('signature>>>'+signature);
        //     console.log('url>>>'+url);
        //
        //     redis.setToRedis('signature',signature)
        //
        //     res.send({
        //         appId: wxconfig.appid,
        //         timestamp: timestamp,
        //         nonceStr: nonce_str,
        //         signature: signature,
        //     })
        // })



    }
    //将数据access_token 存入redis
    redis.getFormRedis("access_token",function(err,access_token){
        // console.log("access_token>>>"+access_token);
        if(access_token){
            getJsApiTicket(access_token);
            console.log("读取缓存access_token");
        }else{
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + wxconfig.grant_type + '&appid=' + wxconfig.appid + '&secret=' + wxconfig.secret, (err, response, body) => {
                var access_token=JSON.parse(body).access_token;
                console.log("access_token*************"+access_token)
                redis.setToRedis("access_token",access_token,function () {
                    getJsApiTicket(access_token);
                    console.log("请求接口获取");
                });

            });
        }
    })
})


// router.post('/wxJssdk/getJssdk', (req, res) => {
//     request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + wxconfig.grant_type + '&appid=' + wxconfig.appid + '&secret=' + wxconfig.secret, (err, response, body) => {
//         var access_token=JSON.parse(body).access_token;
//         console.log("access_token*************"+access_token)
//         request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
//             console.log(body);
//             let timestamp =2222; // 时间戳
//             let nonce_str = 'wx'  // 密钥，字符串任意，可以随机生成
//             let url =req.body.url;  // req.query.url  // 使用接口的url链接，不包含#后的内容
//
//             console.log("req.body"+JSON.stringify(req.body));
//             let jsapi_ticket = JSON.parse(body).ticket
//             console.log("url>>>"+url);
//             // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
//             let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
//             // 用sha1加密
//             let signature = sha1(str);
//
//             console.log('signature>>>'+signature);
//             console.log('url>>>'+url);
//             res.send({
//                 appId: wxconfig.appid,
//                 timestamp: timestamp,
//                 nonceStr: nonce_str,
//                 signature: signature,
//             })
//         })
//
//     });
// })




//获取用户列表
// router.get('/getUsers',(req,res)=>{
//     redis.getFormRedis('access_token',(err,access_token)=>{
//         var url=`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}`;
//         request(url,(err,rs,body)=>{
//             // res.send(JSON.parse(body).data.openid);
//             console.log(body);
//             let openIdList=JSON.parse(body).data.openid;
//             getUserInfo(access_token,openIdList,(err,userInfo)=>{
//                 res.send(userInfo);
//             })
//         })
//     })
//     function getUserInfo(access_token,openIdList,cb){
//         let counter=0;
//         let userInfo=[];
//         openIdList.forEach((openId)=>{
//             let userInfoURL=`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openId}&lang=zh_CN`;
//             request(userInfoURL,(err,rs,body)=>{
//                 let info=JSON.parse(body);
//                 userInfo.push(info);
//                 counter++;
//                 if(counter==openIdList.length){
//                     if(cb){
//                         cb(err,userInfo);
//                     }
//                 }
//             })
//         })
//     }
// })
module.exports = router;