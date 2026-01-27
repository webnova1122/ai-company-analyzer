const API_BASE = '/api';

export async function analyzeCompany(companyData) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze company');
  }

  return response.json();
}

export async function generateBusinessPlan(companyData) {
  const response = await fetch(`${API_BASE}/business-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate business plan');
  }

  return response.json();
}

export async function getBusinessPlan(planId) {
  const response = await fetch(`${API_BASE}/business-plan/${planId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch business plan');
  }

  return response.json();
}

export function getBusinessPlanPDFUrl(planId) {
  return `${API_BASE}/business-plan/${planId}/pdf`;
}

export async function downloadBusinessPlanPDF(planId, companyName) {
  const response = await fetch(`${API_BASE}/business-plan/${planId}/pdf`);

  if (!response.ok) {
    throw new Error('Failed to download PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${companyName}-business-plan.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
