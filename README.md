const propertyGrid = document.getElementById('propertyGrid');
const leadTableBody = document.getElementById('leadTableBody');
const totalProperties = document.getElementById('totalProperties');
const totalLeads = document.getElementById('totalLeads');
const freshLeads = document.getElementById('freshLeads');
const followUpLeads = document.getElementById('followUpLeads');
const leadForm = document.getElementById('leadForm');
const refreshBtn = document.getElementById('refreshBtn');

async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();

    totalProperties.textContent = data.totalProperties || 0;
    totalLeads.textContent = data.totalLeads || 0;

    const fresh = (data.leads || []).filter((lead) => lead.status === 'new').length;
    const followUp = (data.leads || []).filter((lead) => lead.status === 'follow-up').length;

    freshLeads.textContent = fresh;
    followUpLeads.textContent = followUp;

    renderProperties(data.properties || []);
    renderLeads(data.leads || []);
  } catch (error) {
    console.error('Dashboard load failed:', error);
  }
}

function renderProperties(properties) {
  propertyGrid.innerHTML = properties.map((property) => `
    <article class="property-card">
      <h3>${property.title}</h3>
      <div class="property-meta">
        <div>${property.city} • ${property.area}</div>
        <div>BHK: ${property.bhk}</div>
        <div>Price: ${property.priceLabel}</div>
        <div>${property.amenities.join(', ')}</div>
      </div>
      <span class="tag">${property.bhk} BHK</span>
    </article>
  `).join('');
}

function renderLeads(leads) {
  if (!leads.length) {
    leadTableBody.innerHTML = '<tr><td colspan="6">No leads yet.</td></tr>';
    return;
  }

  leadTableBody.innerHTML = leads.map((lead) => `
    <tr>
      <td>${lead.customerName || 'N/A'}</td>
      <td>${lead.phone || 'N/A'}</td>
      <td>${lead.city || 'N/A'}</td>
      <td>${lead.budget || 'N/A'}</td>
      <td>${lead.bhk || 'N/A'}</td>
      <td><span class="status-pill status-${(lead.status || 'new').replace(/\s+/g, '-')}">${lead.status || 'new'}</span></td>
    </tr>
  `).join('');
}

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const payload = {
    customerName: formData.get('customerName'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    budget: formData.get('budget'),
    bhk: formData.get('bhk'),
    status: formData.get('status') || 'new'
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      leadForm.reset();
      await loadDashboard();
    }
  } catch (error) {
    console.error('Lead save failed:', error);
  }
});

refreshBtn.addEventListener('click', loadDashboard);
loadDashboard();
