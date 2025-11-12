const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const allowedOrigins = ['https://golden-bubblegum-05f10dd.netlify.app']; 
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Sample initial movies ---
const initialMovies = [
  {
    title: "Inception",
    genre: "Sci-Fi",
    releaseYear: 2010,
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt",
    rating: 8.8,
    duration: 148,
    plotSummary:
      "A thief who steals corporate secrets through dream-sharing technology...",
    posterUrl: "https://i.ibb.co/Qv72PnRS/Inception.jpg",
    language: "English",
    country: "USA",
    addedBy: "admin@moviemaster.com",
  },
  {
    title: "The Shawshank Redemption",
    genre: "Drama",
    releaseYear: 1994,
    director: "Frank Darabont",
    cast: "Tim Robbins, Morgan Freeman",
    rating: 9.3,
    duration: 142,
    plotSummary: "Two imprisoned men bond over a number of years...",
    posterUrl: "https://i.ibb.co/9HH1n13Q/the-Shawshank-redemption.jpg",
    language: "English",
    country: "USA",
    addedBy: "admin@moviemaster.com",
  },
  {
    title: "Pulp Fiction",
    genre: "Crime",
    releaseYear: 1994,
    director: "Quentin Tarantino",
    cast: "John Travolta, Uma Thurman",
    rating: 8.9,
    duration: 154,
    plotSummary:
      "The lives of two mob hitmen, a boxer, a gangster and his wife...",
    posterUrl: "https://i.ibb.co/xtN35g1h/Pulp-fiction.jpg",
    language: "English",
    country: "USA",
    addedBy: "admin@moviemaster.com",
  },
  
  {
    "title": "The Dark Knight",
    "genre": "Action",
    "releaseYear": 2008,
    "director": "Christopher Nolan",
    "cast": "Christian Bale, Heath Ledger",
    "rating": 9.0,
    "duration": 152,
    "plotSummary": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
    "posterUrl": "https://i.ibb.co/wFxrKnpx/the-dark-knight.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Forrest Gump",
    "genre": "Drama",
    "releaseYear": 1994,
    "director": "Robert Zemeckis",
    "cast": "Tom Hanks, Robin Wright",
    "rating": 8.8,
    "duration": 142,
    "plotSummary": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal... all seen from the perspective of an Alabama man with an IQ of 75.",
    "posterUrl": "https://i.ibb.co/tpkZJxTC/forrest-gump.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Parasite",
    "genre": "Thriller",
    "releaseYear": 2019,
    "director": "Bong Joon Ho",
    "cast": "Song Kang-ho, Lee Sun-kyun",
    "rating": 8.5,
    "duration": 132,
    "plotSummary": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    "posterUrl": "https://i.ibb.co/4wcrGQ2N/parasite.jpg",
    "language": "Korean",
    "country": "South Korea",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Spirited Away",
    "genre": "Animation",
    "releaseYear": 2001,
    "director": "Hayao Miyazaki",
    "cast": "Rumi Hiiragi, Miyu Irino",
    "rating": 8.6,
    "duration": 125,
    "plotSummary": "During her family's move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches, and spirits...",
    "posterUrl": "https://i.ibb.co/bj222qwL/Spirited-away.jpg",
    "language": "Japanese",
    "country": "Japan",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "The Matrix",
    "genre": "Sci-Fi",
    "releaseYear": 1999,
    "director": "Lana Wachowski, Lilly Wachowski",
    "cast": "Keanu Reeves, Laurence Fishburne",
    "rating": 8.7,
    "duration": 136,
    "plotSummary": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    "posterUrl": "https://i.ibb.co/zWgrT2C9/matrix.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Gladiator",
    "genre": "Action",
    "releaseYear": 2000,
    "director": "Ridley Scott",
    "cast": "Russell Crowe, Joaquin Phoenix",
    "rating": 8.5,
    "duration": 155,
    "plotSummary": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    "posterUrl": "https://i.ibb.co/2YhZddLY/Gladiator.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "The Grand Budapest Hotel",
    "genre": "Comedy",
    "releaseYear": 2014,
    "director": "Wes Anderson",
    "cast": "Ralph Fiennes, F. Murray Abraham",
    "rating": 8.1,
    "duration": 99,
    "plotSummary": "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
    "posterUrl": "https://i.ibb.co/BHKXNx3t/the-grand-budapest-hotel.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Interstellar",
    "genre": "Sci-Fi",
    "releaseYear": 2014,
    "director": "Christopher Nolan",
    "cast": "Matthew McConaughey, Anne Hathaway",
    "rating": 8.7,
    "duration": 169,
    "plotSummary": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    "posterUrl": "https://i.ibb.co/mrrzZCG4/interstellar-new-poster-wallpaper.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "The Shining",
    "genre": "Horror",
    "releaseYear": 1980,
    "director": "Stanley Kubrick",
    "cast": "Jack Nicholson, Shelley Duvall",
    "rating": 8.4,
    "duration": 146,
    "plotSummary": "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence...",
    "posterUrl": "https://i.ibb.co/5wHTtTb/the-shining.jpg",
    "language": "English",
    "country": "USA",
    "addedBy": "admin@moviemaster.com"
  },
  {
    "title": "Amélie",
    "genre": "Romance",
    "releaseYear": 2001,
    "director": "Jean-Pierre Jeunet",
    "cast": "Audrey Tautou, Mathieu Kassovitz",
    "rating": 8.3,
    "duration": 122,
    "plotSummary": "Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.",
    "posterUrl": "https://i.ibb.co/m5rSFHmM/Am-lie.jpg",
    "language": "French",
    "country": "France",
    "addedBy": "admin@moviemaster.com"
  }

];

