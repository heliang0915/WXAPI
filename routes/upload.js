/**
 *
 * User: heliang
 * Date: 2017/12/18.
 */

var express = require('express');
var router = express.Router();
const stream = require('stream');
const path = require('path');
const multiparty = require('multiparty');
const fs = require('fs');
const imgDao = require('../db/imgLib');
const zimgConf = require('../config').zimg;
var zimg=require("../util/ZImgCli"); //
let {host,port}=zimgConf;

// const ftp=require('../util/FtpHelper');
// const fdfs=require('../util/FdfsHelper');


router.get("/", function (req, res){
    res.render('upload', { title: '上传' });
})

//上传文件
router.post("/uploadFile", function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var uploadPath=path.join(__dirname,"/../public/upload/")
    var form = new multiparty.Form({uploadDir: uploadPath});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log("上传完成后处理...");
        if (err) {
            console.log('出现错误: ' + err);
        } else {
            // console.log('parse files: ' + JSON.stringify(files));
            var inputFile = files.upload[0];
            var uploadedPath = inputFile.path;
            var realName=inputFile.originalFilename;
            var dstPath = uploadPath + inputFile.originalFilename;
            // ftp.uploadFile(uploadedPath)
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('重命名出错: ' + err);
                } else {
                    // console.log("files.media.size>>"+inputFile.size);
                    // var zimg=new ZImgCli();
                    console.log("重命名完毕....");
                    zimg.upload(dstPath,inputFile,'userfile',(err,md5)=>{
                        console.log(md5);
                        fs.unlink(dstPath);
                        if(err){
                            res.send("<script>parent.gotoIndex('"+err+"')</script>")
                        }else{
                            //存入数据库
                            addImgModel(md5,realName,()=>{
                                zimg.delete(md5);
                                res.send("<script>parent.gotoIndex()</script>")
                            });

                        }
                    })
                }
            });
            // fdfs.uploadFile(uploadedPath,function (fileId) {
            //     fs.unlink(uploadedPath);
            //     res.send("<script>parent.gotoIndex('"+fileId+"')</script>")
            // })

            // ftp.uploadFile(uploadedPath,function(){
            //     fs.unlink(uploadedPath);
            //     res.send("<script>parent.gotoIndex()</script>")
            // })

            // //重命名为真实文件名
            // fs.rename(uploadedPath, dstPath, function (err) {
            //     if (err) {
            //         console.log('重命名出错: ' + err);
            //     } else {
            //         ftp.uploadFile(dstPath,function(){
            //             fs.unlink(dstPath);
            //             res.send("<script>parent.gotoIndex()</script>")
            //         })
            //         // excel.excel2Data(realName,function(){
            //         //     console.log("生成数据成功");
            //         //     console.log("dstPath>>>"+dstPath);
            //         //     fs.unlink(dstPath);
            //         // })
            //     }
            // });
        }

    });
});

//存入图片信息
function addImgModel(md5,name,callback){
    var modelData ={
        name,
        md5,
    };
    imgDao.add(modelData,()=>{
        callback!=null?callback():null;
    })
}

// router.get("/download/:md5",function (req,res) {
//     // group1/M00/00/00/wKh8DFp4IRaAaWRoAAWylkemyos119.jpg
//     // var ws = fs.createWriteStream(res);
//
//     // console.dir(fs);
//
//     let path=req.path;
//     let url=req.originalUrl;
//
//     // let md5=0;
//     let key="/download/";
//     let md5=path.substring(path.indexOf(key)+key.length,path.indexOf("?")==-1?path.length:path.indexOf("?"));
//     let query=url.substring(url.indexOf("?")==-1?url.length:url.indexOf("?"),url.length);
//     // if(path){
//     //
//     // }
//     // let md5=req.query;
//     // console.log("path>>>>"+path);
//     // console.log((path.indexOf("?")==-1?path.length:path.indexOf("?")),path.length);
//
//     zimg.downloadFile(md5,query,(err,html)=>{
//         // res.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
//         // res.write(html,'binary');
//         // console.log(html);
//         res.end(html);
//         // console.log(html);
//         // res.send(html);
//     })
//
//
//
//
//     // fdfs.downloadFile('group1/M00/00/00/wKh8DFp4IRaAaWRoAAWylkemyos119.jpg','1111.jpg',function (err,data) {
//     //      console.log(err);
//     //      console.log(data);
//     // });
//
// })

module.exports = router;
