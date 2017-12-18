/**
 *
 * User: heliang
 * Date: 2017/12/18.
 */

var express = require('express');
var router = express.Router();
const path = require('path')
const multiparty = require('multiparty')
const fs = require('fs');
const ftp=require('../util/FtpHelper');

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
            console.log('parse files: ' + JSON.stringify(files));
            var inputFile = files.upload[0];
            var uploadedPath = inputFile.path;
            var realName=inputFile.originalFilename;
            var dstPath = uploadPath + inputFile.originalFilename;


            // ftp.uploadFile(uploadedPath)

            console.log("uploadedPath>>"+uploadedPath);
            console.log("dstPath>>"+dstPath);


            ftp.uploadFile(uploadedPath,function(){
                fs.unlink(uploadedPath);
                res.send("<script>parent.gotoIndex()</script>")
            })



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
module.exports = router;
