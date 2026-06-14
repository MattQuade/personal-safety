import MessageMedia from 'messagemedia-messages-sdk';

const client = MessageMedia({
  apiKey: process.env.MESSAGEMEDIA_API_KEY!,
  apiSecret: process.env.MESSAGEMEDIA_API_SECRET!,
});

export async function sendSMS(to: string, message: string) {
  try {
    const response = await client.messages.send({
      content: message,
      destination_number: to,
      source_number: 'PersonalSafety',   // This will show as the sender
    });

    console.log('SMS sent successfully:', response);
    return true;
  } catch (error) {
    console.error('SMS failed:', error);
    return false;
  }
}

