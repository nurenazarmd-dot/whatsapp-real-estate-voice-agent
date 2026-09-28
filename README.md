# WhatsApp Real Estate Voice Agent Demo

Full-featured demo for a real estate WhatsApp voice agent with Vapi voice calls and ElevenLabs text-to-speech.

## Features

✅ WhatsApp Integration
- Twilio WhatsApp Sandbox support
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

### 2.3 Fill in environment variables

```env
PORT=3000

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

VAPI_API_KEY=
VAPI_ASSISTANT_ID=

ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### 2.4 Install dependencies

```bash
npm install
```

### 2.5 Create environment file

```bash
cp .env.example .env
```

### 2.6 Add API keys in .env

```env
PORT=3000
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
VAPI_API_KEY=
VAPI_ASSISTANT_ID=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### 2.7 Start the application

```bash
npm start
```

### 2.8 Open dashboard in browser

```text
http://localhost:3000/
```

### 2.9 Test the property API

```bash
curl -X POST http://localhost:3000/demo/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Mujhe Gurgaon mein 2 BHK chahiye budget 60 lakh"}'
```

### 2.10 Lead capture test

1. Open the dashboard in browser.
2. Fill the lead form.
3. Click the Save Lead button.
4. Confirm the lead appears in the lead pipeline table.

### 3. Run the app

```bash
npm start
```

### 4. Health check

```bash
curl http://localhost:3000/health
```

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Demo Message (Text)
```bash
curl -X POST http://localhost:3000/demo/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Need 2 BHK in Gurgaon under 60 lakh"}'
```

### Demo Voice (Audio File)
```bash
curl -X POST http://localhost:3000/demo/voice \
  -F "audio=@audio.mp3" \
  -F "phoneNumber=+1234567890"
```

### Voice Message with Vapi Call
```bash
curl -X POST http://localhost:3000/demo/voice-text \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Mujhe Noida mein 3 BHK chahiye budget 80 lakh",
    "phoneNumber": "+1234567890"
  }'
```

### Text-to-Speech Demo
```bash
curl "http://localhost:3000/demo/tts?text=Mujhe+Gurgaon+mein+2+BHK+chahiye" > output.mp3
```

### WhatsApp Webhook
```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+1234567890",
    "Body": "Mujhe 2 BHK in Gurgaon chahiye"
  }'
```

### Voice Note Webhook (Twilio)
```bash
curl -X POST http://localhost:3000/webhook/voice-note \
  -F "media=@voice.ogg" \
  -F "From=whatsapp:+1234567890"
```

### Vapi Webhook
```bash
curl -X POST http://localhost:3000/webhook/vapi \
  -H "Content-Type: application/json" \
  -d '{"type":"call.started"}'
```

## User Flow

### Text Message Flow
1. User sends: "Mujhe 2 BHK in Gurgaon chahiye budget 60 lakh"
2. App parses: city=Gurgaon, bhk=2, budget=60 lakh
3. App finds 1-2 matching properties
4. App replies with Hinglish property recommendations

### Voice Call Flow (with Vapi)
1. User calls the Vapi number
2. Vapi AI answers in Hindi
3. User speaks their requirement
4. Vapi transcribes via OpenAI Whisper
5. App processes request
6. Vapi reads property recommendations via ElevenLabs TTS

### Voice Note Flow
1. User sends WhatsApp voice note
2. Twilio webhooks the audio file
3. OpenAI Whisper transcribes
4. App processes request
5. WhatsApp sends back text reply
6. Optional: TTS reads it back

## Production Deployment

### Using ngrok for local testing

```bash
ngrok http 3000
```

Update Twilio webhook to:

```text
https://your-ngrok-url/webhook/whatsapp
https://your-ngrok-url/webhook/voice-note
```

Update Vapi webhook to:

```text
https://your-ngrok-url/webhook/vapi
```

## Troubleshooting

### No audio transcription?
- Confirm OpenAI API key is configured.
- Check file format is valid (MP3, WAV, OGG supported).

### Vapi calls not working?
- Verify VAPI_API_KEY and VAPI_ASSISTANT_ID.
- Check your webhook URL is public.

### TTS not generating?
- Confirm ELEVENLABS_API_KEY is valid.
- Check the text length is not too large.

## File Structure

```text
.
├── server.js
├── package.json
├── .env.example
├── README.md
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── realEstateAgent.js
│   ├── voiceAgent.js
│   ├── leadsStore.js
│   └── data/
│       └── properties.js
├── data/
│   └── leads.json
└── uploads/
```

## License

MIT
