const ytdl = require('ytdl-core')

module.exports = async function getInfo(url){
    let data
    await ytdl.getInfo(url).then((info)=>{
        (info.formats).forEach((e)=>{
            let hurl,quality,y=0
            if((e.hasAudio==true)&&(e.hasVideo==true)){
                if(y<e.itag){
                    hurl=e.url;quality=e.qualityLabel
                }
            }
        })
            data={
                "title":info.videoDetails.title,
                "highestvideo":ytdl.chooseFormat(info.formats,{ quality: 'highestvideo' }).itag,
                "highestaudio":ytdl.chooseFormat(info.formats,{ quality: 'highestaudio' }).itag,
            }
    })
    return(data) 
}
