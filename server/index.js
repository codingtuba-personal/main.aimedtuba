global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const express = require('express')
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const cors = require('cors')
const fetch = require('node-fetch')
const secure = require('tuba-secure')

// website login passcode and announcements passcode
const code = secure.main.codes.website
const announcements = secure.main.codes.announcements
let databases={
    redirect:new MongoClient(secure.main.mongodb.url),
    accounts:new MongoClient(secure.main.mongodb.url),
    announcements:new MongoClient(secure.main.mongodb.url),
    comments:new MongoClient(secure.main.mongodb.url),
    async connect(){
        await this.redirect.connect()
        await this.accounts.connect()
        await this.announcements.connect()
        await this.comments.connect()
    }
}
databases.connect()

const app = express()

app.use(cors())
app.use(express.json())
app.listen(1000)

app.post('/code', (req, res) => {
    console.log(req.body)
    if(req.body.code&&req.body.announcements){
        res.json({
            code: req.body.code==code,
            announcements: req.body.announcements==announcements,
        })
    }else{res.sendStatus(406)}
})
// announcements editing, getting, making, and deleteing
app.get('/announcements', async (req, res) => {
    if(req.query.code){
        if(req.query.code==code){
            let announcements_data = await databases.announcements.db('main').collection('announcements').find({}).toArray()
            let comments_data = await databases.comments.db('main').collection('comments').find({}).toArray()
            comments_data.forEach(i => i.login="_")
            res.json({
                announcements: announcements_data,
                comments: comments_data,
            });
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.post('/announcements', async (req, res) => {
    if(req.body.code&&req.body.announcement){
        if(req.body.code.website&&req.body.code.announcements&&req.body.announcement.title&&req.body.announcement.content){
            if(req.body.code.website==code&&req.body.code.announcements==announcements){
                await databases.announcements.db("main").collection("announcements").insertOne({
                    title: req.body.announcement.title,
                    content: req.body.announcement.content,
                    comments:[]
                })
                res.sendStatus(200);
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.put('/annoucments', async (req, res) => {
    if(req.body.code&&req.body.announcement){
        if(req.body.code.website&&req.body.code.announcements&&req.body.announcement.id&&req.body.announcement.title&&req.body.announcement.content){
            if(req.body.code.website==code&&req.body.code.announcements==announcements){
                // try to find annoucment
                let found=await databases.announcements.db("main").collection("announcements").find({_id: new mongodb.ObjectId(req.body.announcement.id)}).toArray();
                found=found.length==1
                if(found==true){
                    await databases.announcements.db("main").collection("announcements").updateOne({_id: new mongodb.ObjectId(req.body.announcement.id)},{$set: {
                        title: req.body.announcement.title,
                        content: req.body.announcement.content,
                    }})
                    res.sendStatus(200);
                }else{res.sendStatus(404)}
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.delete('/annoucments', async (req, res) => {
    if(req.body.code){
        if(req.body.code.website&&req.body.code.announcements&&req.body.announcement_id){
            if(req.body.code.website==code&&req.body.code.announcements==announcements){
                // try to find annoucment
                let found=await databases.announcements.db("main").collection("announcements").find({_id: new mongodb.ObjectId(req.body.announcement_id)}).toArray();
                found=found.length==1
                if(found==true){
                    let comments=await databases.announcements.db("main").collection("announcements").find({_id: new mongodb.ObjectId(req.body.announcement_id)}).toArray();
                    await databases.announcements.db("main").collection("announcements").deleteOne({_id: new mongodb.ObjectId(req.body.announcement_id)})
                    await databases.comments.db("main").collection("comments").deleteMany({_id: {$in: comments[0].comments}})
                    res.sendStatus(200);
                }else{res.sendStatus(404)}
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.put('/comment', async (req, res) => {
    if(req.body.code){
        if(req.body.code.website&&req.body.code.account&&req.body.announcement_id&&req.body.content){
            console.log(req.body.code.account)
            console.log(req.body.code.website==code)
            let account=await databases.accounts.db("accounts").collection("users").find({login: req.body.code.account}).toArray();
            account=account.length==1
            if(req.body.code.website==code&&account==true){
                // try to find annoucment
                let found=await databases.announcements.db("main").collection("announcements").find({_id: new mongodb.ObjectId(req.body.announcement_id)}).toArray();
                found=found.length==1
                if(found==true){
                    await databases.comments.db("main").collection("comments").insertOne({
                        login: req.body.code.account,
                        content: req.body.content,
                    })
                    let comment_id=await databases.comments.db("main").collection("comments").find({}).toArray()
                    await databases.announcements.db("main").collection("announcements").updateOne({_id: new mongodb.ObjectId(req.body.announcement_id)},{$push: {
                        comments: comment_id.reverse()[0]._id,
                    }})
                    res.sendStatus(200);
                }else{res.sendStatus(404)}
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.delete('/comment', async (req, res) => {
    if(req.body.code){
        if(req.body.code.website&&(req.body.code.account||req.body.code.announcements)&&req.body.comment_id){
            let account=await databases.accounts.db("accounts").collection("users").find({login: req.body.code.account}).toArray();
            account=account.length==1
            if(req.body.code.website==code&&(account==true||req.body.code.announcements==announcements)){
                // try to find comment
                let found=await databases.comments.db("main").collection("comments").find({_id: new mongodb.ObjectId(req.body.comment_id)}).toArray();
                found=found.length==1
                if(found==true){
                    await databases.comments.db("main").collection("comments").deleteOne({_id: new mongodb.ObjectId(req.body.comment_id)})
                    await databases.announcements.db("main").collection("announcements").updateMany({},{$pull: {comments: new mongodb.ObjectId(req.body.comment_id)}})
                    res.sendStatus(200);
                }else{res.sendStatus(404)}
            }else{res.sendStatus(401)}
        }else{res.sendStatus(406)}
    }else{res.sendStatus(406)}
})
app.get('/redirect',async (req, res) => {
    if(req.query.code&&req.query.login){
        if(req.query.code==code){
            databases.redirect.db("main").collection("redirect").find({login: req.query.login}).toArray().then(result => {
                res.json(result);
            })
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.put('/redirect',async (req, res) => {
    if(req.body.code&&req.body.login&&req.body.id){
        if(req.body.code==code){
            let found= await databases.redirect.db("main").collection("redirect").find({_id: new mongodb.ObjectId(req.body.id),login: req.body.login}).toArray();
            if(found.length==1){
                let _dummy=await databases.redirect.db("main").collection("redirect").find({from: req.body.from}).toArray();
                if(_dummy.length==0){
                    let new_json={};
                    if(req.body.from&&req.body.from!="r"){new_json.from=req.body.from}
                    if(req.body.to){new_json.to=req.body.to}
                    await databases.redirect.db("main").collection("redirect").updateOne({_id: new mongodb.ObjectId(req.body.id)},{$set: new_json})
                    res.sendStatus(200);
                }else{res.sendStatus(409)}
            }
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.post('/redirect',async (req, res) => {
    if(req.body.code&&req.body.login&&req.body.from&&req.body.to&&req.body.options){
        if(req.body.code==code){
            let found=await databases.accounts.db("accounts").collection("users").find({login: req.body.login}).toArray();
            if(found.length==1){
                let _dummy=await databases.redirect.db("main").collection("redirect").find({from: req.body.from}).toArray();
                if(_dummy.length==0){
                    if(req.body.from=="r"){
                        databases.redirect.db("main").collection("redirect").insertOne({from: req.body.from,login: req.body.login})
                        let _dummy=await databases.redirect.db("main").collection("redirect").find({login: req.body.login,from: req.body.from}).toArray();
                        await databases.redirect.db("main").collection("redirect").updateOne({_id: _dummy[0]._id},{$set: {
                            login: req.body.login,
                            from: _dummy[0]._id+"",
                            to: req.body.to,
                            options: req.body.options,
                        }})
                    }else{
                        await databases.redirect.db("main").collection("redirect").insertOne({
                            login: req.body.login,
                            from: req.body.from,
                            to: req.body.to,
                            options: req.body.options,
                        })
                    }
                    res.sendStatus(200);
                }else{res.sendStatus(409)}
            }else{res.sendStatus(404)}
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})
app.delete('/redirect',async (req, res) => {
    if(req.body.code&&req.body.login&&req.body.id){
        if(req.body.code==code){
            let found=await databases.redirect.db("main").collection("redirect").find({_id: new mongodb.ObjectId(req.body.id),login: req.body.login}).toArray();
            if(found.length==1){
                await databases.redirect.db("main").collection("redirect").deleteOne({_id: new mongodb.ObjectId(req.body.id)})
                res.sendStatus(200);
            }else{res.sendStatus(404)}
        }
    }else{res.sendStatus(406)}
})
app.get('/redirect/check', async (req, res) => {
    if(req.query.login&&req.query.code&&req.query.from){
        if(req.query.code==code){
            let found=await databases.accounts.db("accounts").collection("users").find({login: req.query.login}).toArray();
            if(found.length==1){
                let _dummy=await databases.redirect.db("main").collection("redirect").find({from: req.query.from}).toArray();
                if(_dummy.length==0){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(409);
                }
            }else{res.sendStatus(404)}
        }else{res.sendStatus(401)}
    }else{res.sendStatus(406)}
})