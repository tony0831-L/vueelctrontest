<template>
    <div class="back">
        <nav>
            <router-link to="/"  :class="{isact:now==='0'}" @click='load' id='0'>首頁</router-link>
            <router-link to="/log"  :class="{isact:now==='1'}" @click="load" id='1'>!find使用紀錄</router-link>
            <router-link to="/roll"  :class="{isact:now==='2'}" @click="load" id='2'>抽包紀錄</router-link>
        </nav>
        <router-view>
        </router-view>
    </div>
</template>

<script>
import axios from 'axios'
import bus from './bus.ts'
export default {
	name: 'backend',
	data(){
		return{
            now:"0"
		}
	},
    methods:{
        load(e){
            if(e){
                this.now=e.target.id
            }
            axios.get('https://peter-liao.herokuapp.com/getdata')
            .then((res)=>{
                bus.emit('log', res.data);
            })
            axios.post('https://peter-liao.herokuapp.com/getlog',null)
            .then((res)=>{
                bus.emit('roll', res.data);
            })
        },
    },
    mounted(){
        this.load()
    }
}
</script>

<style scoped>
    .back{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #FAFAFA;
    }
        .back a{
            color: #878787;
            cursor: pointer;
            border-radius: .3em;
            border: solid 1px #878787;
            box-shadow: 0.15em 0.15em 0.1em 0 rgb(0 0 0 / 21%);
        }
        .back nav{
            padding: .1% .1%;
            display: flex;
            justify-content: space-evenly;
            width: 60%;
            font-size: 1.25em;
            margin-bottom: .7%;
        }
</style>
