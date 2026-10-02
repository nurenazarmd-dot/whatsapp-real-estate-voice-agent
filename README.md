# WhatsApp Real Estate Voice Agent Demo

Full-featured demo for a real estate WhatsApp voice agent with Vapi voice calls and ElevenLabs text-to-speech.

## Features

✅ WhatsApp Integration
- Meta WhatsApp Cloud API support
- Twilio compatibility kept for legacy testing
- Text message flow
- Voice note transcription
- Real-time property matching

✅ Voice AI Integration
- Vapi for voice calls
- OpenAI Whisper for audio transcription
- ElevenLabs for text-to-speech
- Hindi/Hinglish support

✅ Real Estate Logic
- Property database (Gurgaon, Noida, Delhi, Mumbai, Bangalore)
- City, BHK, budget parsing
- Matching property recommendations
- AI-powered Hinglish replies

✅ Dashboard
- Property board
- Lead pipeline
- Lead capture form
- Sales summary cards

## Setup

### 1. Clone the project

```bash
git clone https://github.com/nurenazarmd-dot/whatsapp-real-estate-voice-agent.git
cd whatsapp-real-estate-voice-agent
```

### 2. Install dependencies

```bash
npm install
```

### 2.1 Check if Node.js is installed

```bash
node -v
npm -v
```

### 2.2 Create environment file

```bash
cp .env.example .env
```

### 2.3 Add API keys for Meta WhatsApp and AI

```env
PORT=3000

WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
META_API_VERSION=v19.0

VAPI_API_KEY=
VAPI_ASSISTANT_ID=

ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### 2.4 Start the application

```bash
npm start
```

### 2.5 Open dashboard in browser

```text
http://localhost:3000/
```

### 2.6 Test the property API

```bash
curl -X POST http://localhost:3000/demo/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Mujhe Gurgaon mein 2 BHK chahiye budget 60 lakh"}'
```

### 2.7 Lead capture test

1. Open the dashboard in browser.
2. Fill the lead form.
3. Click the Save Lead button.
4. Confirm the lead appears in the lead pipeline table.

## Meta WhatsApp Setup

### 1. Create Meta app

Visit:
```text
https://developers.facebook.com/apps/
```

Create a new app and add the **WhatsApp** product.

### 2. Get WhatsApp Business credentials

From your Meta developer account, get:
- WhatsApp Business Account ID
- Phone Number ID
- Permanent Access Token

Add them to `.env`:

```env
WHATSAPP_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

### 3. Run ngrok for public webhook access

```bash
ngrok http 3000
```

Example public URL:
```text
https://abcd1234.ngrok-free.app
```

### 4. Configure WhatsApp webhook in Meta

Set the webhook URL to:
```text
https://abcd1234.ngrok-free.app/webhook/whatsapp
```

Use verify token from `.env`:
```text
WHATSAPP_WEBHOOK_VERIFY_TOKEN
```

### 5. Test WhatsApp live

Send a message from your WhatsApp Business number:
```text
Mujhe Gurgaon mein 2 BHK chahiye budget 60 lakh
```

Your app will reply through Meta WhatsApp API.

## Voice Note Flow

For voice notes, the same webhook can accept audio and transcribe via Whisper:

```bash
curl -X POST http://localhost:3000/demo/voice \
  -F "audio=@voice.mp3" \
  -F "phoneNumber=+1234567890"
```

## Health check

```bash
curl http://localhost:3000/health
```

## Troubleshooting

### WhatsApp message not replying?
- Confirm `WHATSAPP_TOKEN` is valid.
- Confirm `WHATSAPP_PHONE_NUMBER_ID` is correct.
- Confirm webhook is public through ngrok.
- Verify webhook subscription in Meta dashboard.

### Audio not transcribing?
- Add valid `OPENAI_API_KEY`.
- Use supported audio format like MP3/WAV/OGG.

## License

MIT
