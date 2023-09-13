const express = require('express')
const app=express()
const PORT=4030
const mongo = require("mongodb")
const MongoClient=mongo.MongoClient
const MONGO_URL = "mongodb://127.0.0.1:27017";
let db;

app.get("/",function(req,res){
    res.send("Hello everyone");
})

app.get("/userList",function(req,res){
    res.send(users);
})

app.get("/locations",function(req,res){
    const result=db.collection("location").find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
})

app.get("/quickSearch",function(req,res){
    const result=db.collection("mealTypes").find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
})


app.get("/restaurants",function(req,res){
    const result=db.collection("restaurants").find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
})
// app.get("/filter/:mealId",function(req,res){
//     let query={};
//     let mealId=Number(req.params.mealdId);
//     let cuisineId=Number(req.query.cuisineId);
//     //let lcost=Number(req.query.lcost);
//     //let hcost=Number(req.query.hcost);
//     if(cuisineId){
//         query={
        
//         }
//     }



// })

//MongoDB connection

MongoClient.connect(MONGO_URL,(err,client)=>{
    console.log("Mongodb is connected");
    if(err)console.log("error while connecting");
    db=client.db("ed-may-intern");
    app.listen(PORT,()=>console.log("Server started on the port",PORT));
});

