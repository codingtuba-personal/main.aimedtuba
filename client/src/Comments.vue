<template>
    <table style="width:100%;">
        <tr v-for="comment in comments_" :key="comment" style="width:100%;word-break: break-all;">
            <component :is="getCookie('code')+'comment'" :comment="comment"></component>
        </tr>
    </table>
</template>

<script>
    export default {
        props:["announcment","comments"],
        data(){
            return {
                getCookie: getCookie,
                comments_: [],
            }
        },
        mounted(){
            let update=[]
            this.announcment.comments.forEach(i=>{
                console.log(this.comments.find(ii=>ii._id===i))
                update.push(this.comments.find(ii=>ii._id===i))
            })
            this.comments_=update
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style>

</style>