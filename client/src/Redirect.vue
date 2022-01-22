<template>
    <div>
        <td style="controls">
            /<span>
                <a v-if="!editing" :href="'http://r.aimedtuba.com/'+redirect.from" target="_blank">{{redirect.from}}</a>
                <a v-if="!editing" @click="copy('http://r.aimedtuba.com/'+redirect.from)" style="cursor:pointer">📑</a>
                <textarea type="text" class="redirect-from-edit" v-else></textarea>
            </span> => <span>
                <a v-if="!editing">{{redirect.to}}</a>
                <textarea type="text" class="redirect-to-edit" v-else></textarea>
            </span> ({{redirect.options.count}}{{_limit()}})
        </td>
        <td class="controls">
            <button @click="edit()">=</button>
            <button @click="delete_()">-</button>
        </td>
    </div>
</template>

<script>
    export default {
        props:["redirect"],
        data(){
            return{
                editing:false,
            }
        },
        methods:{
            edit(){
                if(this.editing==true){
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect`,{
                        method:"PUT",
                        headers:{
                            "Content-Type":"application/json",
                        },
                        body:JSON.stringify({
                            from:document.querySelector(".redirect-from-edit").value,
                            to:document.querySelector(".redirect-to-edit").value,
                            code:getCookie("code"),
                            login:getCookie("account"),
                            id:this.redirect._id
                        }),
                    }).then(()=>{location.reload()})
                }else{
                    this.editing=!this.editing;
                }
            },
            delete_(){
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({
                        id:this.redirect._id,
                        code:getCookie("code"),
                        login:getCookie("account"),
                    }),
                }).then(()=>location.reload())
            },
            copy(text) {
                navigator.clipboard.writeText(text)
            },
            _limit(){
                return this.redirect.options.left?`${this.redirect.options.left} left`:""
            }
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>
    .controls{
        width:6em;
        align-items:center;
        text-align: center;
    }
    button{
        background-color: white;
        border: 2px solid lightgray;
        border-radius: 5px;
        color: lightgray;
        font-size: 1em;
        width:1.61em;
        cursor: pointer;
        margin: 0 auto;
        margin-top:5px
    }
    textarea{
        border: 2px solid lightgray;
        border-radius: 5px;
        width:40vw;
    }
    a:visited{color:gray;}
    a:link{color:lightgray;}
</style>