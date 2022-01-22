<template>
    <table>
        <tr class="pannel">
            <span class="pannel-1" v-if="selecting">
                <td class="pannel-1-phase-2" v-if="selecting_1_phase==1">
                    <input type="text" class="pannel-1-phase-2-input" placeholder="from (r.aimedtuba.com/your text) (input r for random) (enter to confirm)" @keyup.enter="_input(1)">
                </td>
                <td class="pannel-1-phase-3" v-else-if="selecting_1_phase==2">
                    <input type="text" class="pannel-1-phase-3-input" placeholder="to (your url) (enter to confirm)" @keyup.enter="_input(2)" @paste="_input(2)">
                </td>
                <td class="pannel-1-phase-4" v-else-if="selecting_1_phase==3">
                    <input type="radio" id="pannel-1-phase-4-option-1" name="pannel-1-phase-4-option" value="0" @change="selection_limit_()" checked>
                    <label for="pannel-1-phase-4-option-1">-</label>
                    <input type="radio" id="pannel-1-phase-4-option-2" name="pannel-1-phase-4-option" value="1" @change="selection_limit_()">
                    <label for="pannel-1-phase-4-option-2">Limit</label>
                    <input type="number" class="pannel-1-phase-4-option-2-input" @keyup="check()" :disabled="!selection_limit" v-model="selection_limit_value">
                    <input type="radio" id="pannel-1-phase-4-option-3" name="pannel-1-phase-4-option" value="2" @change="selection_limit_()">
                    <label for="pannel-1-phase-4-option-3">Count</label>

                    <input type="checkbox" id="pannel-1-phase-part-2-option-4" checked>
                    <label for="pannel-1-phase-part-2-option-4">Consent</label>

                    <input type="button" value="+" class="pannel-1-phase-part-2-submit" @click="submit()">
                </td>
            </span>
            <td class="pannel-2" @click="_selecting()" v-else>+</td>
        </tr>
        <tr v-for="redirect in redirects" :key="redirect">
            <comment :is="getCookie('code')+'redirect'" :redirect="redirect"></comment>
        </tr>
    </table>
</template>

<script>
    export default {
        data(){
            return{
                redirects:[],
                selecting:false,
                selecting_1_phase:1,
                selection_from:"",
                selection_to:"",
                selection_limit:false,
                selection_limit_value:1,
                getCookie: getCookie,
            }
        },
        mounted(){
            fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect/?code=${getCookie("code")}&login=${getCookie("account")}`).then(res=>res.json()).then(res=>{
                this.redirects = res
            })
        },
        methods: {
            _input(i){setTimeout(()=>{
                if(i==1){
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect/check?code=${getCookie("code")}&login=${getCookie("account")}&from=${document.querySelector('.pannel-1-phase-2-input').value}`).then(res=>{if(res.status!=409){
                        if(document.querySelector('.pannel-1-phase-2-input').value!=""){
                            this.from=document.querySelector('.pannel-1-phase-2-input').value;
                            setTimeout(()=>{document.querySelector('.pannel-1-phase-3-input').value="";document.querySelector('.pannel-1-phase-3-input').focus()})
                            this.selecting_1_phase=i+1;
                        }else{document.querySelector('.pannel-1-phase-2-input').classList.add("red-input")}
                    }else{document.querySelector('.pannel-1-phase-2-input').classList.add("red-input")}})
                }else if(i==2){
                    if(document.querySelector('.pannel-1-phase-3-input').value!=""){
                        this.to=document.querySelector('.pannel-1-phase-3-input').value;
                        setTimeout(()=>{
                            document.querySelector('.pannel-1-phase-4-option-2-input').blur()
                            document.querySelector('.pannel-1-phase-4-option-2-input').value=""
                        })
                        this.selecting_1_phase=i+1
                    }else{document.querySelector('.pannel-1-phase-2-input').classList.add("red-input")}
                }
            })},
            _selecting(){
                this.selecting=true;
                setTimeout(()=>{document.querySelector('.pannel-1-phase-2-input').focus()})
            },
            _phase1(){
                this.selecting_1_phase=1
                setTimeout(()=>{document.querySelector('.pannel-1-phase-2-input').focus()})
            },
            check(){
                if(document.querySelector('.pannel-1-phase-4-option-2-input').value>99){
                    document.querySelector('.pannel-1-phase-4-option-2-input').value=99
                }else if(document.querySelector('.pannel-1-phase-4-option-2-input').value<1){
                    document.querySelector('.pannel-1-phase-4-option-2-input').value=1
                }else if(isNaN(parseInt(document.querySelector('.pannel-1-phase-4-option-2-input').value))){
                    document.querySelector('.pannel-1-phase-4-option-2-input').value=1
                }
            },
            selection_limit_(){
                this.selection_limit=document.querySelector('#pannel-1-phase-4-option-2').checked
                if(this.selection_limit==false){
                    this.selection_limit_value=1
                }
                setTimeout(()=>{document.querySelector('.pannel-1-phase-4-option-2-input').focus()})
            },
            submit(){
                let options={}
                if(document.querySelector('input[name="pannel-1-phase-4-option"]:checked').value==1){
                    options.left=parseInt(document.querySelector('.pannel-1-phase-4-option-2-input').value)
                }else if(document.querySelector('input[name="pannel-1-phase-4-option"]:checked').value==2){
                    options.count=0
                }
                if(document.querySelector('#pannel-1-phase-part-2-option-4').checked==true){
                    options.consent=true
                }
                console.log({code:getCookie("code"),
                        login:getCookie("account"),
                        from:this.selection_from,
                        to:this.selection_to,
                        options:options})
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect`,{
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        code:getCookie("code"),
                        login:getCookie("account"),
                        from:this.from,
                        to:this.to,
                        options:options
                    })
                }).then(res=>{
                    this.redirects.push(res.redirect)
                    this.selecting=false
                    this.selection_from=""
                    this.selection_to=""
                    this.selection_limit=false
                    this.selection_limit_value=1
                    this.selecting_1_phase=1
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/redirect/?code=${getCookie("code")}&login=${getCookie("account")}`).then(res=>res.json()).then(res=>{
                        this.redirects = res
                    })
                })
            }
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style scoped>

    .pannel-2,.pannel-1-phase-1{
        background-color:transparent;
        cursor:pointer;
        font-family: 'Roboto', sans-serif;
        text-align: center;
    }
    .pannel td,.pannel-1 td{
        border-top:none !important;
        width:100vw;
    }
    button{
        cursor:pointer;
        outline:none;
        background-color:transparent;
        color:lightgray;
        border:none;
        font-family: 'Roboto', sans-serif;
    }

    .lgray-border-5{
        border:lightgray solid 2px;
        border-radius:5px;
    }
    .nav-item{
        width:100vw;
    }
    label, input{
        font-family: 'Roboto', sans-serif;
    }
    .pannel-1-phase-2-input, .pannel-1-phase-3-input, .pannel-1-phase-4-option-2-input, .pannel-1-phase-part-2-submit{
        color:lightgray;
        border:none;
        width:95vw;
        outline:none;
        background-color:transparent;
        font-family: 'Roboto', sans-serif;
        text-align:center;
    }
    .pannel-1-phase-4-option-2-input, .pannel-1-phase-part-2-submit{
        width:30px;
        border: 2px solid lightgray;
        border-radius: 5px;
    }
    .pannel-1-phase-part-2-submit{
        cursor: pointer;
    }
    .red-input::placeholder{color:red;}
    .red-input{
        color:red;
    }
</style>