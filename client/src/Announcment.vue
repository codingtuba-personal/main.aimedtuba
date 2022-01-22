<template>
    <div style="width:100%">
        <td class="content" v-if="viewing_content"><a class="black"> {{announcment.title}} </a><a>{{announcment.content}}</a></td>
        <td class="edit-content" v-else><input type="text" :class="{'edit-content-input':true,'minus-em':announcment_key}" @keyup.enter="do_submit()"></td>
        <td v-if="announcment_key" class="controls-1">
            <button class="comment control" @click="_comments(announcment._id)">|</button>
            <button class="delete control" @click="delete_announcment(announcment._id)">-</button>
            <button class="edit control" @click="edit_announcment(announcment._id)">=</button>
            <button class="comment control" @click="comment(announcment._id)">+</button>
        </td>
        <td v-else-if="viewing_content" class="controls-2">
            <button class="comment control" @click="_comments(announcment._id)">|</button>
            <button class="comment control" @click="comment(announcment._id)">+</button>
        </td>
        <td v-else class="controls-1">
            <button class="back control" @click="reload()">{{right_arrow}}</button>
        </td>
        <div>
            <td class="comments" v-if="show_comments">
                <component :is="getCookie('code')+'comments'" :announcment="announcment" :comments="comments"></component>
            </td>
        </div>
    </div>
</template>

<script>
    export default {
        props:["announcment","comments"],
        data() {
            return {
                announcment_key:!!localStorage.getItem('announcments-code'),
                _id:"",
                viewing_content:true,
                right_arrow:"<",
                writing_type:-1,
                show_comments:false,
                getCookie: getCookie,
            }
        },
        methods:{
            delete_announcment(_id){
                fetch(`${location.port==8080?"http://":"https://"}://${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/annoucments`,{
                    method: 'DELETE',
                    mode:'cors',
                    body:JSON.stringify({
                        announcement_id: _id,
                        code:{
                            website: getCookie('code'),
                            announcements: localStorage.getItem('announcments-code'),
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(()=>location.reload())
            },
            edit_announcment(_id){
                this._id=_id
                this.viewing_content=false;
                this.announcment_key=false;
                this.writing_type=0;
                setTimeout(()=>{document.querySelector('.edit-content-input').focus();document.querySelector('.edit-content-input').placeholder="[new title](,)[new content]"})
            },
            comment(_id){
                this._id=_id
                this.viewing_content=false;
                this.announcment_key=false;
                this.writing_type=1;
                setTimeout(()=>{document.querySelector('.edit-content-input').focus();document.querySelector('.edit-content-input').placeholder="comment content"})
            },
            comment_submit(){
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/comment`,{
                    method: 'PUT',
                    mode:'cors',
                    body:JSON.stringify({
                        content: document.querySelector('.edit-content-input').value,
                        announcement_id: this._id,
                        code:{
                            website: getCookie('code'),
                            account: getCookie('account'),
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(()=>location.reload())
            },
            edit_submit(){
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'main-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/annoucments`,{
                    method: 'PUT',
                    mode:'cors',
                    body:JSON.stringify({
                        code:{
                            website: getCookie('code'),
                            announcements: localStorage.getItem('announcments-code'),
                        },
                        announcement:{
                            id: this.edit_submit_id,
                            title: document.querySelector('.edit-content-input').value.split(',')[0],
                            content: document.querySelector('.edit-content-input').value.split(',')[1],
                        },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(()=>location.reload())
            },
            reload(){
                location.reload()
            },
            do_submit(){
                if(this.writing_type==0){this.edit_submit()}
                else{this.comment_submit()}
            },
            _comments(){
                this.show_comments=!this.show_comments
            }
        }
    }

    //cookies
    function setCookie(cname,cvalue,exdays) {  var d = new Date();  d.setTime(d.getTime() + (exdays*24*60*60*1000));  var expires = 'expires=' + d.toGMTString();  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';}function getCookie(cname) {  var name = cname + '=';  var decodedCookie = decodeURIComponent(document.cookie);  var ca = decodedCookie.split(';');  for(var i = 0; i < ca.length; i++) {    var c = ca[i];    while (c.charAt(0) == ' ') {      c = c.substring(1);    }    if (c.indexOf(name) == 0) {      return c.substring(name.length, c.length);    }  }  return '';}
</script>

<style>
    .black {
        color: black;
    }
    a{
        font-family: 'Roboto', sans-serif;
    }
    .controls-1,.controls-2{
        align-items:center;
        text-align: center;
    }
    td{
        width:95vw;
        border-top: 2px solid lightgray;
    }
    .controls-1{
        width: 13em;
    }
    .controls-2{
        width: 5em;
    }
    .control{
        background-color: white;
        border: 2px solid lightgray;
        border-radius: 5px;
        color: lightgray;
        font-size: 1em;
        width:1.61em;
        cursor: pointer;
    }
    .content{
        word-break: break-all;
    }
    .edit-content-input{
        width:calc(100vw - 5em);
        border: 2px solid lightgray;
        border-radius: 5px;
        color: lightgray;
        text-align: center;
        height:2em;
        font-size: 1em;
        outline: none;
        margin-top:5px;
    }
    .edit-content-input::placeholder{
        font-style: italic;
        color: lightgray;
    }
    .comments{
        width:100vw;
        height:fit-content;
        max-height: 40vw;
        overflow-y: scroll;
        border-top:none;
        margin-top:5px;
    }
</style>