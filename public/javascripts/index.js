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
var ws=null;
if(window.WebSocket) {
    ws=new WebSocket('ws://10.10.10.210:8181');
}
var vm=new Vue({
    el:"#app",
    data:{
        list:[],
        message:"Vue",
        val:"",
        percent:0
    },
    methods:{
      getList:function () {
          // axios.get('/list').then((response) => {
          //     var data=response.data;
          //     this.list=data;
          //       console.log(this.list);
          // });
      },
     change:function(e){
         var val=e.target.value;
         if(window.WebSocket) {
             ws.send(val);
         }
     },
      loadWebSocket:function(){
            var self=this;
            // alert(window.WebSocket);
           if(window.WebSocket){

               ws.onopen=function (e) {
                    // console.log("服务器打开..");
                   ws.send(self.val);
               }
               ws.onmessage=function (e) {
                   var data=e.data;
                   self.percent=data;
                   // console.log(data);

               }
               ws.onerror=function (e) {
                   console.log("出现错误.."+e);
               }
               ws.onclose=function (e) {

               }
           }
      }
    },
    mounted:function(){
        // alert(1);
      this.getList();
      this.loadWebSocket();
    }
})



