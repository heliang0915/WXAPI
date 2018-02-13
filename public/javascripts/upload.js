/**
 *
 * User: heliang
 * Date: 2017/12/18.
 */
;(function(win){
    function init(){
        var uploadExcel=$("#uploadExcel");
        var fileSelect=$("#fileSelect");
        uploadExcel.on('click',function(){
            fileSelect.trigger('click');
        })
    }
    function uploadFile(){
        var uploadForm=$("#uploadForm");
        uploadForm[0].submit();

    }
    function gotoIndex(err){
        if(err){
           alert(err);
        }else{
            win.location.reload();
        }
        // document.querySelector("#pic").src=url;
    }
    init();
    win.uploadFile=uploadFile;
    win.gotoIndex=gotoIndex;
    var vm=new Vue({
        el:"#app",
        data:{
            list:[],
            message:"Vue"
        },
        methods:{
            getList:function () {
                axios.get('/list').then((response) => {
                    var data=response.data;
                    console.log(data);
                    this.list=data;
                });
            },
            isShow:function(item){
                return item.name.indexOf('.jpg')>-1||item.name.indexOf('.png')>-1;
            }
        },
        mounted(){
            this.getList();
        }
    })
})(window);


