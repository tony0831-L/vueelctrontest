<template>
    <div class="logs">
        <span id="header">!find使用紀錄</span>
        <span id="func">
            <p v-for="(i,index) in func" :key="index" :class="{isact:index===nowacting}" @click="nowacting=index;page=1">
                {{i}}
            </p>
        </span>
        <div class="log" v-for="(i,index) in logs" :key="i.__id" v-show="nowacting===0">
            <span v-show="(index>=(page-1)*10)&&(index<(page*10))">
                {{index+1}}. {{i.user}}在第{{i.pkg}}包抽中了{{i.cha}}-{{i.qua}}
                <p v-show="i.cheat">*作弊</p>
            </span>
        </div>
        <div class="log" v-for="(i,index) in logs" :key="i.__id" v-show="nowacting===1">
            <span v-show="(index>=(page-1)*10)&&(index<(page*10))">
                {{index+1}}. {{i.user}}抽中了第{{i.pkg}}包
            </span>
        </div>
        <div class="log" v-for="(i,index) in logs" :key="i.__id" v-show="nowacting===2">
            <span v-show="(index>=(page-1)*10)&&(index<(page*10))">
                {{index+1}}. {{i.user}}抽中了{{i.cha}}
            </span>
        </div>
        <div class="log" v-for="(i,index) in logs" :key="i.__id" v-show="nowacting===3">
            <span v-show="(index>=(page-1)*10)&&(index<(page*10))">
                {{index+1}}. {{i.user}}抽中了{{i.qua}}-{{i.cha}}
            </span>
        </div>
        <span id="footer">
            <div>
                共{{logs.length}}筆資料
            </div>
            <div class="cont">
                <div style="display:flex;cursor: pointer;">第
                    <p @click="edit" v-if='!isediting'>{{page}}</p>
                    <input type="text" @keyup.enter="edit" v-model.lazy="page" v-else>
                    頁</div>
                &nbsp;
                <p>顯示{{max}}筆資料</p>
                <i class="bi bi-chevron-double-left" @click="prev" style="cursor: pointer;"></i>
                <i class="bi bi-chevron-double-right" @click="next" style="cursor: pointer;"></i>
            </div>
        </span>
    </div>
</template>

<script>
import bus from '../components/bus.ts'
export default {
	name: 'log',
	data(){
		return{
            max:10,
            page:1,
            func:['全部顯示','包數','角色','品質'],
            nowacting:0,
            logs:'',
            isediting:false,
		}
	},
    methods:{
        prev(){
            if (this.page>1) {
                this.page=this.page-1
            }else{
                return
            }
        },
        next(){
            if (this.page<(this.logs.length/10)) {
                this.page++
            }else{
                return
            }
        },
        edit(){
            this.isediting=!this.isediting
        }
    },
    mounted(){
        bus.on('roll',input=>{
        this.logs=input
        })
    }
}
</script>

<style scoped>
 /* 這是初始logs設定*/
    .logs{
        width: 60%;
        background: #FAFAFA;
        border:solid 1px rgba(60, 59, 59, 0.3);
        box-shadow: .3em .3em .1em 0 rgb(0 0 0 / 21%);
    }
        span{
            font-size: 1em;
            color: #878787;
            display: flex;
            width: 100%;
            padding:1% 0px;
            border-bottom: solid 1px rgba(51, 51, 51,.5);
        }
        .logs a{
            color: #878787;
            text-decoration: underline #878787;
        }
    /* 這是初始log */

    /* 這是上方nav的樣式 */
    #func{
        color: #5f5e5e;
        display: flex;
        justify-content: space-evenly;
        cursor: pointer;
    }
        #func p:hover{
            background: #b6b6b6;
            border-radius: .3em;
        }
    /* 這是上方nav的樣式 */

    /* 這是標頭的樣式 */
    #header{
        display: flex;
        justify-content: center;
        color: #5f5e5e;
        border-bottom: solid 3px rgba(51, 51, 51,.5);
    }
    /* 這是標頭的樣式 */

    /* 這是底部nav的樣式 */
    #footer{
        color: #5f5e5e;
        display: flex;
        justify-content: space-between;
        border-top: solid 3px rgba(51, 51, 51,.5);
        border-bottom:none;
    }
        .cont{
            display: flex;
        }
     /* 這是底部nav的樣式 */
</style>


