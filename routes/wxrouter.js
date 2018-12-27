/**
 * 微信
 * User: heliang
 * Date: 2017/9/8.
 */
var express = require('express');
var router = express.Router();
const sha1 = require('sha1')
const request = require('request')
const config = require('../config')
const wxHelper = require('../util/WxHelper')
const checkJJZ = require('../JJZ/sendJJZ')
const redis = require('../util/RedisUtil')();

//接受微信服务器返回的信息并在本地生成签名与微信服务器签名校验并返回状态
router.all('/wxJssdk', function (req, res) {
    var wx = req.query
    var token = config.wx.token;
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
    let url = req.body.url;  // req.query.url  // 使用接口的url链接，不包含#后的内容
    wxHelper.getJsApiTicket((err,wxConfig)=>{
        console.log("wxConfig::::"+JSON.stringify(wxConfig));
        res.send(wxConfig)
    },url);
})


//获取登录code
router.get('/getUserCode',function(req, res){
        var {code,page}=req.query;
        console.log("code::::::::"+code);
        var url=`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wx.appid}&secret=${config.wx.secret}&code=${code}&grant_type=authorization_code`;
        console.log(url);
        request(url, (err, rs, body) => {
            body=JSON.parse(body);
            var access_token=body.access_token;
            var openid=body.openid;
            console.log(`登录用access_token:${access_token}`);
            console.log(`登录用openid:${openid}`);
            var userInfoUrl=`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
            request(userInfoUrl, (err, rs, info) => {
                info=JSON.parse(info);
                console.log(">>>"+JSON.stringify(info));
                res.render(page,{info:info});

            })
    })
})

//发送模板消息
router.get('/sendTemplateMsg',(req, res) => {

    redis.getFormRedis('access_token', (err, access_token) => {

        var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
        console.log(`url>>>`+url);

        let option = {
            url: url,
            method: "POST",
            json: true,
            body: {
                touser:"oVeCPwJkREHzv5sQE__jrqoYoVgk",
                template_id:"diCo40MBrsv8Q-3SE8-h81G13o_CnEpHSChkRgEMQA0",
                data:{
                    first: {
                        "value":"这是事件",
                        "color":"#173177"
                    }
                    // ,
                    // keynote1:{
                    //     "value":"巧克力",
                    //     "color":"#173177"
                    // },
                    // keynote2: {
                    //     "value":"39.8元",
                    //     "color":"#173177"
                    // },
                    // keynote3: {
                    //     "value":"2014年9月22日",
                    //     "color":"#173177"
                    // },
                    // remark:{
                    //     "value":"欢迎再次购买！",
                    //     "color":"#173177"
                    // }
                }
            }
        };
        request(option, (err, rs, body) => {
            console.log(body);
            res.send("已发送到微信提醒");
        })

        // checkJJZ(function (err,state) {
        //     if(state=="已开放申请"){
        //         let option = {
        //             url: url,
        //             method: "POST",
        //             json: true,
        //             body: {
        //                 touser:"oVeCPwJkREHzv5sQE__jrqoYoVgk",
        //                 template_id:"u1_mFLabS6xmnMUfj5M9el0Tx1hwmzAhz17IAxc7NEw",
        //                 data:{
        //                     first: {
        //                         "value":state,
        //                         "color":"#173177"
        //                     }
        //                     // ,
        //                     // keynote1:{
        //                     //     "value":"巧克力",
        //                     //     "color":"#173177"
        //                     // },
        //                     // keynote2: {
        //                     //     "value":"39.8元",
        //                     //     "color":"#173177"
        //                     // },
        //                     // keynote3: {
        //                     //     "value":"2014年9月22日",
        //                     //     "color":"#173177"
        //                     // },
        //                     // remark:{
        //                     //     "value":"欢迎再次购买！",
        //                     //     "color":"#173177"
        //                     // }
        //                 }
        //             }
        //         };
        //         request(option, (err, rs, body) => {
        //             console.log(body);
        //             res.send("已发送到微信提醒");
        //         })
        //     }else{
        //         res.send("不需要提醒");
        //     }
        // });


    });


})

//获取用户列表
router.get('/getUsers', (req, res) => {
    redis.getFormRedis('access_token', (err, access_token) => {
        var url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}`;
        request(url, (err, rs, body) => {
            // res.send(JSON.parse(body).data.openid);
            // console.log("body>>>"+body);
            let openIdList = JSON.parse(body).data.openid;
            getUserInfo(access_token, openIdList, (err, userInfo) => {
                res.send(userInfo);
            })
        })
    })
    function getUserInfo(access_token, openIdList, cb) {
        let counter = 0;
        let userInfo = [];
        openIdList.forEach((openId) => {
            let userInfoURL = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openId}&lang=zh_CN`;
            request(userInfoURL, (err, rs, body) => {
                let info = JSON.parse(body);
                userInfo.push(info);
                counter++;
                if (counter == openIdList.length) {
                    if (cb) {
                        cb(err, userInfo);
                    }
                }
            })
        })
    }
})
module.exports = router;