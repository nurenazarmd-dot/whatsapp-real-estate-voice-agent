const properties = require('./data/properties');
const OpenAI = require('openai');
const VoiceAgent = require('./voiceAgent');

const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const voiceAgent = new VoiceAgent();

function normalizeCity(value) {
  if (!value) return '';
  const lower = value.toLowerCase();

  if (lower.includes('gurgaon') || lower.includes('gurugram')) return 'Gurgaon';
  if (lower.includes('noida')) return 'Noida';
  if (lower.includes('delhi')) return 'Delhi';
  if (lower.includes('mumbai')) return 'Mumbai';
  if (lower.includes('bangalore') || lower.includes('bengaluru')) return 'Bangalore';
  return value.trim();
}

function extractBudget(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const budgetMatches = lower.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|lac|crore|cr|rupees|rs|rs\.)/g);
  if (!budgetMatches || budgetMatches.length === 0) return null;

  const match = budgetMatches[0];
  const numberMatch = match.match(/\d+(?:,\d+)*(?:\.\d+)?/);
  if (!numberMatch) return null;

  const value = Number(numberMatch[0].replace(/,/g, ''));
  const unit = match.toLowerCase().includes('crore') || match.toLowerCase().includes('cr') ? 'crore' : 'lakh';

  if (unit === 'crore') return value * 10000000;
  return value * 100000;
}

function extractBhk(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const result = lower.match(/(1|2|3|4)\s*\+?\s*bhk|bhk\s*(1|2|3|4)/i);
  if (!result) return null;
  const bhk = result[1] || result[2];
  return Number(bhk);
}

function extractRequestDetails(message = '') {
  const cleaned = String(message || '').trim();
  const cityMatch = (cleaned.match(/(gurgaon|gurugram|noida|delhi|mumbai|bangalore|bengaluru)/i) || [])[0] || '';

  return {
    originalMessage: cleaned,
    city: normalizeCity(cityMatch),
    budget: extractBudget(cleaned),
    bhk: extractBhk(cleaned),
    intent: cleaned.toLowerCase().includes('site') || cleaned.toLowerCase().includes('visit') ? 'site_visit' : 'property_search'
  };
}

function findMatchingProperties(criteria = {}) {
  const city = criteria.city || '';
  const bhk = criteria.bhk || null;
  const budget = criteria.budget || null;

  return properties.filter((property) => {
    const cityMatches = !city || property.city.toLowerCase() === city.toLowerCase();
    const bhkMatches = !bhk || property.bhk === bhk || property.bhk >= bhk;
    const budgetMatches = !budget || property.price <= budget;
    return cityMatches && bhkMatches && budgetMatches;
  });
}

function generateAgentReply(criteria, propertiesList) {
  const city = criteria.city || 'your preferred city';
  const bhk = criteria.bhk || 'desired';
  const budget = criteria.budget ? `₹${(criteria.budget / 100000).toFixed(0)} Lakh` : 'your budget';

  if (!propertiesList || propertiesList.length === 0) {
    return `Mujhe ${city} mein ${bhk} BHK nahi mila ${budget} ke budget mein. Kya aap budget increase kar sakte ho ya dusre city check karna chahenge?`;
  }

  const topItems = propertiesList.slice(0, 3).map((item) => {
    return `${item.title} (${item.priceLabel}) in ${item.area}`;
  }).join('. ');

  return `Mujhe ${city} mein ${bhk} BHK ke ${propertiesList.length} options mile hain aapke ${budget} budget mein. Options: ${topItems}. Kya aap inhe dekhna chahenge ya kisi specific property ke baare mein jaankari chahte ho?`;
}

async function getAiEnhancedReply(criteria, propertiesList, rawMessage = '') {
  if (!openaiClient) {
    return generateAgentReply(criteria, propertiesList);
  }

  try {
    const propertySummary = (propertiesList || []).slice(0, 3).map((item) => {
      return `${item.title} (${item.priceLabel}) in ${item.area}. Amenities: ${item.amenities.join(', ')}`;
    }).join('; ');

    const response = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful real-estate WhatsApp assistant. Reply in Hinglish only (Hindi mixed with English). Keep replies short and friendly. Suggest only the provided property options. Never invent new properties.'
        },
        {
          role: 'user',
          content: `Customer message: "${rawMessage || 'Property search'}". Match details: city=${criteria.city || 'any'}, bhk=${criteria.bhk || 'any'}, budget=${criteria.budget ? `₹${(criteria.budget / 100000).toFixed(0)} Lakh` : 'not specified'}. Available properties: ${propertySummary || 'No matching properties found'}. Provide friendly recommendation in Hinglish.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const result = response.choices?.[0]?.message?.content?.trim();
    if (result) return result;
    return generateAgentReply(criteria, propertiesList);
  } catch (error) {
    console.error('OpenAI request failed, falling back to local reply:', error.message);
    return generateAgentReply(criteria, propertiesList);
  }
}

async function processVoiceMessage(audioFilePath, phoneNumber = null) {
  let transcribedText = null;

  if (openaiClient) {
    transcribedText = await voiceAgent.transcribeAudio(audioFilePath);
  }

  if (!transcribedText) {
    return {
      ok: false,
      error: 'Audio transcription failed',
      suggestion: 'Please configure OpenAI API key for voice transcription'
    };
  }

  const parsed = extractRequestDetails(transcribedText);
  const foundProperties = findMatchingProperties(parsed);
  const reply = await getAiEnhancedReply(parsed, foundProperties, transcribedText);

  const result = {
    ok: true,
    transcribedText,
    parsed,
    propertyCount: foundProperties.length,
    properties: foundProperties.slice(0, 3),
    reply
  };

  if (phoneNumber && process.env.VAPI_API_KEY && process.env.VAPI_ASSISTANT_ID) {
    const vapiCall = await voiceAgent.initiateVapiCall(phoneNumber, foundProperties);
    if (vapiCall) {
      result.voiceCallInitiated = true;
      result.callDetails = vapiCall;
    }
  }

  return result;
}

module.exports = {
  properties,
  extractRequestDetails,
  findMatchingProperties,
  generateAgentReply,
  getAiEnhancedReply,
  processVoiceMessage,
  voiceAgent
};
