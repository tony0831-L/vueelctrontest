<template>
    <div class="contaner" v-if='ison'>
        <div class="rows">
        <div class="contaner a">
        <p>
            {{info.title}}---{{info.author}}
            &nbsp;&nbsp;
        </p>
        <i class="pause bi bi-pause-fill" v-show="!playing&&!loading"></i>
        <img src="../assets/loading.gif" alt="" id="load" class="pause" v-show="loading">
        <video :src="info.video_url" alt="" autoplay :volume=0 @play="play" @pause="pause" @click="contorl"  :class="{full:fullscreen===true}" ></video>
        <p>
            <span v-for="(i,index) in info.keyWord" :key="index" v-show="index<=5">
                {{i}}
                &nbsp;
                
            </span>
        </p>
        </div>
        <div class="contaner">
            <div class="rels">
                <span class="rel">相關影片</span>
                <div class="rel" v-for="(i,index) in info.relatedVideos" :key="index" @click="change(i.id)" style='cursor: pointer;'>
                    <img :src="i.thumbnails[0].url" alt="">
                    &nbsp;
                    <span>{{i.title}}</span>
                </div>
            </div>
            <div class="modes" style="margin-top: 1%;width: 100%;display: flex;justify-content: flex-start;">
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <span :class="{nowplaying:mode==='ListLoop'}" @click="mode='ListLoop'" style="cursor: pointer;">ListLoop</span>
                    &nbsp;&nbsp;
                    <span :class="{nowplaying:mode==='SingleLoop'}" @click="mode='SingleLoop'" style="cursor: pointer;">SingleLoop</span>
                    &nbsp;&nbsp;
                    <span :class="{nowplaying:mode==='LoopFrom'}" @click="mode='LoopFrom'" style="cursor: pointer;">LoopFrom</span>
            </div>
            <div>
                {{state}}
            </div>
        </div>
        </div>
        <div class="fs" :class="{normal:fullscreen===flase}">
        <audio :src="info.audio_url" :volume="volume"  controls :loop="mode==='SingleLoop'" @ended="end" @pause="pause" @play="play" @timeupdate="timeupdate" :class="{fulls:fullscreen===true}"></audio>
        <div class="fuctionf" >
            <div class="formats" v-show="setting===true">
                <span v-for="(i,index) in formats.formats" :key="index"  :class="{now:i.qua == nowformat}" @click="format(i)">{{i.qua}}&nbsp;{{i.type}}<hr/></span>
            </div>
            <i class="dl bi bi-download" @click="dl" style='cursor: pointer;'></i>
            &nbsp;
            <i class="dl setting bi bi-fullscreen" @click="fullscreen=!fullscreen"></i>
            &nbsp;
            <i class="dl setting bi bi-gear" @click="setting=!setting"></i>
        </div>
        </div>
    </div>
</template>

