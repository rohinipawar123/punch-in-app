import express from "express";
import cors from "cors";
import couchbase from "couchbase";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 10000;

// Couchbase config
const clusterConnStr = process.env.COUCHBASE_ENDPOINT;
const username = process.env.COUCHBASE_USERNAME;
const password = process.env.COUCHBASE_PASSWORD;
const bucketName = process.env.COUCHBASE_BUCKET;

let bucket, collection;

// Connect to Couchbase
async function initCouchbase() {
  try {
    const cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
    });
    bucket = cluster.bucket(bucketName);
    collection = bucket.defaultCollection();
    console.log("✅ Couchbase connected successfully");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
}
initCouchbase();

// API routes
app.get("/", (req, res) => {
  res.send("Punch Backend is running");
});

app.get("/api/punches", async (req, res) => {
  try {
    const query = `SELECT p.* FROM \`${bucketName}\` p;`;
    const cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
    });
    const result = await cluster.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching punches:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/punches", async (req, res) => {
  try {
    const { time } = req.body;
    const id = `punch-${Date.now()}`;
    await collection.insert(id, { id, time });
    res.status(201).json({ message: "Punch added", id, time });
  } catch (err) {
    console.error("Error adding punch:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
