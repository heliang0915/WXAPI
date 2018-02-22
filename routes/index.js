var express = require('express');
var router = express.Router();
var imgDao = require('../db/imgLib');
var config = require('../config');
var ZImgCli = require('../util/ZImgCli');
var fdfs=require("../util/FdfsHelper")
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/wx-index',function (req, res) {
    res.render('wx', { title: 'Wx' });
})


// router.get("/downloadPic",function(req, res){
//     // var fileName=req.query.fileName;
//     //
//     // fdfs.downloadFile(fileName)
//     //
//     // ftp.getFile(fileName,function(err,stream){
//     //     if(err==null){
//     //         stream.pipe(res)
//     //     }else{
//     //         //返回一张默认图片
//     //         ftp.getFile("error.jpg",function(err,st){
//     //             st.pipe(res)
//     //         });
//     //     }
//     // })
// })

router.get('/delete/:id/:md5',function(req, res){
    var uuid=req.params.id;
    var md5=req.params.md5;
    // console.log(md5);
    imgDao.del(uuid,(err)=>{
        if(err==null){
            //删除物理文件
            console.log("md5>>>"+md5);
            ZImgCli.delete(md5,(er)=>{
                console.log('err>>>'+er);
                if(er){
                    res.send(er);
                }else{
                    // res.redirect('/upload');
                    res.send('ok')
                }
            });
        }
    });
})


router.get('/list',function(req, res){
    imgDao.findAll(function (err,models){
        let list=[];
        models.forEach((item)=>{
            // let json=[];
            item._doc['url']="http://"+config.zimg.host+":"+config.zimg.port+item['md5'];
            list.push(item);
        })
        res.send(err!=null?err:models)
    })
})

module.exports = router;
