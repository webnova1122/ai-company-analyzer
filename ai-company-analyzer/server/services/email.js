// Email service for sending discount codes and receipts
// In production, integrate with SendGrid, AWS SES, or similar service

export async function sendDiscountEmail(email, discountCode) {
  // In production, use actual email service
  console.log(`📧 Sending discount email to ${email}`);
  console.log(`Discount Code: ${discountCode}`);
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✓ Discount email sent to ${email}`);
      resolve({ success: true });
    }, 500);
  });
}

export async function sendReceiptEmail(email, transaction) {
  // In production, use actual email service
  console.log(`📧 Sending receipt email to ${email}`);
  console.log(`Transaction ID: ${transaction.transactionId}`);
  console.log(`Amount: $${transaction.amount}`);
  console.log(`Plan: ${transaction.plan}`);
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✓ Receipt email sent to ${email}`);
      resolve({ success: true });
    }, 500);
  });
}

export async function sendAnalysisEmail(email, companyName, analysisUrl) {
  // In production, use actual email service
  console.log(`📧 Sending analysis email to ${email}`);
  console.log(`Company: ${companyName}`);
  console.log(`Analysis URL: ${analysisUrl}`);
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✓ Analysis email sent to ${email}`);
      resolve({ success: true });
    }, 500);
  });
}
