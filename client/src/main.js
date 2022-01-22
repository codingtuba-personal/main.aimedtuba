import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from './Router.vue'
import Index from './Index.vue'
import Login from './Login.vue'
import AimedtubaApp from './AimedtubaApp.vue'
import Announcments from './Announcments.vue'
import Announcment from './Announcment.vue'
import Comments from './Comments.vue'
import Comment from './Comment.vue'
import Redirects from './Redirects.vue'
import Redirect from './Redirect.vue'
import secure from 'tuba-secure'

const make=(Code,Config)=>{
  Config.forEach(i=>{
    if(i.path){ // check if it is for a path
      if(!i.path.includes('fowardslash')){
        Vue.component(`${Code}${i.path.replace(/\//g,"fowardslash")}`,i.component);
      }else{
        console.error("fowardslash is a reserved string in path names, please change it to something else");
      }
    }else if (i.name){ // otherwise, create it as a name
        Vue.component(`${Code}${i.name}`,i.component);
    }
  })
}

make(secure.main.codes.website,[
  {path:'/',component:Index},
  {name:'aimedtuba-app',component:AimedtubaApp},
  {name:'announcments',component:Announcments},
  {name:'announcment',component:Announcment},
  {name:'comments',component:Comments},
  {name:'comment',component:Comment},
  {name:'redirects',component:Redirects},
  {name:'redirect',component:Redirect},
])

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Login },
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(Router)
})