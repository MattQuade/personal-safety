import axios from "axios";

// Helper to force runtime lookup (prevents Next.js build-time optimization)
const getEnv = (key: string) => process.env[key];

export async function sendSMS(to: string, text: string) {
  const apiKey = getEnv('MESSAGEMEDIA_API_KEY');
  const apiSecret = getEnv('MESSAGEMEDIA_API_SECRET');

  console.log("=== MESSAGE MEDIA DEBUG ===");
  console.log("API Key exists?", !!apiKey);
  console.log("API Secret exists?", !!apiSecret);
  console.log("Sending to:", to);

  if (!apiKey || !apiSecret) {
    console.error("CRITICAL: Missing MessageMedia credentials in environment variables!");
    throw new Error("Missing MessageMedia credentials");
  }

  const url = "https://api.messagemedia.com/v1/messages";

  try {
    const response = await axios.post(
      url,
      {
        messages: [
          {
            content: text,
            destination_number: to
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: apiKey,
          password: apiSecret
        }
      }
    );

    console.log("✅ MessageMedia SUCCESS:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ MessageMedia FAILED:", error.response?.data || error);
    throw error;
  }
}