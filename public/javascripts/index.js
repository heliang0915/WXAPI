/**
 *
 * User: heliang
 * Date: 2017/9/21.
 */

// var btn=document.getElementById("btn");
// var iframe=document.getElementById("iframe");
// btn.onclick=function (){
//     iframe.src="/hotread-pc.apk";
// }
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
        // alert(1);
      this.getList();
    }
})



