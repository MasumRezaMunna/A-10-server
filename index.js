const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


const initialMovies = [
{
      "title": "Inception",
      "genre": "Sci-Fi",
      "releaseYear": 2010,
      "director": "Christopher Nolan",
      "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt",
      "rating": 8.8,
      "duration": 148,
      "plotSummary": "A thief who steals corporate secrets through dream-sharing technology...",
      "posterUrl": "https://i.ibb.co/L5rK5Qd/inception.jpg", 
      "language": "English",
      "country": "USA",
      "addedBy": "admin@moviemaster.com" 
    },
    {
      "title": "The Shawshank Redemption",
      "genre": "Drama",
      "releaseYear": 1994,
      "director": "Frank Darabont",
      "cast": "Tim Robbins, Morgan Freeman",
      "rating": 9.3,
      "duration": 142,
      "plotSummary": "Two imprisoned men bond over a number of years...",
      "posterUrl": "https://i.ibb.co/v4tN12x/shawshank.jpg",
      "language": "English",
      "country": "USA",
      "addedBy": "admin@moviemaster.com"
    },
    {
      "title": "Pulp Fiction",
      "genre": "Crime",
      "releaseYear": 1994,
      "director": "Quentin Tarantino",
      "cast": "John Travolta, Uma Thurman",
      "rating": 8.9,
      "duration": 154,
      "plotSummary": "The lives of two mob hitmen, a boxer, a gangster and his wife...",
      "posterUrl": "https://i.ibb.co/sK6s73V/pulp-fiction.jpg",
      "language": "English",
      "country": "USA",
      "addedBy": "admin@moviemaster.com"
    },
  ]


async function run() {
  try {
    

   const movieDB = client.db("MovieMasterProDB");
    const movieCollection = movieDB.collection("movies");
    
    // TEMPORARY: Endpoint to inject initial data
    app.get('/inject-movies', async (req, res) => {
        const count = await movieCollection.countDocuments();
        if (count === 0) {
            const result = await movieCollection.insertMany(initialMovies);
            res.send({ message: "Initial movies added successfully!", count: result.insertedCount });
            console.log("Initial movies added to DB.");
        } else {
            res.send({ message: "Database already contains movies. No injection performed." });
        }
    });



    // 1. At the top, update your mongodb import
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Add ObjectId

// ... inside the async run() function ...

// --- (Existing /inject-movies and /movies routes are here) ---

// 2. NEW: Endpoint to GET a SINGLE movie by ID
app.get('/movies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const movie = await movieCollection.findOne(query);
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(400).send({ message: "Invalid movie ID format" });
    console.error(error);
  }
});

// 3. NEW: Endpoint to ADD (POST) a new movie
app.post('/movies', async (req, res) => {
  const newMovie = req.body;
  console.log('Adding new movie:', newMovie);
  try {
    const result = await movieCollection.insertOne(newMovie);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add movie", error });
  }
});

// 4. NEW: Endpoint to UPDATE (PUT) a movie
app.put('/movies/:id', async (req, res) => {
  const id = req.params.id;
  const movieData = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true }; // Not strictly needed for update, but good to know
  
  // We exclude _id and addedBy (as per requirements) from the update set
  delete movieData._id; 
  // delete movieData.addedBy; // We'll just ensure it's not editable on the client

  const updateDoc = {
    $set: {
      ...movieData // Set all fields from the body
    },
  };
  
  try {
    const result = await movieCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update movie", error });
  }
});


// 5. NEW: Endpoint to DELETE a movie
app.delete('/movies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await movieCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete movie", error });
  }
});
    

    
    app.get('/movies', async (req, res) => {
        const cursor = movieCollection.find().sort({ releaseYear: -1 }); // Sort by newest first
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