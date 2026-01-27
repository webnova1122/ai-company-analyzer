import { useState, useRef, useEffect } from 'react';
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

const STORAGE_KEY = 'ai-company-analyzer-form-data';
const STORAGE_STEP_KEY = 'ai-company-analyzer-current-step';

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
  // Load saved data from localStorage or use initialData
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { data: parsed, step: savedStep ? parseInt(savedStep) : 0 };
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return { data: null, step: 0 };
  };

  const { data: savedData, step: savedStep } = loadSavedData();
  const defaultFormData = {
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
  };

  const [currentStep, setCurrentStep] = useState(savedStep || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const formRef = useRef(null);
  
  // Show indicator when data is restored on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0 && savedData.companyName) {
      setIsRestored(true);
      setShowSavedIndicator(true);
      setTimeout(() => {
        setShowSavedIndicator(false);
        setIsRestored(false);
      }, 3000);
    }
  }, []);
  
  const [formData, setFormData] = useState(initialData || savedData || defaultFormData);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
      // Show brief save indicator
      setShowSavedIndicator(true);
      const timer = setTimeout(() => setShowSavedIndicator(false), 1000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData, currentStep]);

  const updateField = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Save immediately when field updates
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
      return updated;
    });
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
      // Clear saved data on successful submit
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_STEP_KEY);
      } catch (error) {
        console.error('Error clearing saved data:', error);
      }

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
      {/* Saved indicator */}
      {showSavedIndicator && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">
            {isRestored ? 'Data restored' : 'Progress saved'}
          </span>
        </div>
      )}
      
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
