<template>
    <div class="home">
        <div class="cloumn">
            <div class="row">
                <i class="bi bi-arrow-left" v-show="isplay" id="prev" @click="prev"></i>
                <input type="text" name="" id="" placeholder="搜尋" v-model="keyword" @keyup.enter="search">
                <div @click="search"><i class="search bi bi-search"></i></div>
            </div>
            <span>共{{results}}個結果,目前顯示{{list.length}}個結果</span>
        </div>
        <div class="results" v-show="list.length!=0&&!isplay">
            <div class="result" v-for="(i,index) in list" :key="index" v-show="i.type==='video'">
                <div v-if="i.type=='video'">
                    <img :src="i.bestThumbnail.url" :alt="i.title" @click="play(i.url)">
                </div>
                <div class="vinfo">
                    <span>{{i.title}}</span>
                    <span id="views">觀看次數:{{i.views}}•{{i.uploadedAt}}</span>
                    <span style="display: flex;" v-if="i.author"><img :src="i.author.avatars[0].url" alt="" v-if="i.author.avatars[0].url"><i v-else class="bi bi-person-circle"></i> &nbsp;{{i.author.name}}</span>
                    &nbsp;
                    <span class="duration">長度:{{i.duration}}</span>
                </div>
            </div>
        </div>
        <ytpl v-if="ison"></ytpl>
    </div>
</template>

<script>
import bus from './bus.ts'
import ytsr from 'ytsr'
import ytpl from './ytpl.vue'
export default {
	name: 'homepage',
    components:{ ytpl },
	data(){
		return{
            keyword:"",
            results:0,
            list:[],
            isplay:false,
            ison:true,
		}
	},
    methods:{
        search(){
            this.prev()
            async function get(keyword){
                let r1 
                await ytsr(keyword,{pages:'2'}).then(res=>{ r1=res })
                r1={
                    results:r1.results,
                    list:r1.items
                }
                return r1
            }
            get(this.keyword).then(res=>{
                this.results=res.results,
                this.list = res.list
            })
        },
        play(url){
            console.log(url)
            this.ison = true
            setTimeout(()=>{
                bus.emit('ytdl',url);
                this.isplay=true
            },100)
        },
        prev(){
            this.ison=false
            this.isplay=false
        }
    },
    mounted(){
        bus.on('test',input=>{
            if(input!='首頁'&&input!='後臺管理'){
                console.log(input)
                this.prev()
            }
        })
    }
}
</script>

<style scoped>
    .home{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #878787;
        background: #FAFAFA;
    }
        .cloumn{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1%;
        }
        .row{
            display: flex;
            width: 100%;
            justify-content: center;
        }
        .home .row input{
            font-size: 1.25em;
            width: 45%;
            color: #878787;
            background:transparent;
            border: none;
            border:solid .3px rgba(60, 59, 59, 0.3);
            box-shadow: 0.2em 0.2em 0.3em 0 rgb(0 0 0 / 21%);
        }
        .home .row input:focus{
            outline:none
        }
        .search{
            cursor: pointer;
            font-size: 1.3em;
            margin-left: -130%;
        }
            .search:hover{
                padding: 0% 20%;
                background: #87878752;
                border-radius: .3em;
            }
        .results{
            height: 70%;
            overflow: scroll;
            width: 70%;
            display: flex;
            flex-direction: column;
            padding-left: 8%;
        }
            .results::-webkit-scrollbar {
                display: none;
            }
            .result {
                margin-bottom: 2em;
                display: flex;
            }
            .result img{
                cursor: pointer;
                width: 20vw;
            }
        .vinfo{
            font-size: .9em;
            margin-left: 1em;
            display: flex;
            flex-direction: column;
        }
            #views{
                margin-top: .5em;
                font-size: .85em;
                margin-bottom: .5em;;
            }
            .vinfo img{
                width: 24px;
                border-radius: 99%;
            }
            .duration{
                background: #878787;
                width: 6em;
                color: #fff;
                border-radius: .2em;
                padding: .5%;
                display: flex;
                justify-content: center;
                align-content: center;
            }
            #prev{
                cursor: pointer;
                position: absolute;
                font-size: 2em;
                font-weight: bolder;
                color: #fff;
                left: 40%;
                top: .5%;
            }
</style>
