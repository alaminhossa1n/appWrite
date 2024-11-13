const express = require("express");
require("dotenv").config();
const sdk = require("node-appwrite");

const app = express();
app.use(express.json());

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const port = process.env.PORT;
// APPWRITE
const appWriteDatabaseId = process.env.APPWRITE_DATABASE_ID;
const appWriteCollectionId = process.env.APPWRITE_COLLECTION_ID;

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route to add data to the Appwrite database
app.post("/add", async (req, res) => {
  const { data } = req.body;

  try {
    const response = await databases.createDocument(
      appWriteDatabaseId,
      appWriteCollectionId,
      "unique()", // Generates a unique ID for the document
      data // The data to be saved
    );
    res.status(200).json({ message: "Data added successfully", response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all data from the Appwrite database
app.get("/data", async (req, res) => {
  try {
    const response = await databases.listDocuments(
      appWriteDatabaseId,
      appWriteCollectionId
    );
    res.status(200).json(response.documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
