const express = require('express')
const app=express()
const PORT=4030
const mongo = require("mongodb")
const MongoClient=mongo.MongoClient
const MONGO_URL = "mongodb://127.0.0.1:27017";
app.use(express.json());
let db;

app.get("/",function(req,res){
    res.send("Hello everyone");
})

app.get("/userList",function(req,res){
    res.send(users);
})

app.get("/locations",function(req,res){
    const result=db.collection("locations").find().toArray((err,result)=>{
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

//get restaurant data by stateId || mealId
app.get("/restaurants",function(req,res){
    let query={};   
    let stateId=Number(req.query.state_id);
    let mealId=Number(req.query.mealId);
    if(stateId){
        query={state_id:stateId};
    }
    else if(mealId){
        query={"mealTypes.mealtype_id":mealId};
    }
    
    db.collection("restaurants")
    .find(query)
    .toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});


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

//filter(Cuisine and cost filter)
app.get("/filter/:mealId",function(req,res){
    let query={};   
    let mealId=Number(req.params.mealId);
    let cuisineId=Number(req.query.cuisineId);
    let lcost=Number(req.query.lcost);
    let hcost=Number(req.query.hcost);
    let sort={cost:1};
    if(req.query.sort){
        sort ={cost:req.query.sort}
    }
    if(cuisineId){
        query={
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId,
        };
    }else if(lcost && hcost){
        query={
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
        }
    }
    else if(cuisineId && lcost && hcost){
        query={
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],

        }
    }

    db.collection("restaurants")
    .find(query)
    .sort(sort)
    .toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});






//MongoDB connection




MongoClient.connect(MONGO_URL,(err,client)=>{
    console.log("Mongodb is connected");
    if(err)console.log("error while connecting");
    db=client.db("ed-may-intern");
    app.listen(PORT,()=>console.log("Server started on the port",PORT));
});

