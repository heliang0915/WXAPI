/**
 * 检测进京证状态
 * User: heliang
 * Date: 2017/12/27.
 */

var schedule = require("node-schedule");
var request=require("request");
var moment=require("moment");
var wxHelper=require("../util/WxHelper");


function checkJJZ(callabck) {
    request("http://www.52jinjing.com/",function(err,resp){
        var html=resp.body;
        var reg=/<tr>/g;
        var regTd=/<td>((\w|[\u4e00-\u9fa5]|\d)+)<\/td>/g;
        var trs=html.split(reg);
        var infoHTML=trs[2];
        // console.log(infoHTML);
        var ary=[];
        infoHTML.replace(regTd,function(a1,key){
            ary.push(key);
        });
        var currentState=ary[1];


        callabck(err,currentState)
    })
}


function fetch7Day(callabck){
    var options={
        url:"https://wx.yoyowoyo.com/wxapp/getSessionId.do",
        method:"POST",
        json:true,
        headers:{
          UserAgent:"User-Agent: Mozilla/5.0 (Linux; Android 5.1; m1 metal Build/LMY47I; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.5.23.1180 NetType/WIFI Language/zh_CN MicroMessenger/6.5.23.1180 NetType/WIFI Language/zh_CN"
        },
        body:{
                code:"071omACE09q4Yd2v0ZAE0eYKCE0omACx",
                iv:"LVhUC/kQblBGX+1eFHIPQQ==",
                signature:"ce101d3281733329b5516d9433561e756b0feff4",
                rawData:JSON.stringify({
                    nickName:"航宝BaBa",
                    gender:1,
                    language:"zh_CN",
                    city:"Haidian",
                    province:"Beijing",
                    country:"China",
                    avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJicoVXZVQMvic7y83oGBfbkiabWXia0B4Zibqs9DWYH2ue7KYRN8fia3PZsdc5SszaU1cBcvKonrmp4CPw/0"
                }),
                encryptedData:"tCjwMVaSv2DeOnPhw+RXcZiNsELC46GFy7Wa7Fvc72NwYCdjXdiqfBVAXyCa3CkzaykVU6+VBPCTaz5f9eUQrRt2S4e3FzcdrY5Tghdx802LJZG4WBrJUKGX124GE2Wei/0FANBUDo8pJVYjZZV8XivXV6kj1cWVjzz1GxTZTlc+q8SREvrUC+iBkQEaQ0Z//ew0ATWvjNJt6X8T4Euo4Mw/zVkeZd1pWzMQuWnQ1N1Kr6un2Fgi6uWR0yk66jTIY8TnprZPzyop6tTDhx8aLbV53fy80dlnb8ovkB2hY6dYw2czyL3hTkHpev5cctc5xdCmnqwVadv9o0YfWlAd0c8fiaCbjkgv85ApXwTPqycmVBNHFJWCdIGV2U72kb8RPthGMR/Cq0cK2lqehQ8XyIgF0rzWa5AHG6Jm2QYj40fQhjDmTHWF9dnEW9MLufzcSFmylCDJlx4fAY88VbdGZCRI3tQhQ8Isujb+B9aw5j8=",
                nickName:"航宝BaBa",
                gender:1,
                language:"zh_CN",
                city:"Haidian",
                province:"Beijing",
                country:"China",
                avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJicoVXZVQMvic7y83oGBfbkiabWXia0B4Zibqs9DWYH2ue7KYRN8fia3PZsdc5SszaU1cBcvKonrmp4CPw/0"
        }

    }
    request(options,(err,resp)=>{
        console.log(resp.body);
        var {sessionId}=resp.body;
        console.log(sessionId);
        request(`https://wx.yoyowoyo.com/enterbj/getAppStatus.do?sessionId=${sessionId}`,function(err,resp){
            console.log(">>>>>"+resp.body);
            let data=JSON.parse(resp.body);
            callabck(err,data.appstatus);
        })
    })
}

// fetch7Day(function(err,state){
//     console.log(state);
// });



//进京证查询任务
function doJJZJob(){
    // fetch7Day((err,state)=>{
    //     console.log(state);
        checkJJZ(function(err,state){
            console.log("当前进京证状态..."+state);
            if(state=="已开放申请"){
                wxHelper.sendWxTemplateMsg((err,body)=>{
                    console.log("已发送到微信提醒"+JSON.stringify(body));
                },{
                    data: {
                        first: {
                            "value": "【可用】",
                            "color": "green"
                        },
                        dateTime:{
                            "value": moment().format("YYYY-MM-DD HH:mm:ss"),
                            "color": "#173177"
                        }
                    }
                })
            }else{
                console.log("不需要提醒");
            }
        });
        // if (state == 1) {
        //     wxHelper.sendWxTemplateMsg((err,body)=>{
        //         console.log("已发送到微信提醒");
        //     },{
        //         data: {
        //             first: {
        //                 "value": "可用",
        //                 "color": "#173177"
        //             }
        //         }
        //     })
        // }else{
        //     console.log("不需要提醒");
        // }
    // })
}

function startUp(){
    schedule.scheduleJob("0/5 0 * * * *", function () {
        doJJZJob();
        console.log("定时任务 开始执行　%s", moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
    })
    console.log("任务启动【%s】....",moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
}

// startUp();

module.exports=checkJJZ;
// startUp();