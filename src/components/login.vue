<template>
    <div class="loginPannel" v-show="pcontorl">

        <!-- 登入面板開關 -->
        <i class="bi bi-x-square" @click="control"></i>
        <!-- 登入面板開關 -->

        <span>登入或註冊</span>

        <!-- 輸入框群組 -->
        <div id="input_group">
            <!-- 註冊輸入框群組 -->
            &nbsp;
            <input type="text" name="" id="" placeholder="請輸入用戶名稱" v-model="singUpInfo.name" v-show="isreg">
            &nbsp;
            <input type="text" name="" id="" placeholder="用戶頭貼(輸入連結)" v-model="singUpInfo.img" v-show="isreg">
            &nbsp;
            <input type="text" name="" id="" placeholder="請輸入帳號" v-model="singUpInfo.email" v-show="isreg">
            &nbsp;
            <input type="passWord" name="" id="" placeholder="請輸入密碼" v-model="singUpInfo.password" v-show="isreg">
            <!-- 註冊輸入框群組 -->
            
            <!-- 登入輸入框群組 -->
            <input type="text" name="" id="" placeholder="請輸入帳號" v-model="loginInfo.email" v-show="!isreg">
            &nbsp;
            <input type="passWord" name="" id="" placeholder="請輸入密碼" v-model="loginInfo.password" v-show="!isreg">
            <!-- 登入輸入框群組 -->
        </div>
        <!-- 輸入框群組 -->
        <div v-show="!isreg">
            &nbsp;
        </div>
        <!-- 登入按鈕群組 -->
        <div id="btn_group" v-show="!isreg">
            <div id="login" @click="singIn">登入</div>
            &nbsp;
            <div id="login" @click="isreg=true">註冊</div>
        </div>
        <!-- 登入按鈕群組 -->

        <!-- 註冊按鈕群組 -->
        <div id="btn_group" v-show="isreg">
            <div id="login" @click="isreg=false">返回登入</div>
            &nbsp;
            <div id="login" @click="singUp">確認註冊</div>
        </div>
        <!-- 註冊按鈕群組 -->

        <div id="remember" v-show="!isreg">
            <input type="checkbox" name="" id="" v-model="remember">
            記住我
        </div>
    </div>
</template>

<script>
// 導入全局事件總線
import bus from './bus.ts'
// 導入全局事件總線

export default {
	name: 'login',// 設定組件名稱
	data(){
		return{
            loginInfo:{
                url:"",
                email:"",
                password:"",
            },
            singUpInfo:{
                name:"",
                img:"",
                url:"",
                email:"",
                password:"",

            },
            pcontorl:true,
            reply:"",
            setting:{},
            remember:true,
            isreg:false,
		}
	},
    methods:{
        //面板關閉回調函數
        control(){
            console.log(this.pcontorl)
            this.pcontorl=false
        },

        //登入回調函數
        singIn(){
            console.log('singIn被調用了')
            this.loginInfo.url='https://peter-liao.herokuapp.com/sing/singIn'//api設為登入
            bus.emit('login',this.loginInfo)//廣播登入事件
        },
        //註冊回調函數
        singUp(){
            this.singUpInfo.url='https://peter-liao.herokuapp.com/sing/singUp'//api設為註冊
            bus.emit('login',this.singUpInfo)//廣播登入事件
        }
    },
    mounted(){
        this.setting = JSON.parse(localStorage.getItem('loggin'))
        this.loginInfo.email=this.setting.email
        this.loginInfo.password=this.setting.passWord
        if(this.loginInfo.email){
            setTimeout(()=>{
                this.singIn()
            },1000)
        }

        //監聽重新按下登入鈕事件(導航區組件)
        bus.on('loginP',res=>{
            if(res==true){
                this.pcontorl=true
            }
        })

        //監聽登入訊息,如成功則放進localstorage並關閉面板
        bus.on('loginReply',res=>{
            console.log(res)
            if(res.data=='登入成功'){

                //放進localstorage
                let data = this.setting
                data.email=res.userInfo.email
                data.passWord=res.userInfo.passWord
                data=JSON.stringify(data)
                localStorage.setItem('loggin',data)
                //放進localstorage
                
                this.control()//關閉面板

            }else if(res.data=='註冊成功'){
                alert('註冊成功請重新登入')
                this.loginInfo.email=this.singUpInfo.email
                this.loginInfo.password=this.singUpInfo.password               
                this.isreg=false
            }
        })
    }
}
</script>

<style scoped>
    .bi{
        position: absolute;
        font-size: 1.2em;
        cursor: pointer;
        top: 20px;
        right: 20px;
    }
    .bi:hover{
        font-size: 1.25em;
    }
    .loginPannel{
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 30%;
        top: 30%;
        width: 40%;
        height: 50%;
        border: solid 3px rgba(126, 118, 118, 0.5);
        background: rgba(245, 242, 242);
        align-items: center;
        justify-content: center;
    }
        #input_group{
            width: 80%;
            display: flex;
            flex-direction: column;
        }
        input{
            border: none;
            font-size: 1.5em;
            background: transparent;
            color: #333;
            border-bottom:solid 1px rgba(56, 54, 54, 0.5) ;
        }
        span{
            font-size: 1.5em;
        }
    input:focus{
        outline:none;
    }
    #btn_group{
        width: 80%;
        display: flex;
        justify-content: center;
    }
    #login{
        cursor: pointer;
        text-align: center;
        flex: 1;
        padding: 1% 1%;
        background: rgba(221, 216, 216, 0.5)
    }
    #login:hover{
        background: rgba(66, 63, 63, 0.5)
    }
    #remember{
        width: 80%;
    }
</style>