<script>
import bus from '../components/bus.ts'
import ytdl from 'ytdl-core'
import dl from '../assets/js/dl.js'
import videoFilter from '../assets/js/filter'
let ipcRenderer = require('electron').ipcRenderer;
export default {
	name: 'player',
	data(){
		return{
            info:{},
            formats:{},
            ison:false,
            volume:"",
            mode:"ListLoop",
            now:"",
            state:"",
            fullscreen:false,
            setting:false,
            nowformat:"",
            playing:false,
            loading:true,
            itag:"",
            type:"",
		}
	},
    methods:{
        change(id){
            bus.emit('ytdl', id);
            this.pause()
            this.now=id
        },
        getsetting(){
            this.volume=JSON.parse(localStorage.getItem('setting')).volume
            this.nowformat=this.info.best
        },
        end(){
            console.log('end')
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
            let info={
                title:this.info.title,
                url:this.now
            }
            dl(info,JSON.parse(localStorage.getItem('setting')).file,this.itag,this.type)
            this.state=`${this.info.title+"."+this.type} 正在下載中`
            ipcRenderer.on('testreply', (event,arg)=>{
                this.state=(arg)
            });
        },
        play(){
            this.playing=true
            this.loading=false
            document.querySelector('audio').play()
            document.querySelector('video').play()
        },
        pause(){
            this.playing=false
            document.querySelector('video').currentTime=document.querySelector('audio').currentTime 
            document.querySelector('audio').pause()
            document.querySelector('video').pause()
        },
        timeupdate(){
            let def =Math.abs(document.querySelector('video').currentTime-document.querySelector('audio').currentTime)
            if(def>0.25){
                document.querySelector('video').currentTime=document.querySelector('audio').currentTime
                console.log("@def:",def)
            }
        },
        format(i){
            this.nowformat=i.qua
            let url = i.url
            url = url.toString(url)
            this.info.video_url = url
            this.itag=i.itags
            this.type=i.type
            document.querySelector('video').currentTime=document.querySelector('audio').currentTime
        },
        contorl(){
            if(this.playing){
                this.pause()
            }else{
                this.play()
            }
        }
    },
	mounted(){
        bus.on('ytdl',url=>{
            this.loading=true
            this.ison=true
            this.now=url
            let hurl,quality,y=0
            ytdl.getInfo(url).then((info)=>{
                (info.formats).forEach((e)=>{if((e.hasAudio==true)&&(e.hasVideo==true)){if(y<e.itag){hurl=e.url;quality=e.qualityLabel}}})
                this.itag=ytdl.chooseFormat(info.formats,{ quality: 'highestvideo' }).itag
                this.type=ytdl.chooseFormat(info.formats,{ quality: 'highestvideo' }).container
                let data={
                    "thumb":info.videoDetails.thumbnails[info.videoDetails.thumbnails.length-1],
                    "title":info.videoDetails.title,
                    "video_url":ytdl.chooseFormat(info.formats,{ quality: 'highestvideo' }).url,
                    "best":ytdl.chooseFormat(info.formats,{ quality: 'highestvideo' }).qualityLabel,
                    "audio_url":ytdl.chooseFormat(info.formats,{ quality: 'highestaudio' }).url,
                    "hightest_url":hurl,
                    "hightest_quality":quality,
                    "keyWord":info.videoDetails.keywords,
                    "author":info.videoDetails.author.name,
                    "relatedVideos":info.related_videos,
                }
                this.info=(data)
            })
            videoFilter(url).then(info=>{
                this.formats=info
                this.getsetting()
            })
        })
    }
}
</script>

<style scoped>
.formats{
    display: flex;
    font-size: .7em;
    position: absolute;
    top: -400%;
    background: white;
    flex-direction: column;
    cursor: pointer;
    border: solid 1px #333;
    height: 205px;
    overflow: auto;
    overflow-x: hidden;
    padding: 3%;
    justify-content: center;
}
    .formats::-webkit-scrollbar {
        display: none;
    }
.formats span{
padding: 0% 1%;
}
.now{
    background: #333;
    color: white;
    font-weight: bolder;
}
.normal{
    opacity: .8;
}
.fs{
    transition: all 0.25s;
    opacity: .01;
}
.fs:hover{
    transition: all 0.25s;
    opacity: .8;
}
.contaner .full{
    background: black;
    position:absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}
.fulls{
    width: 87.5%;
}
.setting{
    cursor: pointer;
}
.pause {
    position:absolute;
    font-size: 5em;
    transform: translateX(-17vw);
}
.pause:hover {
    font-size: 5.1em;
}
.fuction{
    padding: 0% 1%;
    background: rgba(51, 51, 51,0.7);
    transform: translateY(-99%) translateX(1%);
    font-size: 1.2em;
}
    .fuction span{
        position: absolute;
        font-size: .5em;
    }
    .fuctionf{
        height: 54px;
        padding: 0% 1%;
        position: absolute;
        top: 100%;
        transform: translateY(-100%)translateX(-100%);
        background: #F1F3F4;
        font-size: 1.5em;
        width: 12%;
        left: 100%;
        color: black;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-around;
    }

.rows{
    display: flex;
}
.contaner{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
    .contaner video{
        cursor: pointer;
        width: 37.4vw;
        height: 21vw;
        border: solid 1px #fff;
        border-radius: .3em;
    }
    .contaner .full video{
        width: 100vw;
    }
    .contaner p{
        text-align: center;
        width: 38vw;
    }
    .a{
        align-items: flex-end;
        padding-right: 6% ;
    }
audio{
    position: absolute;
    left: 0px;
    top: 100%;
    transform: translateY(-100%);
    width: 87.5%;
    background: #F1F3F4;
}
.rels{
    width: 90%;
    height: 20em;
    overflow: scroll;
}
.rels::-webkit-scrollbar {
    display: none;
}
.rel{
    padding: .5% .5%;
    display: flex;
    width: 100%;
    border-bottom: solid .5px #9a9a9a;
    align-items: center;
}
    .rels img{
        width: 30px;
        height: 30px;
    }
    .rel:hover{
        background: #F1F3F4;
        color: #333;
    }
.nowplaying{
    background: #7F8288;
}
.nowplaying i{
    font-size: 1.1em;
}
#load{
    width: 5vw;
    transform: translateX(-16vw)
}
</style>
