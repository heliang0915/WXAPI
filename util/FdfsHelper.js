/*
* FDFS工具类
* */
var debug = require('debug')('fdfs');
var FdfsClient = require('fdfs');
var fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            host: '192.168.124.8',
            port: 22122
        }
    ],
    // 默认超时时间10s
    timeout: 10000,
    // 默认后缀
    // 当获取不到文件后缀时使用
    defaultExt: 'txt',
    // charset默认utf8
    charset: 'utf8',
    logger: {
        log: debug
    }
});

var FdfsHelper={

    uploadFile:function(fileName,callback){
        fdfs.upload(fileName).then(function(fileId) {
            // fileId 为 group + '/' + filename
            console.log(fileId);
            callback==null?function(){}:callback(null,fileId);
        }).catch(function(err) {
            console.error(err)
            callback==null?function(){}:callback(err);
        })
    },
    downloadFile:function(fileId,options,callback){
        fdfs.download(fileId,options).then(function(data) {
            // 下载完成
            console.log("下载完成...");
            callback==null?null: callback(null,data);
        }).catch(function(err) {
            console.error(err);
            callback==null?null: callback(err,null);
        });
    }
}

module.exports=FdfsHelper;
