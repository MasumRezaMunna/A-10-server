// movies.js
const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (client) => {
  const router = express.Router();

  const movieDB = client.db("MovieMasterProDB");
  const movieCollection = movieDB.collection("movies");
  const watchlistCollection = movieDB.collection("watchlists");
  // Sample movies (initial injection)
  const initialMovies = [
    {
      title: "Inception",
      genre: "Sci-Fi",
      releaseYear: 2010,
      director: "Christopher Nolan",
      cast: "Leonardo DiCaprio",
      rating: 8.8,
      duration: 148,
      plotSummary: "A thief who steals corporate secrets...",
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
    }, // Add more movies as needed
  ]; // --- Inject initial movies ---

  router.get("/inject-movies", async (req, res) => {
    const count = await movieCollection.countDocuments();
    if (count === 0) {
      const result = await movieCollection.insertMany(initialMovies);
      return res.send({
        message: "Initial movies added!",
        count: result.insertedCount,
      });
    }
    res.send({ message: "Movies already exist, skipping injection." });
  }); // --- Get all movies ---

  router.get("/movies", async (req, res) => {
    let query = {};
    if (req.query.genres) query.genre = { $in: req.query.genres.split(",") };

    const ratingMin = parseFloat(req.query.ratingMin);
    const ratingMax = parseFloat(req.query.ratingMax);

    if (!isNaN(ratingMin) && !isNaN(ratingMax))
      query.rating = { $gte: ratingMin, $lte: ratingMax };
    else if (!isNaN(ratingMin)) query.rating = { $gte: ratingMin };
    else if (!isNaN(ratingMax)) query.rating = { $lte: ratingMax };

    if (req.query.title)
      query.title = { $regex: req.query.title, $options: "i" };

    try {
      const movies = await movieCollection
        .find(query)
        .sort({ releaseYear: -1 })
        .toArray();
      res.send(movies);
    } catch (err) {
      res.status(500).send({ message: "Failed to fetch movies", err });
    }
  });
  // --- NEW: Get movies added by a specific user (FOR MyCollection.jsx) ---
  router.get("/movies-by-email", async (req, res) => {
    const email = req.query.email;
    if (!email)
      return res.status(400).send({ message: "User email is required" });

    try {
      // ডাটাবেসে সেই মুভিগুলি খুঁজুন, যেখানে 'addedBy' ফিল্ডটি ইউজার ইমেলের সাথে মেলে
      const movies = await movieCollection
        .find({ addedBy: email })
        .sort({ addedAt: -1 })
        .toArray();
      res.send(movies);
    } catch (err) {
      res.status(500).send({ message: "Failed to fetch user's movies", err });
    }
  }); // --- Get movie by ID ---

  router.get("/movies/:id", async (req, res) => {
    try {
      const movie = await movieCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!movie) return res.status(404).send({ message: "Movie not found" });
      res.send(movie);
    } catch {
      res.status(400).send({ message: "Invalid ID format" });
    }
  }); // --- Add new movie ---

  router.post("/movies", async (req, res) => {
    try {
      const result = await movieCollection.insertOne(req.body);
      res.status(201).send(result);
    } catch (err) {
      res.status(500).send({ message: "Failed to add movie", err });
    }
  }); // --- Update movie ---

  router.put("/movies/:id", async (req, res) => {
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
    } catch (err) {
      res.status(500).send({ message: "Failed to update movie", err });
    }
  }); // --- Delete movie ---

  router.delete("/movies/:id", async (req, res) => {
    try {
      const result = await movieCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: "Failed to delete movie", err });
    }
  }); // --- Watchlist routes ---

  router.post("/watchlist", async (req, res) => {
    const { userEmail, movieId } = req.body;
    if (!userEmail || !movieId)
      return res.status(400).send({ message: "Email and movieId required" });

    const exists = await watchlistCollection.findOne({ userEmail, movieId });
    if (exists)
      return res.status(409).send({ message: "Already in watchlist" });

    const result = await watchlistCollection.insertOne({
      userEmail,
      movieId,
      addedAt: new Date(),
    });
    res.status(201).send(result);
  });

  router.get("/watchlist/:email", async (req, res) => {
    try {
      const list = await watchlistCollection
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

      res.send(list);
    } catch (err) {
      res.status(500).send({ message: "Failed to fetch watchlist", err });
    }
  });

  router.delete("/watchlist/:movieId", async (req, res) => {
    const { email } = req.query;
    const { movieId } = req.params;
    if (!email || !movieId)
      return res.status(400).send({ message: "Email & movieId required" });

    const result = await watchlistCollection.deleteOne({
      userEmail: email,
      movieId,
    });
    if (result.deletedCount === 0)
      return res.status(404).send({ message: "Movie not in watchlist" });
    res.send(result);
  });

  return router;
};
