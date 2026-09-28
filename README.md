# WhatsApp Real Estate Voice Agent Demo

Full-featured demo for a real estate WhatsApp voice agent with Vapi voice calls and ElevenLabs text-to-speech.

## Features

✅ **WhatsApp Integration**
- Twilio WhatsApp Sandbox support
- Text message flow
- Voice note transcription
- Real-time property matching

✅ **Voice AI Integration**
- Vapi for voice calls
- OpenAI Whisper for audio transcription
- ElevenLabs for text-to-speech
- Hindi/Hinglish support

✅ **Real Estate Logic**
- Property database (Gurgaon, Noida, Delhi, Mumbai, Bangalore)
- City, BHK, budget parsing
- Matching property recommendations
- AI-powered Hinglish replies

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure .env

```bash
cp .env.example .env
```

Fill in your API keys:

#### Twilio (WhatsApp)
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

#### Vapi (Voice AI)
```env
VAPI_API_KEY=your_vapi_key
VAPI_ASSISTANT_ID=your_assistant_id
```

#### ElevenLabs (TTS)
```env
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

#### OpenAI (AI & Transcription)
```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

### 3. Run the App

```bash
npm start
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
curl "http://localhost:3000/demo/tts?text=Mujhe+property+pasand+hai" > output.mp3
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
6. (Optional) TTS can read it back

## Production Deployment

### Using ngrok for local testing:
```bash
ngrok http 3000
```

Update Twilio webhook:
```
https://your-ngrok-url.app/webhook/whatsapp
https://your-ngrok-url.app/webhook/voice-note
```

Update Vapi webhook:
```
https://your-ngrok-url.app/webhook/vapi
```

### Deploy to production:
- Heroku: `git push heroku main`
- AWS/Vercel/Railway: Configure with .env variables
- Docker: See Dockerfile (to be added)

## Troubleshooting

**No audio transcription?**
- Ensure OpenAI API key is configured
- Check audio format (MP3, WAV, OGG supported)

**Vapi calls not working?**
- Verify VAPI_API_KEY and VAPI_ASSISTANT_ID
- Check webhook URL is publicly accessible

**TTS not generating?**
- Confirm ELEVENLABS_API_KEY is valid
- Check text length (max 3000 chars)

## File Structure

```
.
├── server.js                    # Express app & routes
├── package.json
├── .env.example
├── README.md
├── src/
│   ├── realEstateAgent.js      # Core logic
│   ├── voiceAgent.js           # Voice integration (Vapi, ElevenLabs, Whisper)
│   └── data/
│       └── properties.js       # Sample property database
└── uploads/                    # Temp audio files
```

## License

MIT
