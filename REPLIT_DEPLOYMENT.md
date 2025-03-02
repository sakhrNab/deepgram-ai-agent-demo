# Deploying to Replit

This guide provides step-by-step instructions for deploying the Deepgram Conversational AI Demo on Replit with Twilio webhook integration.

## Prerequisites

1. A [Replit](https://replit.com/) account
2. A [Twilio](https://www.twilio.com/) account with a phone number
3. A [Deepgram](https://deepgram.com/) API key

## Setup on Replit

1. **Create a new Repl**:
   - Go to [Replit](https://replit.com/)
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Enter the repository URL: `https://github.com/deepgram-devs/deepgram-conversational-demo`
   - Choose "Node.js" as the language
   - Click "Import from GitHub"

2. **Install dependencies**:
   - Replit will automatically install dependencies from package.json
   - Wait until the installation is complete

3. **Set up environment variables**:
   - In your Repl, click on the "Secrets" tool (lock icon) in the left sidebar
   - Add the following secrets:
     - `DEEPGRAM_API_KEY`: Your Deepgram API key
     - `JWT_SECRET`: A random string for JWT token encryption

4. **Configure the Replit to run on HTTPS**:
   - Replit automatically provides HTTPS for your app

5. **Start the application**:
   - In the Replit shell, run: `npm run build && npm start`
   - Your application should be running on your Replit URL (e.g., https://your-repl-name.your-username.repl.co)

## Setting up Twilio integration

1. **Configure your Twilio phone number**:
   - Go to your [Twilio Console](https://www.twilio.com/console)
   - Navigate to "Phone Numbers" → "Manage" → "Active Numbers"
   - Select the phone number you want to use
   - Under "Voice & Fax" → "A Call Comes In", set the webhook URL to:
     `https://your-repl-name.your-username.repl.co/api/twilio-webhook`
   - Set the HTTP method to POST
   - Save your changes

2. **Test the integration**:
   - Make sure your Replit app is running
   - Call your Twilio phone number
   - You should hear the welcome message and be able to interact with the Deepgram Conversational AI

## Troubleshooting

- **Webhook errors**: 
  - Check your Replit logs for error messages
  - Make sure your Repl is running and accessible from the internet
  - Verify that your webhook URL is correctly set in Twilio

- **Audio processing issues**:
  - Check if your Deepgram API key is valid and has the necessary permissions
  - Look for any error messages in the Replit console related to audio processing

- **Connection issues**:
  - Replit might put your app to sleep if it's inactive for a while
  - Consider using a service like UptimeRobot to keep your Repl active

## Additional Resources

- [Deepgram API Documentation](https://developers.deepgram.com)
- [Twilio API Documentation](https://www.twilio.com/docs)
- [Replit Documentation](https://docs.replit.com) 