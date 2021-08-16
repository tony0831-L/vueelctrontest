<template>
    <div class="ytdl">
        <div class="row">
        <select v-model="chose">
            <option disabled value="">選擇模式</option>
            <option v-for="(i,index) in mode" :value="i" :key="index">{{i}}</option>
        </select>
        &nbsp;
        <input type="text" name="" id="" placeholder="輸入連結" v-model="url" @keyup.enter="search">
        &nbsp;
        </div>
        <ytpl v-if="chose==='單曲模式'"></ytpl>
        <ytdll v-if="chose==='清單模式'"></ytdll>
    </div>
</template>

<script>
import bus from './bus.ts'
import ytpl from './ytpl.vue'
import ytdll from './ytdll.vue'
export default {
	name: 'ytdl',
    components:{ ytpl,ytdll },
	data(){
		return{
            url:"",
            chose:"",
            mode:["單曲模式","清單模式"]
		}
	},
    methods:{
        search(){
            if(this.chose==="單曲模式"){
                bus.emit('ytdl', this.url);
            }else if(this.chose==="清單模式"){
                bus.emit('ytpl', this.url);
            }else{
                return
            }
        }
    },
}
</script>

<style scoped>
    .ytdl{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: black;
    }
        select{
            font-size: 1.25em;
            background-color: transparent;
            color: #fff;
            border: none;
            text-align: center;
            border-bottom:solid 1px #fff ;
        }
            option{
                color: #333;
            }
        .row{
            display: flex;
            width: 100%;
            margin-bottom: 5%;
            justify-content: center;
        }
        .ytdl .row input{
            font-size: 1.25em;
            width: 45%;
            color: #fff;
            background:transparent;
            border: none;
            border-bottom:solid 1px #fff ;
        }
        .ytdl .row input:focus{
            outline:none
        }
</style>
