<template>
    <div class="logs">
        <span>
            下載位置:
            <input type="text" v-model="setting.file">
        </span>
        <span>
            視窗預設大小:
            <input type="text" v-model="size">
        </span>
        <span>
            預設音量:
            <input type="text" v-model="setting.volume">
        </span>
        <span>
            下載模式:{{setting.dlmode}}
            &nbsp;
            <select v-model="setting.dlmode" >
            <option v-for="(i,index) in mode" :value="i" :key="index">{{i}}</option>
        </select>
        </span>
        <span>
            背景顏色:
            &nbsp;
            <div class="color" style="background: black;">黑</div>
            &nbsp;&nbsp;
            <div class="color">白</div>
            &nbsp;&nbsp;
            <div class="color" style="background: gray; color:#fff">灰</div>
        </span>
        <span>
            是否允許全螢幕:
            &nbsp;&nbsp;&nbsp;
            <input type="checkbox" name="" id="" v-model="full">
        </span>
        <span>
            <div class="submit" @click="submit">確定更改</div>
        </span>
    </div>
</template>

<script>
export default {
	name: 'log',
	data(){
		return{
            size:"1280*770",
            full:true,
            setting:{},
            mode:["純音樂(預設)","手動模式","最高品質"]
		}
	},
    methods:{
        submit(){
            let newdata= JSON.stringify(this.setting)
            localStorage.setItem('setting',newdata)
        },
    },
    mounted(){
        this.setting=JSON.parse(localStorage.getItem('setting'))
    }
}
</script>

<style scoped>
/* 這是初始logs設定*/
    .logs{
        width: 60%;
        display: flex;
        flex-direction: column;
        background: #FAFAFA;
        border:solid 1px rgba(60, 59, 59, 0.3);
        box-shadow: .3em .3em .1em 0 rgb(0 0 0 / 21%);
    }
        span{
            font-size: 1em;
            color: #878787;
            display: flex;
            width: 100%;
            padding: 1% 0px;
            border-bottom: solid 1px rgba(51, 51, 51,.5);
            justify-content: center;
            align-items: center;
        }
        .logs a{
            color: #878787;
            text-decoration: underline #878787;
        }
        .logs input{
            text-align: center;
            vertical-align: bottom;
            font-size: 1em;
            color: #878787;
            border: none;
            background: transparent;
            border-bottom: solid 1px #878787;
        }
        .logs input:focus{
            outline:none
        }
    /* 這是初始log */

    /* 送出按鈕樣式 */
    .submit{
        cursor: pointer;
        padding: .05% .05%;
        border:solid 1px rgba(60, 59, 59, 0.3);
        border-radius:.3em ;
    }
    .submit:hover{
        color: white;
        background: rgba(51, 51, 51,.5);
    }
    /* 送出按鈕樣式 */

    /* 選單樣式 */
    select{
        font-size: 1em;
        border: solid .5px;
        background: transparent;
        color: #878787;
        border-radius: .3em;
    }
    /* 選單樣式 */

    /* 顏色按鈕 */
    .color{
        cursor: pointer;
        border: solid 1px #878787;
        padding: .3%;
    }
        .color:hover{
            font-size: 1.1em;
        }
    /* 顏色按鈕 */
</style>
