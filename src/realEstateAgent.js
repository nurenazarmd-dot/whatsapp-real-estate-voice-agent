const properties = require('./data/properties');

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
  return {
    originalMessage: cleaned,
    city: normalizeCity((cleaned.match(/(gurgaon|gurugram|noida|delhi|mumbai|bangalore|bengaluru)/i) || [])[0] || ''),
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
    return `I found no exact property matching ${city}, ${bhk} BHK and budget ${budget}. I can suggest nearby options or increase the budget range. Would you like me to show affordable alternatives or schedule a site visit?`;
  }

  const topItems = propertiesList.slice(0, 3).map((item) => {
    return `${item.title} (${item.priceLabel}) in ${item.area}.`;
  }).join(' ');

  return `I found ${propertiesList.length} matching option(s) for ${city} in ${bhk} BHK range with budget ${budget}. ${topItems} Would you like me to share more details, photos, or arrange a site visit?`;
}

module.exports = {
  properties,
  extractRequestDetails,
  findMatchingProperties,
  generateAgentReply
};
