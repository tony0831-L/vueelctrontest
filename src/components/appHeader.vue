<template>
	<header>
		<div class="pannel" v-show="showpannel">
			&nbsp;
            <img :src="user.userImg" v-show="user.userImg" id="thumb" alt="userinfo">
			<div id="people" v-show="!user.userImg"><i class="bi bi-person-circle"></i></div>
			<span style="margin-bottom:1.2em;text-align: center;">{{user.Name}}</span>
			<a><span class="pt" @click="change" :class="{isact:now=='首頁'}">首頁</span></a>
			<a><span class="pt" @click="change" :class="{isact:now=='YT下載'}">YT下載</span></a>
            <a><span class="pt" @click="change" :class="{isact:now=='我的歌單'}">我的歌單</span></a>
            <router-link to="/" ><span class="pt" @click="change" :class="{isact:now=='後臺管理'}">後臺管理</span> </router-link>
            <span :class="{showdetail:showtime==true}" @click="showtime=!showtime" class="time" >
                <div>
                    {{time.hours}}:{{time.minute}}
                    <span v-show="showtime">:{{time.second}}</span>
                </div>
                <p v-show="showtime">
                    {{time.day}}
                </p>
            </span>
			<a><span class="pt"></span></a>             
			<i id="back" class="bi bi-arrow-left-circle" @click="showpannel=false"></i>
		</div>
		<div id="menu" class="bi bi-list" v-show="!showpannel" @click="showpannel=!showpannel"></div>
		<h1 class="title" style="cursor: pointer;">老八下載器</h1>
		<div class="top"  @click="login">
			{{info}}
		</div>
	</header>
</template>

<script>
import bus from './bus.ts'
import dayjs from 'dayjs'
let ipcRenderer = require('electron').ipcRenderer;
export default {
	name: 'appHeader',
	data(){
		return{
			islogin:false,
			showpannel:true,
            now:"首頁",
			user:{
            },
            info:"登入",
            time:"",
            showtime:false
		}
	},
    methods:{
        change(id){
            this.showtime=false;
            this.now=id.target.innerText
            bus.emit('test', id.target.innerText);
        },
        login(){
            bus.emit('loginP', true);
        }
    },
    mounted(){
        bus.on('pOff',()=>{
            this.showpannel=false
        })
        bus.on('loginReply',res=>{
            if(res.data==='登入成功'){
                this.islogin=true
                this.user=res.userInfo
                this.info=this.user.userName
            }
        })
        setInterval(()=>{
            this.time={
                day:dayjs().format('YYYY/MM/DD'),
                rowhours:dayjs().format('HH'),
                minute:dayjs().format('mm'),
                second:dayjs().format('ss')
            }
            if (this.time.rowhours>12) {
                let n=this.time.rowhours
                n=n-12
                this.time.hours="下午"+n
            }else{
                this.time.hours="上午"+this.time.rowhours
            }
            localStorage.setItem('time',JSON.stringify(this.time))
        },1000)
        
        ipcRenderer.on('pOn', (arg)=>{
            console.log(arg)
            this.showpannel=!this.showpannel
        });
    }
}
</script>

<style>
header{
    display: flex;
    position: fixed;
    width: 100%;
    background-color: #000000;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1rem;
    padding: .5%;
}
    #menu{
        position:absolute;
        left: 1.5em;
        cursor: pointer; 
        font-size: 1.2em
    }
    .top{
        position: absolute;
        padding: .1% .3%;
        right: 3.5em;
        display: flex;
        border-radius: .2em;
        border: solid #ffffff;
        justify-content: center;
        cursor: pointer;
    }
.pannel{
    transition: all 0.25s;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    width: 10%;
	top:0px;
    left: 0px;
    align-items: center;
    font-size: 1em;
    border-right:solid 1px gray ;
    padding: 1% 1%;
    background-color: #e5e5e5e8;
}
    .pannel span{
        color: #333;
    }
    .pannel a{
        text-align: center;
        margin-bottom: .5em;
        cursor: pointer;
    }
    .pt:hover{
        background-color: #423f3f38;
        border-radius: .2em;
    }
    #thumb{
        width: 90px;
        height: 90px;
        border-radius: 99%;
        border: solid 4px #333;
        margin-bottom: .2em;
    }
    #people{
        font-size: 5rem;
        margin-top: 5%;
    }
    #back{
        position: absolute;
        top: .1%;
        right: 5%;
        font-size: 1.5rem;
        cursor: pointer;
    }
    .isact{
        background-color: #423f3f38;
        border-radius: .2em;
    }
    .time{
        transition: all 0.25s;
        cursor: pointer;
        position: absolute;
        top: 100%;
        transform: translateY(-400%);
    }
    .showdetail{
        display: flex;
        background-color: #423f3f1e;
        border-radius: .2em;
        flex-direction: column;
        align-items: center;
        padding: 3%;
        top: 115%;
    }
</style>
