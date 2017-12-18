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

    function gotoIndex(){
        win.location.reload();
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
                    this.list=data;
                    console.log(this.list);
                });
            }
        },
        mounted(){
            this.getList();
        }
    })




})(window);


