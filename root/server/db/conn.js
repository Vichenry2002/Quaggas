const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
let _db;

const connectToServer = async () => {
  try {
    const client = new MongoClient(Db);
    await client.connect();
    _db = client.db("Quaggas"); 
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
    throw err; 
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
};

module.exports = { connectToServer, getDb };
