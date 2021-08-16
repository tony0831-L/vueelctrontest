<template>
    <div v-if="beforon" class="load">
        <img src="../assets/loading.gif" alt="" id="load">
        <span>清單加載中...</span>
    </div>
    <div class="contaner" v-if='ison'>
        <div class="rows">
            <div class="contaner">
            <p>
                {{info.title}}---{{info.author}}
                &nbsp;&nbsp;
                <i class="dl bi bi-download" @click="dl"></i>
            </p>
            <img :src="info.thumb.url" alt="">
            <p>
                <span v-for="(i,index) in info.keyWord" :key="index" v-show="index<=5">
                    {{i}}
                    &nbsp;
                </span>
            </p>
            </div>
            <div class="contaner">
            <div class="rels">
                <span class="rel header">{{title}} &nbsp; by &nbsp; {{author.name}}</span>
                <span class="rel">
                    <div>播放清單,共{{list.length}}首歌</div>
                    <div>Now Palying
                        <i class="bi bi-caret-right-fill"></i>
                        &nbsp;
                        {{info.title}}
                    </div>
                </span>
                <div class="rel" v-for="(i,index) in list" :key="index" @click="change(i.id,index)" style='cursor: pointer;' v-show="(index>=(page-1)*10)&&(index<(page*10))" :class="{nowplaying:index===now}">
                    <div>
                        <span v-show="index!=now">{{index+1}} .</span>
                    <i class="bi bi-caret-right-fill" 
                        v-show="index===now"
                    ></i>
                        <img :src="i.thumbnails[0].url" alt="">
                        &nbsp;
                        <span>{{i.title}}</span>
                    </div>
                    <div>
                        {{i.duration}}
                    </div>
                </div>
                <div style="display:flex;justify-content: space-between;">
                    <div style="display:flex;">
                    <div style="display:flex;cursor:pointer;">
                        第
                        <span @click="edit" v-if='!isediting'>{{page}}</span>
                        <input type="text" @keyup.enter="edit" v-model.lazy="page" v-else>
                        頁
                        &nbsp;
                        共{{ Math.floor((list.length/10)+1) }}頁
                    </div>
                    &nbsp;
                    <i class="bi bi-chevron-double-left" @click="prev" style="cursor: pointer;"></i>
                    <i class="bi bi-chevron-double-right" @click="next" style="cursor: pointer;"></i>
                    </div>
                    <div class="modes" style="margin-top:1%">
                        <span :class="{nowplaying:mode==='ListLoop'}" @click="mode='ListLoop'" style="cursor: pointer;">ListLoop</span>
                        &nbsp;
                        <span :class="{nowplaying:mode==='SingleLoop'}" @click="mode='SingleLoop'" style="cursor: pointer;">SingleLoop</span>
                        &nbsp;
                        <span :class="{nowplaying:mode==='LoopFrom'}" @click="mode='LoopFrom'" style="cursor: pointer;">LoopFrom</span>
                    </div>
                </div>
                <div>
                    {{state}}
                </div>
            </div>
        </div>
        </div>
        <audio :src="info.audio_url" :volume="volume" autoplay controls :loop="mode==='SingleLoop'" @ended="end" @pause="isplaying=false"></audio>
    </div>
</template>

<script>
import bus from '../components/bus.ts'
import ytpli from 'ytpl'
import ytdl from 'ytdl-core'
import dl from '../assets/js/dl.js'
let ipcRenderer = require('electron').ipcRenderer;
export default {
	name: 'liplayer',
	data(){
		return{
            author:{},
            info:{},
            list:[],
            ison:false,
            now:0,
            page:1,
            isediting:false,
            title:"",
            mode:"ListLoop",
            volume:"",
            state:"",
            beforon:false,
            isplaying:false,
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
            if (this.page<(this.list.length/10)) {
                this.page++
            }else{
                return
            }
        },
        change(id,index){
            this.play(id)
            this.now=index
        },
        play(id){
            let hurl,quality,y=0,data
            ytdl.getInfo(id).then((info)=>{
                (info.formats).forEach((e)=>{if((e.hasAudio==true)&&(e.hasVideo==true)){if(y<e.itag){hurl=e.url;quality=e.qualityLabel}}})
                data={
                    "thumb":info.videoDetails.thumbnails[info.videoDetails.thumbnails.length-1],
                    "title":info.videoDetails.title,
                    "audio_url":ytdl.chooseFormat(info.formats,{ quality: 'highestaudio' }).url,
                    "hightest_url":hurl,
                    "keyWord":info.videoDetails.keywords,
                    "time":info.videoDetails.uploadDate,
                    "author":info.videoDetails.author.name,
                    "hightest_quality":quality,
                }
            })
            .then(()=>{
                this.info=data
            })
            .then(()=>{
                this.ison=true
                this.beforon=false
                this.isplaying=true
            })
        },
        edit(){
            this.isediting=!this.isediting
        },
        end(){
            if(this.mode==='SingleLoop'){
                return
            }else if(this.now+1===this.list.length){
                this.now=0
                this.play(this.list[this.now].id)
                this.page=Math.floor((this.now/10))+1
            }else{
                this.play(this.list[this.now+1].id)
                this.now++
                this.page=Math.floor((this.now/10))+1
            }
        },
        dl(){
            dl(this.list[this.now],JSON.parse(localStorage.getItem('setting')).file)
            this.state=`${this.list[this.now].title}.mp3 正在下載中`
            ipcRenderer.on('testreply', (event,arg)=>{
                this.state=(arg)
            });
        },
        getsetting(){
            this.volume=JSON.parse(localStorage.getItem('setting')).volume
        }
    },
	mounted(){
        bus.on('ytpl',url=>{
            this.beforon=true
            ytpli(url,{pages:'Infinity'}).then((e)=>{
                this.author=e.author
                this.title=e.title
                this.list=e.items
            })
            .then(()=>{
                this.play(this.list[0].id)
                this.now=0
            })
        })
        this.getsetting()

        ipcRenderer.on('pct', ()=>{
            console.log("in")
            if (this.isplaying) {
                document.querySelector('audio').pause()
                this.isplaying=false
            } else {
                document.querySelector('audio').play()
                this.isplaying=true
            }
        });
    }
}
</script>

<style scoped>
.load{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#load{
    width: 30%;
}
.header{
    font-size: 1.25em;
}
.rows{
    display: flex;
    width: 100%;
}
.contaner{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
    .contaner img{
        width: 38vw;
    }
    .contaner p{
        text-align: center;
        width: 38vw;
    }
    .dl{
        cursor: pointer;
    }
audio{
    transition: all 0.25s;
    position: absolute;
    top: 100%;
    transform: translateY(-100%);
    width: 100%;
    background: #F1F3F4;
    opacity: .01;
}
audio:hover{
    opacity: 1;
}
.rels{
    width: 90%;
}
.rel{
    justify-content: space-between;
    padding: .5% .5%;
    display: flex;
    width: 100%;
    border-bottom: solid .5px #9a9a9a;
    align-items: center;
}
.rels img{
    width: 30px;
}
.nowplaying{
    background: #7F8288;
}
.nowplaying i{
    font-size: 1.1em;
}
</style>
