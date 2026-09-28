* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg, #0f172a, #111827 30%, #1f2937);
  color: #e5e7eb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px 48px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
}

h1, h2 {
  margin: 0;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 26px;
}

.stat-card,
.section-block {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.stat-card {
  padding: 20px;
}

.stat-card span {
  display: block;
  color: #94a3b8;
  margin-bottom: 10px;
}

.stat-card strong {
  font-size: 2rem;
}

.section-block {
  padding: 20px;
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 18px;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.property-card {
  background: #111827;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 16px;
}

.property-card h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.property-meta {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.6;
}

.tag {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.2);
  color: #bfdbfe;
  font-size: 0.75rem;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #334155;
}

th {
  color: #a5b4fc;
}

.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-new { background: rgba(59,130,246,0.2); color: #bfdbfe; }
.status-follow-up { background: rgba(234,179,8,0.2); color: #fef3c7; }
.status-site-visit { background: rgba(16,185,129,0.2); color: #d1fae5; }
.status-closed { background: rgba(239,68,68,0.2); color: #fecaca; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

input, select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #475569;
  background: rgba(15, 23, 42, 0.7);
  color: white;
}

.form-block button {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
