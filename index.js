const express = require("express");

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.shiwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // add item to server
    app.post('/additem',async(req,res)=>{
      const data = req.body;
      const my_db = client.db("tourism");
      const table= my_db.collection('places');
      await table.insertOne(data,(err,result)=>{
        if(err) throw err;
        else res.send(result);
      });

    })
    //request accept 
    app.post('/acceptrequest',async(req,res)=>{
      const id = req.body.id;
      const query = {_id : ObjectId(id)};
      const update= {$set : {request : 1}};
      const my_db = client.db("tourism");
      const table= my_db.collection('requests');
      await table.updateOne(query,update,(err,result)=>{
           if (err) throw err;
           else res.send(result);
      });

    })

    //delete request
    app.post('/deleterequest',async(req,res)=>{
        const id = req.body.id;
        const query = {_id : ObjectId(id)};
        const my_db = client.db("tourism");
        const table= my_db.collection('requests');
        await table.deleteOne(query,(err,result)=>{
               if (err) throw err;
               else res.send(result);
        });
    
     })
         //delete place
    app.post('/deleteplace',async(req,res)=>{
      const id = req.body.id;
      const query = {_id : ObjectId(id)};
      const my_db = client.db("tourism");
      const table= my_db.collection('places');
      await table.deleteOne(query,(err,result)=>{
             if (err) throw err;
             else res.send(result);
      });
  
   })

    app.post('/interested_places',async(req,res)=>{
      const data = req.body;
      const my_db = client.db("tourism");
      const table= my_db.collection('requests');
      const result = await table.insertOne(data);

    })
   //get all list
    app.get('/requestlists',async(req,res)=>{
      const my_db = client.db("tourism");
      const table= my_db.collection('requests');
      await table.find({}).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });

    })
    //get particular list
    app.post('/mylists',async(req,res)=>{
      const email = req.body.email;
      const query = {email : email};
      const my_db = client.db("tourism");
      const table= my_db.collection('requests');
      await table.find(query).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });

    })

    app.get('/getplaces',async (req,res)=>{
      const my_db = client.db("tourism");
      const table= my_db.collection('places');
      await table.find({}).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });
    })
    
    app.get('/place/:id',async (req,res)=>{
      const id = req.params.id;
  
      const my_db = client.db("tourism");
      const table= my_db.collection('places');
      await table.find({_id : ObjectId(id)}).toArray((err,result)=>{
        if (err) throw err;
        else res.send(result);
      })
     // console.log(id);
    })
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('This is from node express');
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Listening at 5000");
})