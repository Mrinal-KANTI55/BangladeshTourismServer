require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.8iwul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("tourism");
    const collection = database.collection("offer");
    const userCollection = database.collection("userInfo");
    const transportCollection = database.collection("transportInfo");
    // find one user 
    app.get('/offer/:id', async (req, res) => {
      const offerId = req.params.id;
      const offerNum = { _id: ObjectId(offerId) };
      const result = await collection.findOne(offerNum);
      res.send(result);
    });
    //   get all offers 
    app.get('/offer', async (req, res) => {
      const offer = collection.find({});
      const result = await offer.toArray();
      res.json(result);
    });
    //   get all offers 
    app.get('/transportInfo', async (req, res) => {
      const offer = transportCollection.find({});
      const result = await offer.toArray();
      res.json(result);
    });
    // test for get all user get offer
    app.get('/user', async (req, res) => {
      const offer = userCollection.find({});
      const result = await offer.toArray();
      res.json(result);
    });
    //   get all user own offers 
    app.get('/user/:email', async (req, res) => {
      const usersEmail = req.params.email;
      const offerNum = { userEmail: usersEmail };
      const offerCollect = userCollection.find(offerNum);
      const result = await offerCollect.toArray();
      res.json(result);
    });

    //   insert transportInfo 
    app.post('/transportInfo', async (req, res) => {
      const data = req.body;
      const result = await transportCollection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    //   insert offer 
    app.post('/offer', async (req, res) => {
      const data = req.body;
      const result = await collection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    //   insert user information 
    app.post('/user', async (req, res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    // delete user offer 
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const data = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(data);
      res.json(result);
    });


  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Tour server http://localhost:${port}`)
})