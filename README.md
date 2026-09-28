# WhatsApp Real Estate Voice Agent Demo

This project is a simple demo for a real estate WhatsApp voice agent built in Node.js. It simulates a property discovery flow where a customer can send a WhatsApp message or voice note and receive property recommendations.

## Features

- WhatsApp-style webhook response
- Message parsing for city, budget, and BHK preference
- Demo property database for Gurgaon, Noida, Delhi, Mumbai, and Bangalore
- AI-style response generation for real estate suggestions
- Voice note simulation endpoint
- Easy local testing with Postman or curl

## Tech stack

- Node.js
- Express
- Multer
- OpenAI SDK (prepared for real voice transcription / AI integration)
- dotenv

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm start
```

4. Test the app:

```bash
curl http://localhost:3000/health
```

## Demo API examples

### Property search by message

```bash
curl -X POST http://localhost:3000/demo/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Need 2 BHK in Gurgaon under 60 lakh"}'
```

### WhatsApp webhook simulation

```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"Body":"3 BHK in Noida under 90 lakh"}'
```

### Voice note simulation

```bash
curl -X POST http://localhost:3000/demo/voice \
  -F "message=I want a 2 BHK in Gurgaon”
```

## Example user conversation

User: "Mujhe Gurgaon mein 2 BHK chahiye, budget 60 lakh"

Agent: "I found 2 matching options for Gurgaon in 2 BHK range with budget ₹60 Lakh. ... Would you like me to share more details or arrange a site visit?"

## Production upgrade ideas

- Add Twilio WhatsApp API integration
- Connect OpenAI Whisper for voice transcription
- Connect OpenAI Responses API for smart conversational flow
- Save leads to a database
- Generate property cards with images and CTA buttons
- Add CRM integration for scheduling site visits

## File structure

```text
.
├── server.js
├── package.json
├── .env.example
├── src/
│   ├── data/
│   │   └── properties.js
│   └── realEstateAgent.js
└── README.md
```
