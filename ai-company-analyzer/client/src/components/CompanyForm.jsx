import { useState, useRef } from 'react';
import { analyzeCompany } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ProgressIndicator from './ProgressIndicator';
import StepHeader from './StepHeader';
import {
  renderEnhancedBasicsStep,
  renderEnhancedProductsStep,
  renderOperationsStep,
  renderEnhancedFinancialsStep,
  renderMarketingStep,
  renderEnhancedGoalsStep
} from './CompanyFormSteps';

const STEPS = [
  { id: 'basics', title: 'Company Basics', icon: 'building' },
  { id: 'products', title: 'Products & Market', icon: 'cube' },
  { id: 'operations', title: 'Operations & Strategy', icon: 'cog' },
  { id: 'financials', title: 'Financials & Team', icon: 'chart' },
  { id: 'marketing', title: 'Marketing & Sales', icon: 'megaphone' },
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
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState(initialData || {
    // Company basics
    companyName: '',
    industry: '',
    stage: '',
    description: '',
    foundedYear: '',
    
    // Products & Market
    products: '',
    targetMarket: '',
    competitors: '',
    uniqueValue: '',
    marketTrends: '',
    
    // Operations & Strategy
    businessModel: '',
    keyPartners: '',
    operations: '',
    technology: '',
    
    // Financials & Team
    revenue: '',
    funding: '',
    teamSize: '',
    keyRoles: '',
    burnRate: '',
    
    // Marketing & Sales
    customerAcquisition: '',
    salesChannels: '',
    pricingStrategy: '',
    marketingBudget: '',
    
    // Goals & Challenges
    challenges: '',
    goals: '',
    timeline: '',
    successMetrics: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Basics
        if (!formData.companyName.trim()) return 'Company name is required';
        if (!formData.industry) return 'Please select an industry';
        if (!formData.stage) return 'Please select company stage';
        break;
      case 1: // Products
        if (!formData.products.trim()) return 'Please describe your products/services';
        if (!formData.targetMarket.trim()) return 'Please describe your target market';
        break;
      case 2: // Operations - optional
      case 3: // Financials - optional
      case 4: // Marketing - optional
      case 5: // Goals - optional
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
    e.stopPropagation();
    
    // Ensure we're on the last step before submitting
    if (currentStep !== STEPS.length - 1) {
      // If not on last step, just go to next step instead
      handleNext();
      return;
    }
    
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Get the latest form data directly from form inputs to ensure we capture
    // challenges and goals even if React state hasn't updated yet
    const formElement = formRef.current;
    const finalFormData = { ...formData };
    
    if (formElement) {
      // Use FormData API to get the absolute latest values from all form inputs
      const formDataObj = new FormData(formElement);
      
      // Update finalFormData with values from form inputs
      for (const [key, value] of formDataObj.entries()) {
        if (finalFormData.hasOwnProperty(key)) {
          finalFormData[key] = value;
        }
      }
      
      // Specifically ensure challenges and goals are captured from named textareas
      const challengesInput = formElement.querySelector('textarea[name="challenges"]');
      const goalsInput = formElement.querySelector('textarea[name="goals"]');
      
      if (challengesInput) {
        finalFormData.challenges = challengesInput.value;
      }
      if (goalsInput) {
        finalFormData.goals = goalsInput.value;
      }
    }
    
    setIsLoading(true);
    setError(null);

    try {
      onSubmit(finalFormData);
      const results = await analyzeCompany(finalFormData);
      onAnalysisComplete(results);
    } catch (err) {
      setError(err.message || 'Failed to analyze company. Please try again.');
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 overflow-x-auto pb-2">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center flex-shrink-0">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all transform hover:scale-110
              ${index < currentStep ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' : 
                index === currentStep ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white ring-4 ring-primary-200 shadow-xl scale-110' : 
                'bg-gray-200 text-gray-400'}`}
          >
            {index < currentStep ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </div>
          {index < STEPS.length - 1 && (
            <div className={`w-12 h-1 mx-1 rounded transition-all ${index < currentStep ? 'bg-gradient-to-r from-green-500 to-primary-500' : 'bg-gray-200'}`} />
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
          name="challenges"
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
          name="goals"
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
      case 0: return renderEnhancedBasicsStep(formData, updateField);
      case 1: return renderEnhancedProductsStep(formData, updateField);
      case 2: return renderOperationsStep(formData, updateField);
      case 3: return renderEnhancedFinancialsStep(formData, updateField);
      case 4: return renderMarketingStep(formData, updateField);
      case 5: return renderEnhancedGoalsStep(formData, updateField);
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 rounded-full mb-4">
          <svg className="w-5 h-5 text-primary-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.7.303l3 3a1 1 0 01-1.414 1.414l-1.483-1.483A9.481 9.481 0 003.348 2.74a1 1 0 00-.833.833 9.481 9.481 0 001.981 8.764l-1.483 1.483a1 1 0 101.414 1.414l3-3a1 1 0 010-1.414l-3-3a1 1 0 00-1.414 1.414l1.483 1.483a7.481 7.481 0 01-1.981-6.91 7.481 7.481 0 016.91-1.981l1.483-1.483a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-primary-700">AI-Powered Analysis</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Unlock Your Business Potential
        </h2>
        <p className="text-lg text-gray-600">
          Get personalized insights, strategic recommendations, and a complete growth roadmap
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Instant Results</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Expert Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Action Plans</span>
          </div>
        </div>
      </div>

      <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} />

      <div className="card transform transition-all hover:shadow-xl">
        <StepHeader 
          stepId={STEPS[currentStep].id}
          title={STEPS[currentStep].title}
          currentStep={currentStep}
          totalSteps={STEPS.length}
        />

        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevent form submission on Enter key in textareas unless Ctrl/Cmd+Enter
            if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA') {
              if (!(e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                // Allow normal textarea behavior (new line) but prevent form submission
                return;
              }
            }
            // Prevent form submission on Enter key unless we're on the last step and submit button is focused
            if (e.key === 'Enter' && currentStep < STEPS.length - 1 && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              handleNext();
            }
          }}
        >
          {renderCurrentStep()}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-start gap-2 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
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
                className="btn-primary flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 min-w-[200px] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    <span>Generating Your Analysis...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold">Get My Analysis Now!</span>
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
