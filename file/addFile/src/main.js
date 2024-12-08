import { Client, Storage, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(client);

  if (req.method === 'POST') {
    try {
      const bucketId = process.env.TEST_BUCKET_ID;

      if (!bucketId) {
        throw new Error('Missing required environment variable: BUCKET_ID');
      }

      // Assuming the file is in the request body as raw binary data
      const fileBuffer = Buffer.from(req.body);

      const response = await storage.createFile(
        bucketId,
        ID.unique(),
        fileBuffer,
        'file.txt' // Optional: Specify a filename
      );

      return res.json({
        success: true,
        code: 200,
        message: 'File uploaded successfully',
        file: response,
      });
    } catch (error) {
      log('Error occurred:', error);
      return res.json({
        success: false,
        message: error.message || 'Server Error',
        code: error.code || 500,
      });
    }
  }

  return res.json({
    success: false,
    message: 'Method not allowed',
    code: 405,
  });
};
