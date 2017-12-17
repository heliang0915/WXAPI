var express = require('express');
var router = express.Router();
var ftp=require("../util/Ftp")
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/wx-index',function (req, res) {
    res.render('wx', { title: 'Wx' });
})

router.get("/downloadPic",function(req, res){
    ftp.getFile("21.jpg",function(err,stream){
        console.log("回调错误："+err);
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


module.exports = router;
