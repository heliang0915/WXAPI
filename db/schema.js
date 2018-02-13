var mongoose = require('mongoose');
var mongodb = require('../db/db');
var Schema = mongoose.Schema;
//获取数据库连接对象
var db = mongodb.connect();
/*定义会员等级模型*/
var imgsModel = new Schema({
    uuid: String,
    name: String,//图片名称
    md5:String,//图片地址MD5
});

// console.log("db>>>>>"+db);
exports.imgsModel = mongoose.model('imgsModel', imgsModel); //  与imgs集合关联