// --- Main server logic ---
async function run() {
  try {
    await client.connect();
    const movieDB = client.db("MovieMasterProDB");
    const movieCollection = movieDB.collection("movies");
    const watchlistCollection = movieDB.collection("watchlists");

    console.log("Connected to MongoDB ✅");

    // Inject initial movies (only once)
    app.get("/inject-movies", async (req, res) => {
      const count = await movieCollection.countDocuments();
      if (count === 0) {
        const result = await movieCollection.insertMany(initialMovies);
        res.send({
          message: "Initial movies added successfully!",
          count: result.insertedCount,
        });
      } else {
        res.send({
          message: "Database already contains movies. No injection performed.",
        });
      }
    });

    // Get all movies
    app.get("/movies", async (req, res) => {
      let query = {};

      if (req.query.genres) {
        query.genre = { $in: req.query.genres.split(",") };
      }

      const ratingMin = parseFloat(req.query.ratingMin);
      const ratingMax = parseFloat(req.query.ratingMax);

      if (!isNaN(ratingMin) && !isNaN(ratingMax)) {
        query.rating = { $gte: ratingMin, $lte: ratingMax };
      } else if (!isNaN(ratingMin)) {
        query.rating = { $gte: ratingMin };
      } else if (!isNaN(ratingMax)) {
        query.rating = { $lte: ratingMax };
      }

      if (req.query.title) {
        query.title = { $regex: req.query.title, $options: "i" };
      }

      try {
        const movies = await movieCollection
          .find(query)
          .sort({ releaseYear: -1 })
          .toArray();
        res.send(movies);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch movies", error });
      }
    });

    // Get movie by ID
    app.get("/movies/:id", async (req, res) => {
      try {
        const movie = await movieCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (movie) res.send(movie);
        else res.status(404).send({ message: "Movie not found" });
      } catch {
        res.status(400).send({ message: "Invalid movie ID format" });
      }
    });

    // Add new movie
    app.post("/movies", async (req, res) => {
      try {
        const result = await movieCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add movie", error });
      }
    });

    // Update movie
    app.put("/movies/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateDoc = { $set: { ...req.body } };
        delete updateDoc.$set._id;

        const result = await movieCollection.updateOne(
          { _id: new ObjectId(id) },
          updateDoc,
          { upsert: true }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update movie", error });
      }
    });

    // Delete movie
    app.delete("/movies/:id", async (req, res) => {
      try {
        const result = await movieCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete movie", error });
      }
    });

    // Get movies by user email
    app.get("/movies-by-email", async (req, res) => {
      const userEmail = req.query.email;
      if (!userEmail)
        return res
          .status(400)
          .send({ message: "Email query parameter is required." });

      try {
        const movies = await movieCollection
          .find({ addedBy: userEmail })
          .toArray();
        res.send(movies);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch user's movies", error });
      }
    });

    // Add to watchlist
    app.post("/watchlist", async (req, res) => {
      const { userEmail, movieId } = req.body;
      if (!userEmail || !movieId)
        return res
          .status(400)
          .send({ message: "User email and movie ID are required." });

      const existing = await watchlistCollection.findOne({
        userEmail,
        movieId,
      });
      if (existing)
        return res.status(409).send({ message: "Movie already in watchlist." });

      try {
        const result = await watchlistCollection.insertOne({
          userEmail,
          movieId,
          addedAt: new Date(),
        });
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add to watchlist", error });
      }
    });

    // Get user's watchlist
    app.get("/watchlist/:email", async (req, res) => {
      try {
        const watchlistMovies = await watchlistCollection
          .aggregate([
            { $match: { userEmail: req.params.email } },
            { $addFields: { movieIdObj: { $toObjectId: "$movieId" } } },
            {
              $lookup: {
                from: "movies",
                localField: "movieIdObj",
                foreignField: "_id",
                as: "movieDetails",
              },
            },
            { $unwind: "$movieDetails" },
            { $replaceRoot: { newRoot: "$movieDetails" } },
          ])
          .toArray();

        res.send(watchlistMovies);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch watchlist", error });
      }
    });

    app.delete("/watchlist/:movieId", async (req, res) => {
      const { movieId } = req.params;
      const { email } = req.query;

      if (!email || !movieId)
        return res
          .status(400)
          .send({ message: "Email and movie ID are required." });

      try {
        const result = await watchlistCollection.deleteOne({
          userEmail: email,
          movieId,
        });
        if (result.deletedCount === 0)
          return res
            .status(404)
            .send({ message: "Movie not found in watchlist" });
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to remove movie from watchlist", error });
      }
    });

    // Ping test
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB ping successful 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("🎬 MovieMaster Pro Server is running!");
});

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
