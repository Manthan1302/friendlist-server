const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Friend = require('./friend');
const { request, response } = require('express');
const port = 7777;
const cors = require('cors')


//connect to mongodb
mongoose.connect("process.env.mongodb+srv://manthan:7567527578@cluster0.wzcth.mongodb.net/FriendsNode?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false,}
)
.then(()=>{
    console.log("connected");   
    //setting listening port
    app.listen(port,()=>{console.log(`server is on port ${port}`);});
})
.catch((err)=>{
    console.log('err: ', err);
});

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(bodyparser.json());

//get all friends get api
app.get("/getAllFriend",async(request,response)=>{
    try {
        const friend = await Friend.find();
        if(friend.length == 0){
            return response.status(400).json("no friends awailable")
        }
        response.status(200).json(friend)
        // console.log('friend: ', friend);

    } catch (error) {
        console.log('error: ', error);
        
    }
});

//add  friends post api 
app.post("/postFriend",async(request,response)=>{
    try {
        const data = request.body;
        console.log('request.body: ', request.body);
        console.log('data: ', data);
        const isExist = await Friend.findOne({email:data.email});
        if(isExist){
            response.status(400).json("user already exsit");
        }
        else{
            const newFriend = new Friend(data);
            await newFriend.save();
            response.status(201).json(newFriend)
        }
    } catch (error) {
        console.log('error: ', error);

    }
})

//update friends with id put api
app.put("/updateFriend/:id",async(request,response)=>{
    const _id = request.params.id;
    console.log('_id: ', _id);

    const data = request.body;
    console.log('data: ', data);
    try {
        const friend = await Friend.findByIdAndUpdate({_id},{$set:data},{new:true});
        if(!friend){
            return response.status(404).json("Friend not Found")
        }
        response.status(200).json(friend);
    } catch (error) {
        console.log('error: ', error);
        
    }
})

//delete friends with id delete api
app.delete("/deleteFriend/:id",async(request,response)=>{
    const _id = request.params.id;
    console.log('_id: ', _id);    
    try {
        const friend  = await Friend.findByIdAndDelete({_id});
        if(!friend){
            return response.status(404).json("Friend not found");
        }
        response.status(200).json(friend); 
    } catch (error) {
        console.log('error: ', error);
        
    }
})