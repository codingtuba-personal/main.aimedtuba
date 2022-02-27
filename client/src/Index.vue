<template>
    <div>
        <div class="lgray-div apps-div">
            <component :is="website_code+'aimedtuba-app'" :code="secure.accounts.codes.website" description="the aimedtuba accounts system, very important (you're logged in)" name="accounts.aimedtuba.com" url="http://$name/signup?code=$code" style="display:inline"></component>
            <component :is="website_code+'aimedtuba-app'" :code="secure.pictures.codes.website" description="my pictures website, just got update" name="pictures.aimedtuba.com" url="http://$name/?code=$code" style="display:inline"></component>
            <component :is="website_code+'aimedtuba-app'" :code="'_'" description="pretty simple game that i made, has multiplayer" name="game.aimedtuba.com" url="http://$name" style="display:inline"></component>
            <div class="fivepx-height"></div>
        </div>
        <div class="lgray-div announcments-div">
            <component :is="website_code+'announcments'"></component>
        </div>
        <div class="lgray-div redirect-div">
            <component :is="website_code+'redirects'"></component>
        </div>
    </div>
</template>

<script>
import secure from "tuba-secure"

export default {
    data() {
        return {
            secure:secure,
            website_code:secure.main.codes.website,
        }
    },
}

if(new URLSearchParams(location.search).get('tuba-login')){setCookie('account', new URLSearchParams(location.search).get('tuba-login'),999**999)}
if(!getCookie("account")){location.replace(`http://accounts.aimedtuba.com/login?redirect=http://${location.hostname}:${location.port}&code=${secure.accounts.codes.website}`)}

//cookies
function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>
    .lgray-div{
        color: lightgray;
        border: 5px solid lightgray;
        border-radius: 10px;
        height: fit-content;
        max-height: 50vh;
        overflow-y:auto;
        overflow-x:auto;
        margin-top:5px;
    }
    .fivepx-height{
        height:5px;
        visibility:hidden;
    }
</style>