require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { findMatchingProperties, generateAgentReply, extractRequestDetails } = require('./src/realEstateAgent');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'WhatsApp Real Estate Voice Agent Demo',
    status: 'running'
  });
});

app.get('/demo/properties', (req, res) => {
  const props = require('./src/data/properties');
  res.json({ count: props.length, properties: props });
});

app.post('/demo/message', (req, res) => {
  const rawMessage = req.body.message || req.body.text || '';
  const parsed = extractRequestDetails(rawMessage);
  const properties = findMatchingProperties(parsed);
  const reply = generateAgentReply(parsed, properties);

  res.json({
    ok: true,
    input: rawMessage,
    parsed,
    propertyCount: properties.length,
    reply
  });
});

app.post('/demo/voice', upload.single('audio'), (req, res) => {
  const { message } = req.body;
  const rawMessage = message || 'Voice note received. Please share city, budget and BHK preference.';
  const parsed = extractRequestDetails(rawMessage);
  const properties = findMatchingProperties(parsed);
  const reply = generateAgentReply(parsed, properties);

  res.json({
    ok: true,
    note: 'Voice note received successfully',
    parsed,
    propertyCount: properties.length,
    reply,
    fileReceived: !!req.file
  });
});

app.post('/webhook/whatsapp', (req, res) => {
  const text = req.body.Body || req.body.message || req.body.text || '';
  const parsed = extractRequestDetails(text);
  const properties = findMatchingProperties(parsed);
  const reply = generateAgentReply(parsed, properties);

  if (req.body.From) {
    res.set('Content-Type', 'text/xml');
    return res.send(`
      <Response>
        <Message>${reply}</Message>
      </Response>
    `);
  }

  res.json({ ok: true, reply, parsed, propertyCount: properties.length });
});

app.post('/webhook/voice', upload.single('audio'), (req, res) => {
  const text = req.body.text || req.body.message || 'Voice note received. Kindly provide city, budget and room requirement.';
  const parsed = extractRequestDetails(text);
  const properties = findMatchingProperties(parsed);
  const reply = generateAgentReply(parsed, properties);

  res.json({ ok: true, reply, parsed, propertyCount: properties.length });
});

app.listen(PORT, () => {
  console.log(`Real estate WhatsApp voice demo running on http://localhost:${PORT}`);
});
