const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    

    const movieDB = client.db("MovieMasterProDB");
    const movieCollection = movieDB.collection("movies");
    

    
    app.get('/movies', async (req, res) => {

        const cursor = movieCollection.find();
        const movies = await cursor.toArray();
        res.send(movies);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch(error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('MovieMaster Pro Server is running!');
});

app.listen(port, () => {
  console.log(`MovieMaster Pro Server listening on port ${port}`);
});