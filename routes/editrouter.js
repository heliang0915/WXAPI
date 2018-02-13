var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var router = express.Router();
var BaseURL = "/umeditor/";
var config = {
    //为编辑器实例添加一个路径，这个不能被注释
    UMEDITOR_HOME_URL: BaseURL,
    imageUrl: "/editor/uploadEditor",//图片上传提交地址
    imagePath: "/upload/images/", //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
    imageFieldName: "upfile",
};

//首页
router.get('/', function (req, res) {
    res.render('editor', {
        title: '编辑器测试',
        config: config
    })

})
//图片上传编辑器
router.post('/uploadEditor', function (req, res) {
    console.log("uploadEditor...");
    //生成multiparty对象，并配置上传目标路径
    var picPath = config['imagePath'] + "/";
    console.log("picPath>>>" + picPath);
    var uploadPath = path.join(__dirname, "/../public/" + picPath)
    var form = new multiparty.Form({uploadDir: uploadPath});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log("上传完成后处理...");
        if (err) {
            console.log('出现错误: ' + err);
        } else {
            console.log('parse files: ' + JSON.stringify(files));
            var inputFile = files[config.imageFieldName][0];
            var uploadedPath = inputFile.path;
            var realName = inputFile.originalFilename;
            var dstPath = uploadPath + inputFile.originalFilename;
            var fileType = realName.substring(realName.lastIndexOf('.'), realName.length).toLowerCase();
            var size = inputFile.size;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('重命名出错: ' + err);
                } else {
                    var json = {
                        "originalName": realName,
                        "name": realName,
                        "url": realName,
                        "type": fileType,
                        "size": size,
                        "state": "SUCCESS"
                    };

                    console.log(JSON.stringify(json));
                    res.send(JSON.stringify(json))
                }
            });
        }
    });
})
module.exports = router;