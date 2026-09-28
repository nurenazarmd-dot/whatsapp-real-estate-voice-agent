const fs = require('fs');
const path = require('path');

const leadsPath = path.join(__dirname, '..', 'data', 'leads.json');

function ensureFile() {
  const dir = path.dirname(leadsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(leadsPath)) {
    fs.writeFileSync(leadsPath, JSON.stringify([], null, 2));
  }
}

function readLeads() {
  ensureFile();
  const data = fs.readFileSync(leadsPath, 'utf8');
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeLeads(leads) {
  ensureFile();
  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
}

function addLead(lead) {
  const leads = readLeads();
  const newLead = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    status: lead.status || 'new',
    ...lead
  };
  leads.unshift(newLead);
  writeLeads(leads);
  return newLead;
}

module.exports = {
  readLeads,
  writeLeads,
  addLead
};
