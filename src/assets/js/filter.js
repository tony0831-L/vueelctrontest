const ytdl = require('ytdl-core')

export default async function filter(url){
    let data=[],best=[37,22,18],b
    await ytdl.getInfo(url).then((info)=>{info.formats.forEach(formats=>{data.push({itags:formats.itag,qua:formats.qualityLabel,type:formats.container,url:formats.url})})})
    data.forEach(i=>{best.forEach(itag=>{if(i.itags===itag){b=i}})})
    data = data.filter(i=>{return ((i.type === 'mp4' || i.type === 'webm') && i.qua!=null && i.qua!='144p' && i.qua!='240p' && i.itags!=37 && i.itags!=18 && i.itags!=22) })
    data = data.filter((el,index,arr)=>{return(arr.map(x=>x.qua).indexOf(el.qua)==index)})
    data={best:b,formats:data}
    return(data) 
}

