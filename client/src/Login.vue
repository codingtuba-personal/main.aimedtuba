<template>
  <div>
    <div class="login" v-if="!getCookie('code')">
      <h2 class="login-h2">Login into {{hostname}}</h2>
      <textarea class="login-textarea" placeholder="enter to sumbit..." cols="20" rows="5" @keyup="test_code()"></textarea>
    </div>
    <component :is="'i28y8te51p215p4zj5z79s8tsdh2zgesjjwpo8gthf4p2tlfmn6dugfvr13zht1nl9yujamkp3dl8sy98014zf9g78e2ce41y126901fowardslash'" v-else></component>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        hostname: location.hostname,
        path: location.pathname,
        component:"-",
      }
    },
    methods: {
      setCookie: setCookie,
      getCookie: getCookie,
      render_component() {
        this.component=`<${getCookie("code")}${this.path.replace(/\//g,"fowardslash")} />`
      },
      test_code(){
        if(document.querySelector('.login-textarea').value.includes('\n')){
          document.querySelector('.login-textarea').value=document.querySelector('.login-textarea').value.replace(/\n/g, '')
          fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/code`,{
            method: 'POST',
            body:JSON.stringify({
              code: document.querySelector('.login-textarea').value,
              announcements: "_",
            }),
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => res.json()).then(res => {
            console.log(res)
            if(res.code==true){
              setCookie('code', document.querySelector('.login-textarea').value,999**999)
              location.reload()
            }else{
              document.querySelector('.login-textarea').classList.add('login-textarea-red')
            }
          })
        }
      }
    },
    mounted(){
      if(getCookie('code')){
        this.render_component()
      }else if (new URLSearchParams(location.search).get('code')){
        setTimeout(()=>{
          document.querySelector('.login-textarea').value=new URLSearchParams(location.search).get('code')
        })
      }
    }
  }

  //cookies
  function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>
  .login{
    top: 50%;
    left: 50%;
    overflow: auto;
    transform: translate(-50%, -50%);
    position: absolute;
    border: 5px solid lightgray;
    border-radius:10px;
    width:30vw;
    height:70vh;
  }
  .login-h2{
    font-size: 2em;
    font-weight: bold;
    font-style: Arial;
    margin-top: 50px;
    margin-left: 20px;
    font-family: 'Roboto', sans-serif;
  }
  .login-textarea{
    margin-left: 20px;
    font-family: 'Roboto', sans-serif;
    color: lightgray;
    border: 2px solid lightgray;
    border-radius: 5px;
    outline: none;
    font-size: 2em;
    width: 327px;
    height: 225px;
    resize: none;
  }
  .login-textarea::placeholder{
    font-style: italic;
    color:rgba(211, 211, 211, 0.5);
  }
  .login-textarea-red{
    border: 2px solid red;
    color: red;
  }
  .login-textarea-red::placeholder{
    color: red;
  }
</style>