var express = require('express');
var router = express.Router();
var imgDao = require('../db/imgLib');
var config = require('../config');
var fdfs=require("../util/FdfsHelper")
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/wx-index',function (req, res) {
    res.render('wx', { title: 'Wx' });
})


router.get("/downloadPic",function(req, res){
    // var fileName=req.query.fileName;
    //
    // fdfs.downloadFile(fileName)
    //
    // ftp.getFile(fileName,function(err,stream){
    //     if(err==null){
    //         stream.pipe(res)
    //     }else{
    //         //返回一张默认图片
    //         ftp.getFile("error.jpg",function(err,st){
    //             st.pipe(res)
    //         });
    //     }
    // })
})

// router.get('/delete',function(req, res){
//     var fileName=req.query.fileName;
//     console.log(fileName);
//     ftp.removeFile(fileName,function(err){
//         res.send(err!=null?err:"删除成功...")
//     });
// })
router.get('/list',function(req, res){
    imgDao.findAll(function (err,models){
        // models.forEach((model)=>{
        //     console.log();
        // })
        let list=[];

        models.forEach((item)=>{
            // let json=[];
            item._doc['url']="http://"+config.zimg.host+":"+config.zimg.port+item['md5'];
            // Object.keys(item._doc).forEach((key)=>{
            //     json[key]=item._doc[key];
            //     console.log("key>>>>"+key);
            //     if(key=="md5"){
            //         json['url']="http://"+config.zimg.host+":"+config.port+"/"+item[key];
            //     }
            // })
            console.log(item);
            list.push(item);

        })
        res.send(err!=null?err:models)
    })
    // ftp.list(function(err,list){
    //     res.send(err!=null?err:list)
    // });
})





module.exports = router;
