/**
 * WebSocket 服务器
 * User: heliang
 * Date: 2017/12/22.
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });
const request = require('request');
wss.on('connection', function (ws) {
    console.log('WebSocket服务器启动成功，等待连接...');
    ws.on('message', function (message) {
        if(message){
            var counter=0;
            console.log("连接成功");
            console.log("接受来自客户端的数据..."+message);
            var timer=setInterval(function(){
                // request("http://10.10.10.210:3000/data.json",function(err,resp,body){
                //     console.log(body);
                //     console.log("message>>>"+message);
                //     ws.send(body)
                // })

                counter>=100?counter=100:counter++;
                console.log(counter);
                if(counter==100){
                    clearInterval(timer)
                }
                ws.send(counter)
            },100)
        }
    });
    ws.once('error',function (err) {
        console.log("err>>>"+err);
    })

});

