import { useState } from 'react';
import { analyzeCompany } from '../services/api';

const STEPS = [
  { id: 'basics', title: 'Company Basics', icon: 'building' },
  { id: 'products', title: 'Products & Market', icon: 'cube' },
  { id: 'financials', title: 'Financials & Team', icon: 'chart' },
  { id: 'goals', title: 'Goals & Challenges', icon: 'flag' },
];

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
  'Manufacturing', 'Real Estate', 'Food & Beverage', 'Transportation',
  'Entertainment', 'Energy', 'Agriculture', 'Retail', 'Consulting', 'Other'
];

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'startup', label: 'Startup (0-2 years)' },
  { value: 'growth', label: 'Growth Stage (2-5 years)' },
  { value: 'mature', label: 'Mature (5+ years)' },
  { value: 'enterprise', label: 'Enterprise' },
];

function CompanyForm({ onSubmit, onAnalysisComplete, initialData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialData || {
    companyName: '',
    industry: '',
    stage: '',
    description: '',
    products: '',
    targetMarket: '',
    competitors: '',
    revenue: '',
    funding: '',
    teamSize: '',
    challenges: '',
    goals: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.companyName.trim()) return 'Company name is required';
        if (!formData.industry) return 'Please select an industry';
        if (!formData.stage) return 'Please select company stage';
        break;
      case 1:
        if (!formData.products.trim()) return 'Please describe your products/services';
        if (!formData.targetMarket.trim()) return 'Please describe your target market';
        break;
      default:
        return null;
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      onSubmit(formData);
      const results = await analyzeCompany(formData);
      onAnalysisComplete(results);
    } catch (err) {
      setError(err.message || 'Failed to analyze company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors
              ${index < currentStep ? 'bg-primary-600 text-white' : 
                index === currentStep ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
                'bg-gray-200 text-gray-500'}`}
          >
            {index < currentStep ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < STEPS.length - 1 && (
            <div className={`w-16 h-1 mx-2 rounded ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          className="input-field"
          placeholder="Enter your company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.industry}
          onChange={(e) => updateField('industry', e.target.value)}
          className="input-field"
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Stage <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAGES.map(stage => (
            <button
              key={stage.value}
              type="button"
              onClick={() => updateField('stage', stage.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all
                ${formData.stage === stage.value 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'}`}
            >
              <span className="font-medium">{stage.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="input-field h-24 resize-none"
          placeholder="Brief description of your company..."
        />
      </div>
    </div>
  );

  const renderProductsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Products/Services <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.products}
          onChange={(e) => updateField('products', e.target.value)}
          className="input-field h-28 resize-none"
          placeholder="Describe your main products or services..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Market <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.targetMarket}
          onChange={(e) => updateField('targetMarket', e.target.value)}
          className="input-field h-24 resize-none"
          placeholder="Who are your ideal customers? Describe demographics, behaviors, needs..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Competitors
        </label>
        <textarea
          value={formData.competitors}
          onChange={(e) => updateField('competitors', e.target.value)}
          className="input-field h-20 resize-none"
          placeholder="List your main competitors and how you differentiate..."
        />
      </div>
    </div>
  );

  const renderFinancialsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Revenue
        </label>
        <select
          value={formData.revenue}
          onChange={(e) => updateField('revenue', e.target.value)}
          className="input-field"
        >
          <option value="">Select revenue range</option>
          <option value="pre-revenue">Pre-revenue</option>
          <option value="0-100k">$0 - $100K</option>
          <option value="100k-500k">$100K - $500K</option>
          <option value="500k-1m">$500K - $1M</option>
          <option value="1m-5m">$1M - $5M</option>
          <option value="5m-10m">$5M - $10M</option>
          <option value="10m+">$10M+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Status
        </label>
        <select
          value={formData.funding}
          onChange={(e) => updateField('funding', e.target.value)}
          className="input-field"
        >
          <option value="">Select funding status</option>
          <option value="bootstrapped">Bootstrapped</option>
          <option value="friends-family">Friends & Family</option>
          <option value="angel">Angel Investment</option>
          <option value="seed">Seed Round</option>
          <option value="series-a">Series A</option>
          <option value="series-b+">Series B+</option>
          <option value="profitable">Profitable/Self-funded</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Size
        </label>
        <select
          value={formData.teamSize}
          onChange={(e) => updateField('teamSize', e.target.value)}
          className="input-field"
        >
          <option value="">Select team size</option>
          <option value="solo">Solo Founder</option>
          <option value="2-5">2-5 people</option>
          <option value="6-10">6-10 people</option>
          <option value="11-25">11-25 people</option>
          <option value="26-50">26-50 people</option>
          <option value="51-100">51-100 people</option>
          <option value="100+">100+ people</option>
        </select>
      </div>
    </div>
  );

  const renderGoalsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Challenges
        </label>
        <textarea
          value={formData.challenges}
          onChange={(e) => updateField('challenges', e.target.value)}
          className="input-field h-28 resize-none"
          placeholder="What are the main challenges your company is facing? (e.g., scaling, hiring, funding, product-market fit...)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Goals
        </label>
        <textarea
          value={formData.goals}
          onChange={(e) => updateField('goals', e.target.value)}
          className="input-field h-28 resize-none"
          placeholder="What are your short-term and long-term business goals? (e.g., revenue targets, market expansion, product launches...)"
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBasicsStep();
      case 1: return renderProductsStep();
      case 2: return renderFinancialsStep();
      case 3: return renderGoalsStep();
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Let's Analyze Your Company
        </h2>
        <p className="text-gray-600">
          Provide information about your business to receive AI-powered insights and a comprehensive business plan.
        </p>
      </div>

      {renderStepIndicator()}

      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{STEPS[currentStep].title}</h3>
          <p className="text-sm text-gray-500 mt-1">Step {currentStep + 1} of {STEPS.length}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze Company
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyForm;
