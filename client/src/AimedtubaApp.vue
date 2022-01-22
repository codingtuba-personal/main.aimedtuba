<template>
    <div>
        <button class="button" @click="open_url()">
            <h2>{{name}}</h2>
            <h3>{{description}}</h3>
        </button>
    </div>
</template>

<script>
    export default {
        props:["url","name","code","description"],
        methods:{
            open_url(){
                window.open(this.url.replace("$name",this.name).replace("$code",this.code).replace("$login",this.url.includes("$code")?`&tuba-login=${getCookie("account")}`:`?tuba-login=${getCookie("account")}`))
            }
        },
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>
    button{
        color: lightgray;
        border: 5px solid lightgray;
        border-radius: 10px;
        max-height: 50vh;
        overflow-y:auto;
        overflow-x:auto;
        background-color:transparent;
        cursor: pointer;
        height: 40vh;
        width:20vw;
        margin-top:5px;
        margin-left:5px;
        text-align: start;
        overflow-wrap: break-word;
    }
    h2{
        color: black;
        margin: left;
    }
</style>