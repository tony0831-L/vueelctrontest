<template>
    <div class="contaner" :class="{choo:ison==false}">
        <div class="lst" v-if='siginin'>
            <div v-if="beforon" class="load">
            <img src="../assets/loading.gif" alt="" id="load">
            <span>歌單加載中...</span>
        </div>
            <i class="bi bi-arrow-left" v-show="ison" id="prev" @click="prev"></i>
            <div class="addlistP" v-show="!ison&&!iseding">
                <div v-if="!beforon" class="addlist" @click="addinglist=!addinglist">
                    <i class="bi bi-plus-lg"></i>
                    <span>
                        添加歌單
                    </span>
                </div>
                <div v-show="addinglist">&nbsp;</div>
                <input type="text" placeholder="輸入新歌單連結" v-model="newlist" v-show="addinglist" @keyup.enter="addlist">
            </div>
            <div class="addlistP" v-show="!ison&&!addinglist">
                <div v-if="!beforon" class="addlist" @click="edit">
                    <i class="bi bi-pen"></i>
                    <span>
                        編輯歌單
                    </span>
                </div>
            </div>
            <div class="addlistP" v-show="!ison&&!addinglist&&iseding">
                <div v-if="!beforon" class="addlist" @click="del">
                    <i class="bi bi-trash"></i>
                    <span>
                        確認刪除
                    </span>
                </div>
            </div>
            <i class="next bi bi-chevron-bar-left" @click="prevl" v-show="page!=1&&!ison"></i>
            <span v-for="(i,index) in playlists" :key="index" class="lists" v-show="(index>=(page-1)*4)&&(index<(page*4))">
            <div class="img" v-show="!ison"><img :src="i.img" alt="" @click="play(index)"></div>
            <span v-show="!ison">{{i.title}}</span>
            <span v-show="!ison">{{i.author.name}}•大約{{i.listlength}}首歌</span>
            <div  v-show="iseding">
                <input type="checkbox" name="" id="" class="selec" @change="select(i.id)" >
                <span>點我刪除</span>
            </div>
        </span>
        <i class="next bi bi-chevron-bar-right" @click="next" v-show="playlists.length>4&&(playlists.length>page*4)&&!ison"></i>
        </div>
        <span v-else>登入後使用</span>
        <ytdll v-if="control"/>
    </div>
</template>

<script>
import bus from '../components/bus.ts'
import ytdll from './ytdll.vue'
import ytpl from 'ytpl'
import axios from 'axios'
export default {
	name: 'mylist',
    components:{
        ytdll
    },
	data(){
		return{
            playlists:[],
            ison:false,
            control:true,
            beforon:true,
            userName:"",
            newlist:"",
            addinglist:false,
            iseding:false,
            page:1,
            dellist:[],
            siginin:false
		}
	},
    methods:{
        next(){
            if (this.page<((this.playlists.length/5)+1)) {
                this.page++
            }else{
                let p =(this.playlists.length/5)+1
                console.log(p)
                return
            }
        },
        prevl(){
            if (this.page>1) {
                this.page=this.page-1                
            }
        },
        getlist(name){
            axios.post('https://peter-liao.herokuapp.com/getData/getlist',{
                name:name
            }).then(res=>{
                this.playlists=res.data;
                for (let i = 0; i < this.playlists.length; i++) {
                    this.getinfo(this.playlists[i].list_url,this.playlists[i]._id).then(data=>{
                        this.beforon=false
                        this.playlists[i]=data
                    }).then(()=>{
                        localStorage.setItem('mylist',JSON.stringify(this.playlists))
                    })               
                }
            })
        },
        async getinfo(url,id){
            let data
            await ytpl( url,{limit:1}).then((e)=>{
                data={
                    id:id,
                    url:url,
                    author:e.author,
                    title:e.title,
                    img:e.bestThumbnail.url,
                    listlength:e.estimatedItemCount
                }
            })
            return data
        },
        prev(){
            this.control=false
            this.ison=false
            setTimeout(()=>{
                this.control=true
            },100)
        },
        play(index){
            this.control=true
            let url = this.playlists[index].url
            console.log(url)
            bus.emit('ytpl', url);
            this.ison=true;
        },
        addlist(){
            this.addinglist=false
            ytpl(this.newlist,{limit:1} ).then(e=>{
                let data={
                    url:this.newlist,
                    img:e.bestThumbnail.url,
                    name:this.getname()
                }
                axios.post('https://peter-liao.herokuapp.com/getData/addlist',data).then(res=>{
                    console.log(res)
                    this.getlist(this.getname())
                })
            })
        },
        select(id){
            this.dellist.push(id)
            console.log(this.dellist)
        },
        edit(){
            this.iseding=!this.iseding
        },
        del(){
            this.dellist.forEach(element => {
                axios.post('https://peter-liao.herokuapp.com/getData/dellist',{id:element}).then(res=>{
                    console.log(res)
                    this.getlist(this.getname())
                    this.page=1
                })
            })
        },
        getname(){
            let name = localStorage.getItem('name')
            return name
        }
    },
	mounted(){
        bus.on('loginReply',res=>{
            if(res.data==='登入成功'){
                console.log('getting')
                this.siginin=true
                this.getlist(res.userInfo.userName)
                localStorage.setItem('name',res.userInfo.userName)
            }
        })
        if(this.playlists.length===0){
            console.log("@")
            this.playlists=JSON.parse(localStorage.getItem('mylist'))
            this.beforon=false
        }
        bus.on('test',input=>{
            if(input==='首頁'){
                this.prev()
            }
        })
    },
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
.rows{
    display: flex;
}
.contaner{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    color: white;
    background: black;
}
.lst{
    width: 85%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-items: center;
}
.lists{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.img{
    width:160px;
    height: 120px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    border-radius: .3em;
    border: solid 1px #fff;
}
.img img{
    height: 128px;
}

#prev{
    cursor: pointer;
    position: absolute;
    font-size: 2em;
    font-weight: bolder;
    left: 40%;
    top: .5%;
}
.addlist{
    width: 80px;
    height: 170px;
    display: flex;
    cursor: pointer;
    font-size: .9em;
    border: solid 1px #fff;
    justify-content: center;
    align-items: center;
    color: #fff;
    flex-direction: column;
}
    .addlist i{
        font-size: 2em;
    }
    .addlist:hover{
        width: 90px;
        font-size: 1em;
    }
.addlistP{
    display: flex;
    flex-direction: column;
    align-items: center;
}
    .addlistP input{
        background: transparent;
        border: none;
        border-bottom: solid 1px #fff;
        font-size: 1.5em;
        color: #fff;
    }
        .addlistP input:focus{
            outline: none;
        }
    .next{
        cursor: pointer;
        font-size:3em
    }
        .next:hover{
            cursor: pointer;
            font-size:3.5em
        }
</style>
