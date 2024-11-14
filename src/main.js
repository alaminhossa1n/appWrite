import { Client, Databases } from 'node-appwrite';
require("dotenv").config();

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);


  const databases = new Databases(client);
  // Route handling based on request path
  if (req.path === "/ping") {
    return res.text("Pong");
  }

  // Fetch data from the Appwrite database
  if (req.path === "/data" && req.method === "GET") {
    try {
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID
      );
      return res.json(response.documents);
    } catch (err) {
      error("Could not retrieve data: " + err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // Default response
  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
    Message: "Hello World!"
  });
};
