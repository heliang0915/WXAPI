/**
 *
 * User: heliang
 * Date: 2017/9/8.
 */

var redis=require("redis");
var client=redis.createClient('6379','127.0.0.1');
client.on('error',function (err) {
    console.log(err.message);
})

function setToRedis(attr,val,callback){
    client.set(attr,val,callback)
    // 设置过期时间 1小时
    client.expire(attr, 3600)
}
function getFormRedis(attr,callback) {
    console.log(client.get("access_token"));
    return client.get(attr,callback);
}
var RedisUtil={
    setToRedis:setToRedis,
    getFormRedis:getFormRedis
}

module.exports=function(){
    return RedisUtil;
};


