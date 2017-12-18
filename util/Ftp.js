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
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.get('/upload/'+fileName,function(err,stream) {
                if (err == null) {
                    stream.once('close', function () {
                        client.end();
                    })
                }
                callback(err,stream)
            })
        });
    },
    //删除文件
    removeFile:function(fileName,callback){
        var client=new Client();
        client.connect(ftpConfig);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.delete('/upload/'+fileName,function (err) {
                callback(err)
                client.end();
            })
        })
    },
    //查看文件list
    list:function (callback) {
        var client=new Client();
        client.connect(ftpConfig);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.list('/upload',function(err,list){
                callback(err,list);
            })
        })

    }
};
module.exports =FtpHelper;
