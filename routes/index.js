var express = require('express');
var router = express.Router();
var ftp=require("../util/FtpHelper")
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/wx-index',function (req, res) {
    res.render('wx', { title: 'Wx' });
})


router.get("/downloadPic",function(req, res){
    var fileName=req.query.fileName;

    ftp.getFile(fileName,function(err,stream){
        if(err==null){
            stream.pipe(res)
        }else{
            //返回一张默认图片
            ftp.getFile("error.jpg",function(err,st){
                st.pipe(res)
            });
        }
    })
})

router.get('/delete',function(req, res){
    var fileName=req.query.fileName;
    console.log(fileName);
    ftp.removeFile(fileName,function(err){
        res.send(err!=null?err:"删除成功...")
    });
})
router.get('/list',function(req, res){
    ftp.list(function(err,list){
        res.send(err!=null?err:list)
    });
})


module.exports = router;
