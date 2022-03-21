const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();



// Middelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrjhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    
    const database = client.db("Doctor_Endgame");
    const bookedCollection = database.collection("booked_test");
    const apointmentCollection = database.collection("apointment");
    const reviewCollection = database.collection("review");
    // Store Patient data to DB
    app.post('/apointmentinfo', async(req,res)=>{
      const data = req.body;
      const result = await apointmentCollection.insertOne(data);
      res.json(result.acknowledged)
    });

    // Post New Review to reviewCollection
    app.post('/addReview', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result)
    });
    // Get All Reviews to display on UI
    app.get('/review', async(req,res)=>{
      const result = await reviewCollection.find({}).toArray();
      res.json(result)
    });

    // Get My Order Info by email to display on UI
    app.get('/myOrder', async(req,res)=>{
      const email = req.query.email;
      const query = {email}
      const result = await apointmentCollection.find(query).toArray();
      res.json(result)
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("I am now in Doctor Endgame2 Server")
  });
app.listen(port, () => {
    console.log("Doctor Endgame2 listening at port ", port);
  
  })