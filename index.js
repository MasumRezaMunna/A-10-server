// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://golden-bubblegum-05f10ddd.netlify.app',
  'https://a-10-server-qhdn.vercel.app'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const movieRoutes = require("./movies")(client); // pass Mongo client
app.use("/", movieRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("🎬 MovieMaster Pro Server is running!");
});

// Start server
app.listen(port, async () => {
  try {
    await client.connect();
    console.log("✅ Server listening on port", port);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
});
