require('dotenv').config();
const express = require('express');
const multer = require('multer');
const twilio = require('twilio');
const {
  findMatchingProperties,
  generateAgentReply,
  extractRequestDetails,
  getAiEnhancedReply
} = require('./src/realEstateAgent');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'WhatsApp Real Estate Voice Agent Demo',
    status: 'running',
    readyForTwilio: !!twilioClient,
    openAiConfigured: !!process.env.OPENAI_API_KEY
  });
});

app.get('/demo/config', (req, res) => {
  res.json({
    twilioConfigured: !!twilioClient,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || null,
    openAiConfigured: !!process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  });
});

app.get('/demo/properties', (req, res) => {
  const props = require('./src/data/properties');
  res.json({ count: props.length, properties: props });
});

app.post('/demo/message', async (req, res) => {
  const rawMessage = req.body.message || req.body.text || '';
  const parsed = extractRequestDetails(rawMessage);
  const properties = findMatchingProperties(parsed);
  const reply = await getAiEnhancedReply(parsed, properties, rawMessage);

  res.json({
    ok: true,
    input: rawMessage,
    parsed,
    propertyCount: properties.length,
    reply
  });
});

app.post('/demo/voice', upload.single('audio'), async (req, res) => {
  const { message } = req.body;
  const rawMessage = message || 'Voice note received. Please share city, budget and BHK preference.';
  const parsed = extractRequestDetails(rawMessage);
  const properties = findMatchingProperties(parsed);
  const reply = await getAiEnhancedReply(parsed, properties, rawMessage);

  res.json({
    ok: true,
    note: 'Voice note received successfully',
    parsed,
    propertyCount: properties.length,
    reply,
    fileReceived: !!req.file
  });
});

app.post('/webhook/whatsapp', async (req, res) => {
  const text = req.body.Body || req.body.message || req.body.text || '';
  const parsed = extractRequestDetails(text);
  const properties = findMatchingProperties(parsed);
  const reply = await getAiEnhancedReply(parsed, properties, text);

  if (req.body.From) {
    if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
      const toNumber = req.body.From.startsWith('whatsapp:') ? req.body.From : `whatsapp:${req.body.From}`;
      const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
        ? process.env.TWILIO_WHATSAPP_NUMBER
        : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

      try {
        await twilioClient.messages.create({
          from: fromNumber,
          to: toNumber,
          body: reply.substring(0, 1500)
        });
      } catch (error) {
        console.error('Twilio send failed:', error.message);
      }
    }

    return res.status(200).send('<Response></Response>');
  }

  res.json({ ok: true, reply, parsed, propertyCount: properties.length });
});

app.post('/webhook/voice', upload.single('audio'), async (req, res) => {
  const text = req.body.text || req.body.message || 'Voice note received. Kindly provide city, budget and room requirement.';
  const parsed = extractRequestDetails(text);
  const properties = findMatchingProperties(parsed);
  const reply = await getAiEnhancedReply(parsed, properties, text);

  res.json({ ok: true, reply, parsed, propertyCount: properties.length });
});

app.listen(PORT, () => {
  console.log(`Real estate WhatsApp voice demo running on http://localhost:${PORT}`);
});
