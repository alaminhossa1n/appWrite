const sdk = require("node-appwrite");

const client = new sdk.Client();
const databases = new sdk.Databases(client);

// Set up Appwrite client with environment variables
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

module.exports = async function (req, res) {
  // Check the method and path for routing
  if (req.path === "/" && req.method === "GET") {
    return res.send("Hello World!");
  }

  if (req.path === "/add" && req.method === "POST") {
    const { data } = req.body;

    try {
      // Create a document in Appwrite database
      const response = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID,
        "unique()",
        data
      );
      return res.status(200).json({ message: "Data added successfully", response });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.path === "/data" && req.method === "GET") {
    try {
      // Fetch documents from Appwrite database
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID
      );
      return res.status(200).json(response.documents);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Return 404 for unsupported routes
  return res.status(404).json({ error: "Route not found" });
};
