const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function analyzeCompany(companyData) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });

  return handleResponse(response);
}

export async function generateBusinessPlan(companyData) {
  const response = await fetch(`${API_BASE}/business-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });

  return handleResponse(response);
}

export async function getBusinessPlan(planId) {
  const response = await fetch(`${API_BASE}/business-plan/${planId}`);
  return handleResponse(response);
}

export function getBusinessPlanPDFUrl(planId) {
  return `${API_BASE}/business-plan/${planId}/pdf`;
}

export async function processPayment(paymentData) {
  const response = await fetch(`${API_BASE}/payment/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  return handleResponse(response);
}

export async function getAnalysisWithPayment(transactionId, companyData) {
  const response = await fetch(`${API_BASE}/analysis/paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transactionId, companyData }),
  });

  return handleResponse(response);
}

export async function sendDiscountEmail(email, discountCode) {
  const response = await fetch(`${API_BASE}/email/discount`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, discountCode }),
  });

  return handleResponse(response);
}

export async function downloadBusinessPlanPDF(planId, companyName) {
  const response = await fetch(`${API_BASE}/business-plan/${planId}/pdf`);

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
