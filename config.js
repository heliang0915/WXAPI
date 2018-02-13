/**
 * config 配置
 * User: heliang
 * Date: 2017/12/18.
 */
var config={
    wx:{
        appid:"wxabdcf8cd45cb81fd",
        secret:"04511e132475bb67d26b46b38870fac3",
        grant_type:"client_credential",
        token:"heliang0915"
    },
    ftp:{
        host:"10.10.11.67",
        user:"hotread",
        password:"1",
        uploadDir:"upload"
    },
    zimg:{
        host:"p.3w.net579.com",
        port:"80",
        uploadPath:"/upload",
        zImgUpload:"http://192.168.124.4/upload",
        zImgDelete:"http://192.168.124.4/admin"
    }
}
module.exports=config;