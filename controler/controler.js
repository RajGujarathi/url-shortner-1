const Url=require('../models/models')
const validUrl = require('valid-url')
const config = require('config');
const sha=require("crypto")
const baseurl = config.get('Customer.url');
const date = require('date-and-time');
const NodeCache = require('node-cache')
const myCache = new NodeCache()

module.exports.shortner=async(req,res)=>{
    
   try{
    const url=await Url.findOne({where:{Shorturl:baseurl+req.params.shortner}}).catch((err)=>{res.status(400).json(err)})
    
    if(url){

    await url.increment('clicks')
    res.redirect(url.longurl)
}
else{
    return res.status(404).json('No url found')
}}
catch(err){
    console.error(err)
    res.status(500).json('Server Error')
}
}


module.exports.encode=async(req,res)=>{
    
    console.log(req.body.longUrl)
    const longurl=req.body.longUrl;
    console.log(longurl)
    if (!validUrl.isUri(baseurl)) {
        return res.status(401).json({error:'Invalid base URL'})
    }
    if (validUrl.isUri(longurl)) {
        try {
            let url = await Url.findOne({where:{
                 longurl
            }
               
            }).catch((Err)=>{console.log(Err)})
            if (url) {
                console.log(url.dataValues.expiresIn)
                url.update({expiresIn:new Date(date.addYears(new Date(), 1))})
                console.log(url.dataValues.Shorturl
                    )
                let urlq=url.dataValues.Shorturl
               //  res.send({Shorturl:urlq})
               res.send({ some: urlq })
            } else {
                let hash=sha.createHash("sha256").update(longurl).digest("base64");
                hash=hash.toString().substring(0,8)
                var chars={'/':'_','+':'='}
                hash=hash.replace(/[/+]/g,m=>chars[m])
                const Shorturl =baseurl+hash
                console.log(Shorturl)
                
                url=await Url.create({longurl:longurl,Shorturl:Shorturl}).catch((err)=>{res.status(400).json(err)})
                 res.status(200).json({some:Shorturl})
            }
        }        catch (err) {
            console.log(err)
            res.status(500).json({error:'Server Error'})
        }
    } 
    else {
        res.status(401).json({error:'Invalid longUrl'})
    }
}

module.exports.preview=async(req,res)=>{
    console.log(baseurl+req.params.shortner)
    try{
        const url=await Url.findOne({where:{Shorturl:baseurl+req.params.shortner}}).catch((err)=>{res.status(400).json(err)})
        console.log(url)
        if(url){
            let length=url.longurl.length
       // await url.increment('clicks')
        res.render('preview',{longurl:url.longurl,Shorturl:url.Shorturl,length:length})
        }
    else{
        return res.status(404).json('No url found')
    }}
    catch(err){
        console.error(err)
        res.status(500).json('Server Error')
    }   
}


module.exports.page=async(req,res)=>{
    setInterval(async() => {
        let url=await Url.findAll({
            limit: 5,
            order:[['clicks','DESC']],
            attributes: ['longurl','Shorturl','clicks']
        })
        myCache.set('toplinks', url)
        console.log("Updating top links  ")
        
    }, 1000*60*30);
    if(res.locals.auth){
        if(myCache.has('toplinks')){
            console.log('Retrieved value from cache !!')
              let top=myCache.get('toplinks')
            res.render('dashbord',{toplinks:top})
           }
         else{
            let toplinks =  await Url.findAll({
                limit: 5,
                order:[['clicks','DESC']],
                attributes: ['longurl','Shorturl','clicks']
            })
            myCache.set('toplinks', toplinks)
            console.log('Value not present in cache,'
                  + ' performing computation')
                  res.render('dashbord',{toplinks:toplinks})
                }
    //    let toplinks=    await Url.findAll({
    //         limit: 5,
    //         order:[['clicks','DESC']],
    //         attributes: ['longurl','Shorturl','clicks']
    //     })
    //     console.log(toplinks)
    
        // res.render('dashbord',{toplinks:toplinks})
    }
    else{ res.render('login') }  

}

module.exports.details=async(req,res)=>{
    if(res.locals.auth){
        

        try{
            const url=await Url.findOne({where:{Shorturl:req.body.Shorturl}}).catch((err)=>{res.status(400).json(err)})
            if(url){
             res.status(200).json({url:url})
        }
        else{
            return res.status(404).json({message:'No url found'})
        }}
        catch(err){
            console.error(err)
            res.status(500).json({message:'Server Error'})
        }
               
    }
    else{ res.render('login') }  

}

module.exports.about=async(req,res)=>{
res.render('about')
 }

