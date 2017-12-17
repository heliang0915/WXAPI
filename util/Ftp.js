var Client=require('ftp');
var path=require('path');
var ftpConfig={
    host:"192.168.0.110",
    user:"heliang0915@hotmail.com",
    password:"hl123456789"
}
var FtpHelper={
    //上传文件服务器
    uploadFile:function(fileName){
        var client=new Client();
        client.connect(ftpConfig);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.put(path.join(__dirname,"/"+fileName),"upload/"+fileName,function(err){
                console.log("err"+err);
                if(err) throw err;
                client.end();
            })
        })
    },
    //下载文件
    getFile:function(fileName,callback){
        var client=new Client();
        client.connect(ftpConfig);
        client.on('ready',function(err){
            client.get('/upload/'+fileName,function(err,stream) {
                if (err == null) {
                    stream.once('close', function () {
                        client.end();
                    })
                }
                console.log("err>>>"+err);
                callback(err,stream)
            })
        });
    }
};
module.exports =FtpHelper;
