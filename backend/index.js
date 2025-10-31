import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import couchbase from "couchbase";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Couchbase setup
let cluster, bucket, collection;

async function initCouchbase() {
  try {
    cluster = await couchbase.connect(process.env.CB_CONNECT_STRING, {
      username: process.env.CB_USERNAME,
      password: process.env.CB_PASSWORD,
    });

    bucket = cluster.bucket("punchdata");
    const scope = bucket.scope("punchscope");
    collection = scope.collection("punches");

    console.log("✅ Couchbase connected successfully");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
}

await initCouchbase();

// Save punch-in time
app.post("/api/punchin", async (req, res) => {
  try {
    const { time } = req.body;
    const id = `punch_${Date.now()}`;

    await collection.insert(id, {
      time,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Punch-in saved", id });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all punch-in times
app.get("/api/punchin", async (req, res) => {
  try {
    const query = `SELECT time, createdAt FROM punchdata.punchscope.punches ORDER BY createdAt DESC`;
    const result = await cluster.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
