import { useState } from 'react';
import { processPayment } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Essential',
    price: 49,
    description: 'Perfect for startups and early-stage companies',
    features: [
      'Comprehensive SWOT Analysis',
      'Market & Competitive Analysis',
      'Risk Assessment & Mitigation',
      'Growth Score & Recommendations',
      'PDF Report',
      'Instant delivery',
    ]
  },
  {
    id: 'premium',
    name: 'Professional',
    price: 149,
    originalPrice: 199,
    savings: 50,
    description: 'Most popular - Complete business planning suite',
    features: [
      'Everything in Essential',
      'Full Business Plan (PDF)',
      'Strategic Growth Plan',
      'Financial Projections (3 years)',
      'Marketing & Sales Strategy',
      'Action Plan & Milestones',
      'Priority support',
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    originalPrice: 399,
    savings: 100,
    description: 'For established companies seeking rapid growth',
    features: [
      'Everything in Professional',
      '3-Year Strategic Plan',
      'Detailed Financial Models',
      'Market Entry Strategy',
      'Competitive Intelligence',
      'Investment Readiness Report',
      '30-min strategy consultation',
      '30-day unlimited revisions',
    ]
  }
];

function PaymentGateway({ companyData, onPaymentComplete, onCancel, discountCode }) {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState(companyData.email || '');
  const [fullName, setFullName] = useState(companyData.fullName || '');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const selectedPlanData = PRICING_PLANS.find(p => p.id === selectedPlan);
  const finalPrice = selectedPlanData.price;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Validate email and name
      if (!email.trim()) {
        throw new Error('Email is required');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      if (!fullName.trim()) {
        throw new Error('Full name is required');
      }

      // Validate card details
      if (paymentMethod === 'card') {
        if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
          throw new Error('Please enter a valid card number');
        }
        if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
          throw new Error('Please enter a valid expiry date (MM/YY)');
        }
        if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
          throw new Error('Please enter a valid CVC');
        }
        if (!cardDetails.name.trim()) {
          throw new Error('Please enter cardholder name');
        }
      }

      // Process payment
      const paymentData = {
        plan: selectedPlan,
        amount: finalPrice,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null,
        companyData: {
          ...companyData,
          email: email,
          fullName: fullName
        }
      };

      const result = await processPayment(paymentData);
      
      if (result.success) {
        onPaymentComplete({
          transactionId: result.transactionId,
          plan: selectedPlan,
          amount: finalPrice
        });
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Analysis Complete - Almost There!
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Unlock Your Professional Analysis
        </h2>
        <p className="text-gray-600 mb-2">
          Your detailed company analysis is ready. Choose your package to access your results.
        </p>
        <p className="text-sm text-gray-500">
          ✓ AI-powered insights ✓ Strategic recommendations ✓ Delivered instantly
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {PRICING_PLANS.map((plan) => {
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`card cursor-pointer transition-all border-2 ${
                selectedPlan === plan.id
                  ? 'border-primary-500 ring-4 ring-primary-100'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.recommended ? 'relative' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    ⭐ Best Value
                  </span>
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  {plan.originalPrice && (
                    <div className="mb-1">
                      <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-4xl font-bold text-primary-600">${plan.price}</span>
                  </div>
                  {plan.savings && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Save ${plan.savings}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Payment Form */}
      <div className="card max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Order</h3>
        
        <form onSubmit={handlePayment}>
          {/* Contact Information */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Your analysis will be sent here</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium">Credit Card</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.14a.804.804 0 01-.793.68H7.821a.483.483 0 01-.477-.558L7.963 18.2l.79-5.003.842-5.34.002-.012.014-.077a.804.804 0 01.794-.68h2.196c2.996 0 5.017-.882 6.067-2.66a5.07 5.07 0 001.399 4.05z"/>
                    <path d="M18.332 5.35a5.023 5.023 0 00-1.377-.273h-5.442c-.214 0-.42.108-.539.292l-1.542 9.77-.05.32c.047-.3.258-.545.557-.545h1.19c2.492 0 4.437-.992 5.008-3.863.19-.96.142-1.752-.209-2.3.31.024.6.088.876.191.425.16.79.392 1.098.696a4.19 4.19 0 00.43-4.288z"/>
                  </svg>
                  <span className="font-medium">PayPal</span>
                </div>
              </button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      expiry: formatExpiry(e.target.value)
                    })}
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                    })}
                    className="input-field"
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    name: e.target.value
                  })}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{selectedPlanData.name} Plan</span>
              <span className="font-medium">${selectedPlanData.price}</span>
            </div>
            {selectedPlanData.originalPrice && (
              <div className="flex justify-between items-center mb-2 text-sm text-green-600">
                <span>Limited Time Savings:</span>
                <span>-${selectedPlanData.savings}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3 mt-3">
              <span>Total Today:</span>
              <span className="text-primary-600">${finalPrice}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              One-time payment • Instant access • Satisfaction guaranteed
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Pay ${finalPrice} Securely</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            🔒 Secure payment powered by Stripe. Your information is encrypted and secure.
          </p>
        </form>
      </div>
    </div>
  );
}

export default PaymentGateway;
