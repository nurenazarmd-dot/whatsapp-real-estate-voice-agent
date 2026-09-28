require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const vapiApiKey = process.env.VAPI_API_KEY || null;
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || null;

class VoiceAgent {
  constructor() {
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
  }

  async transcribeAudio(audioFilePath) {
    if (!openaiClient) {
      console.warn('OpenAI client not configured for transcription');
      return null;
    }

    try {
      const fs = require('fs');
      const transcription = await openaiClient.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: 'whisper-1',
        language: 'hi'
      });
      return transcription.text;
    } catch (error) {
      console.error('Transcription error:', error.message);
      return null;
    }
  }

  async generateSpeech(text) {
    if (!elevenLabsApiKey) {
      console.warn('ElevenLabs API key not configured');
      return null;
    }

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'xi-api-key': elevenLabsApiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error) {
      console.error('ElevenLabs TTS error:', error.message);
      return null;
    }
  }

  async initiateVapiCall(phoneNumber, propertyData) {
    if (!vapiApiKey) {
      console.warn('Vapi API key not configured');
      return null;
    }

    try {
      const propertyContext = propertyData
        ? `Property options for customer: ${propertyData.map((p) => `${p.title} at ${p.priceLabel}`).join(', ')}`
        : 'No specific properties found. Ask customer for preferences.';

      const response = await axios.post(
        'https://api.vapi.ai/call',
        {
          phoneNumber: phoneNumber,
          assistantId: process.env.VAPI_ASSISTANT_ID,
          assistantOverrides: {
            system: `You are a real estate voice assistant. Help customers find properties. Context: ${propertyContext}. Always respond in Hindi/Hinglish.`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${vapiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Vapi call initiation error:', error.message);
      return null;
    }
  }

  isConfigured() {
    return {
      vapi: !!vapiApiKey,
      elevenlabs: !!elevenLabsApiKey,
      openai: !!openaiClient
    };
  }
}

module.exports = VoiceAgent;
