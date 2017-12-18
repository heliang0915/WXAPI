/*
* FTP操作工具
**/
var Client=require('ftp');
var path=require('path');
var config=require("../config")


var FtpHelper={
    //上传文件服务器
    uploadFile:function(fullPath,callback){
        var client=new Client();
        var fileName=fullPath.substr(fullPath.lastIndexOf('/'),fullPath.length);
        client.connect(config.ftp);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.put(path.join(fullPath),config.ftp.uploadDir+"/"+fileName,function(err){
                if(err) throw err;
                callback();
                console.log("FTP上传成功...");
                client.end();
            })
        })
    },
    //下载文件
    getFile:function(fileName,callback){
        var client=new Client();
        client.connect(config.ftp);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.get(config.ftp.uploadDir+'/'+fileName,function(err,stream) {
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
        client.connect(config.ftp);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.delete(config.ftp.uploadDir+'/'+fileName,function (err) {
                callback(err)
                client.end();
            })
        })
    },
    //查看文件list
    list:function (callback) {
        var client=new Client();
        client.connect(config.ftp);
        client.on('ready',function(err){
            console.log(err!=null?"出现错误"+err:"ftp连接成功...");
            client.list(config.ftp.uploadDir,function(err,list){
                console.log("读取FTP列表:"+list.length);
                callback(err,list);
            })
        })
    }
};
module.exports =FtpHelper;
