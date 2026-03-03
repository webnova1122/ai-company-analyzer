import { auth } from '../firebase.js';

const API_BASE = '/api';

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const data = await response.json();
      errorMessage = data.details || data.error || data.message || errorMessage;
    } catch {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function analyzeCompany(companyData) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify(companyData),
  });

  return handleResponse(response);
}

export async function generateBusinessPlan(companyData) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/business-plan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(companyData),
  });

  return handleResponse(response);
}

export async function getBusinessPlan(planId) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/business-plan/${planId}`, { headers });
  return handleResponse(response);
}

export function getBusinessPlanPDFUrl(planId) {
  return `${API_BASE}/business-plan/${planId}/pdf`;
}

export async function getMyPlans() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/my-plans`, { headers });
  return handleResponse(response);
}

export async function processPayment(paymentData) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/payment/process`, {
    method: 'POST',
    headers,
    body: JSON.stringify(paymentData),
  });

  return handleResponse(response);
}

export async function getAnalysisWithPayment(transactionId, companyData) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/analysis/paid`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ transactionId, companyData }),
  });

  return handleResponse(response);
}

export async function sendDiscountEmail(email, discountCode) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/email/discount`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, discountCode }),
  });

  return handleResponse(response);
}

export async function downloadBusinessPlanPDF(planId, companyName) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/business-plan/${planId}/pdf`, { headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to download PDF' }));
    throw new Error(error.error || error.message || 'Failed to download PDF');
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
