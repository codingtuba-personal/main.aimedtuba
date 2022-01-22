<template>
  <div>
    <table class="announcments-table">
        <tr class="controls" style="border:none">
            <span v-if="!controls_input">
                <td class="controls-login" v-if="announcments_login" @click="control_input('annoucments code',0)" onclick style="border:none">login</td>
                <td class="controls-post" v-else @click="control_input('[post title](,)[post content]',1)" onclick style="border:none">+</td>
            </span>
            <span v-else @click="control_focus_input('.controls-input')">
                <td class="controls-input-td" style="border:none">
                    <input type="text" class="controls-input" @keyup.enter="control_submit()">
                </td>
            </span>
        </tr>
        <tr v-for="announcment in announcments" :key="announcment">
            <component :is="getCookie('code')+'announcment'" :announcment="announcment" :comments="comments"></component>
        </tr>
    </table>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                announcments_login:!localStorage.getItem('announcments-code'),
                controls_input:false,
                controls_input_type:-1,
                announcments:[],
                comments:[],
                getCookie: getCookie,
            }
        },
        methods: {
            control_input(text, number) {
                this.controls_input=true;
                this.controls_input_type=number;
                setTimeout(()=>{document.querySelector('.controls-input').placeholder=text;document.querySelector('.controls-input').focus()})
            },
            control_focus_input(input){
                setTimeout(()=>{document.querySelector(input).focus()})
            },
            control_submit(){
                if(this.controls_input_type==0){
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/code`,{
                        method: 'POST',
                        mode:'cors',
                        body:JSON.stringify({
                            code: "_",
                            announcements: document.querySelector('.controls-input').value,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => res.json()).then(res => {
                        console.log(res)
                        if(res.announcements==true){
                            localStorage.setItem('announcments-code', document.querySelector('.controls-input').value)
                            document.querySelector('.controls-input').classList.remove('controls-input-red')
                            location.reload()
                        }else{
                            document.querySelector('.controls-input').classList.add('controls-input-red')
                        }
                    })
                }else{
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/announcements`,{
                        method: 'POST',
                        mode:'cors',
                        body:JSON.stringify({
                            code:{
                                website: getCookie("code"),
                                announcements: localStorage.getItem('announcments-code'),
                            },
                            announcement:{
                                title: document.querySelector('.controls-input').value.split(',')[0],
                                content: document.querySelector('.controls-input').value.split(',')[1],
                            }
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(()=>{location.reload()})
                }
            }
        },
        mounted(){
            fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/announcements?code=${getCookie("code")}`,{
                method: 'GET',
                mode:'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json()).then(res => {this.announcments=res.announcements.reverse();this.comments=res.comments.reverse()})
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>
    td{
        width:100vw;
        color: lightgray;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
        height: auto !important;
        overflow-x: hidden;
    }
    .controls-input{
        border: none;
        outline: none;
        width: 91vw;
        font-size: .85em;
        color: lightgray;
        text-align: center;
        margin: 0 auto;
    }
    .controls-input::placeholder{
        font-style: italic;
        color: rgba(211, 211, 211, 0.5);
    }
    .controls-input-td{cursor: text;}
    .controls-input-red{color: red;}
    .controls-input-red::placeholder{color:red;}
    .controls td{text-align: center;}
</style>