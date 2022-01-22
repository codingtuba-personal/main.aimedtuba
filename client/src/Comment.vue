<template>
    <div>
        <a>{{comment.content}} <a @click="delete_comment()" style="cursor:pointer;font-size:10px">🗑</a></a>
    </div>
</template>

<script>
    export default {
        props:["comment"],
        methods: {
            delete_comment(){
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/comment`,{
                    method: 'DELETE',
                    mode:'cors',
                    body:JSON.stringify({
                        comment_id: this.comment._id,
                        code:{
                            website: getCookie('code'),
                            comments: localStorage.getItem('comments-code'),
                            account: getCookie('account'),
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(()=>location.reload())
            }
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style>

</style>