<template>
  <appHeader/>
  <login/>
  <home @click="Poff" v-show="now==='首頁'"/>
  <back @click="Poff" v-show="now==='後臺管理'"/>
  <ytdl @click="Poff" v-show="now==='YT下載'" v-if="now!='我的歌單'"/>
  <mylist @click="Poff" v-show="now==='我的歌單'" v-if="now!='YT下載'"/>



</template>

<script>
// 導入組件
import home from './components/home.vue'
import login from './components/login.vue'//登入組件
import appHeader from './components/appHeader.vue'//導航區組件
import back from './components/back.vue'//設定區組件



import mylist from './components/mylist.vue'//清單組件




import ytdl from './components/ytdl.vue'//YT下載區組件
// 導入組件

// 導入全局事件總線
import bus from './components/bus.ts'
// 導入全局事件總線

// 導入axios作登入驗證
import axios from 'axios'
// 導入axios作登入驗證

//獲取根目錄
const homedir = require('os').homedir();
//獲取根目錄

export default {
  name: 'App',
  data(){
    return{
      now:"首頁",
      lastUse:"我的歌單"
    }
  },
  //註冊組件
  components: {
    appHeader,
    home,
    back,
    ytdl,
    login,
    mylist
  },


  setup(){
    //初始設定
    let defaultSetting = {
      volume:0.4,
      file:`${homedir}`,
      dlmode:"純音樂(預設)"
    }
    let defaultlogin = {
      email:"",
      passWord:""
    }
    //初始化清單
    if(!localStorage.getItem('setting')){
      localStorage.setItem('setting',JSON.stringify(defaultSetting))
    }
    if(!localStorage.getItem('loggin')){
      localStorage.setItem('loggin',JSON.stringify(defaultlogin))
    }

    //關閉應用程式銷毀登入清單
    localStorage.setItem('mylist',null)
  },

  methods:{
    Poff(){
      bus.emit('pOff')
    }
  },
  
  mounted(){
    //監聽現在區域
    bus.on('test',input=>{
      this.now=input
    })
    //監聽登入事件並驗證
    bus.on('login',input=>{
      console.log('login')
      axios.post(input.url,{
        email:input.email,
        passWord:input.password,
        name:input.name,
        img:input.img,
      }).then(res=>{
        bus.emit('loginReply',res.data)//廣播登入設定
      })
    })
  },
}
</script>

<style>
*{
  margin: 0px;
  padding: 0px;
  text-decoration: none;
}
  html,body{
    width: 100%;
    height: 100%;
    font-size: 18px;
    background: #202124;
    font-family: Source Han Sans TW;
  }
  body::-webkit-scrollbar {
    display: none;
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
