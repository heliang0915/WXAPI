/**
 * Wx帮助类
 * User: heliang
 * Date: 2017/12/28.
 */

const request=require("request");
const sha1=require("sha1");
const config=require("../config");
const redis = require('../util/RedisUtil')();

/**
 * getAccessToken wx获取Access_Token
 * Date: 2017/12/28.
 */
function getAccessToken(callback){
    //将数据access_token 存入redis
    redis.getFormRedis("access_token",function(err,access_token){
        if(access_token){
            console.log("读取缓存access_token");
            callback(err,access_token);
        }else{
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + config.wx.grant_type + '&appid=' + config.wx.appid + '&secret=' + config.wx.secret, (err, response, body) => {
                var access_token=JSON.parse(body).access_token;
                console.log("access_token*************"+access_token)
                redis.setToRedis("access_token",access_token,function () {
                    console.log("请求接口获取");
                    callback(err,access_token);
                });
            });
        }
    })
}

/**
 * getJsApiTicket 认证JSAPI
 * Date: 2017/12/28.
 */
function getJsApiTicket(callback,url){
    let timestamp = "wx"; // 时间戳
    let nonce_str = 'wx'  // 密钥，字符串任意，可以随机生成
    let wxConfig={};

    getAccessToken(function (er,access_token) {
        redis.getFormRedis('signature', function (err, signature) {
            if (signature) {
                console.log("从缓存中取出signature:" + signature);
                wxConfig={
                    appId: config.wx.appid,
                    timestamp: timestamp,
                    nonceStr: nonce_str,
                    signature: signature,
                };
                callback(err,wxConfig);
            } else {
                request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
                    console.log("body>>>>"+body);
                    let jsapi_ticket = JSON.parse(body).ticket
                    // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
                    let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
                    console.log(str);
                    // 用sha1加密
                    let signature = sha1(str)
                    redis.setToRedis('signature', signature)
                    // console.log("signature>>>"+signature);
                    wxConfig={
                        appId: config.wx.appid,
                        timestamp: timestamp,
                        nonceStr: nonce_str,
                        signature: signature,
                    }

                    callback(err,wxConfig);
                })
            }
        })
    })

}

//调取模板发送消息
function sendWxTemplateMsg(callback,options) {
    getAccessToken((err,access_token)=>{
        var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
        console.log(`url>>>`+url);
        options=options==null?{}:options;

        let defaultOpt={
            touser:"oVeCPwJkREHzv5sQE__jrqoYoVgk",
            template_id:"diCo40MBrsv8Q-3SE8-h81G13o_CnEpHSChkRgEMQA0",
            data:{}
        }

        let finalOpt=Object.assign({},defaultOpt,options);
        console.log(JSON.stringify(finalOpt));
        let option = {
            url: url,
            method: "POST",
            json: true,
            body:finalOpt
        };
        request(option, (err, rs, body) => {
            callback(err,body)
        })
    })
}

module.exports={getAccessToken,getJsApiTicket,sendWxTemplateMsg};