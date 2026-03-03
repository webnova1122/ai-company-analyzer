import { useState, useRef, useEffect } from 'react';
import CompanyForm from './components/CompanyForm';
import AnalysisResults from './components/AnalysisResults';
import BusinessPlanViewer from './components/BusinessPlanViewer';
import PaymentGateway from './components/PaymentGateway';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ComparisonView from './components/ComparisonView';
import AuthPage from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'payment', 'analysis', 'plan', 'comparison'
  const [companyData, setCompanyData] = useState(null);
  const [companyDataB, setCompanyDataB] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null); // [analysisA, analysisB]
  const [comparisonError, setComparisonError] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Refs so async handlePaymentComplete always uses latest data (avoids stale closure)
  const companyDataRef = useRef(companyData);
  const companyDataBRef = useRef(companyDataB);
  companyDataRef.current = companyData;
  companyDataBRef.current = companyDataB;

  const handleFormSubmit = (data) => {
    if (compareMode && !companyData) {
      setCompanyData(data);
      return;
    }
    if (compareMode && companyData) {
      setCompanyDataB(data);
      setCurrentView('payment');
      return;
    }
    setCompanyData(data);
    setCurrentView('payment');
  };

  const handlePaymentComplete = async (payment) => {
    setPaymentInfo(payment);
    setAnalysisError(null);
    setComparisonError(null);
    const dataA = companyDataRef.current;
    const dataB = companyDataBRef.current;
    const isCompare = !!dataB;
    if (isCompare) setCurrentView('comparison');
    else setCurrentView('analysis');
    if (!dataA) {
      if (isCompare) setComparisonError('Missing company data. Please start over.');
      else setAnalysisError('Company data missing. Please start over.');
      return;
    }
    try {
      const { analyzeCompany } = await import('./services/api');
      if (isCompare) {
        const [resultsA, resultsB] = await Promise.all([
          analyzeCompany(dataA),
          analyzeCompany(dataB),
        ]);
        setComparisonResults([resultsA, resultsB]);
      } else {
        const results = await analyzeCompany(dataA);
        setAnalysisResults(results);
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
      if (isCompare) {
        setComparisonError(error?.message || 'Failed to load comparison. Please check the server and try again.');
      } else {
        setAnalysisError(error?.message || 'Failed to generate analysis. Check that the server is running and OPENAI_API_KEY is set in the server .env file.');
      }
    }
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handlePlanGenerated = (plan) => {
    setBusinessPlan(plan);
    setCurrentView('plan');
  };

  const handleStartOver = () => {
    try {
      localStorage.removeItem('ai-company-analyzer-form-data');
      localStorage.removeItem('ai-company-analyzer-current-step');
      localStorage.removeItem('ai-company-analyzer-payment-data');
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
    setCurrentView('form');
    setCompanyData(null);
    setCompanyDataB(null);
    setCompareMode(false);
    setAnalysisResults(null);
    setAnalysisError(null);
    setComparisonResults(null);
    setComparisonError(null);
    setBusinessPlan(null);
    setPaymentInfo(null);
    setDiscountCode(null);
  };

  const handleCancelPayment = () => {
    setCurrentView('form');
  };

  const handleBackToAnalysis = () => {
    setCurrentView('analysis');
  };

  return (
    <ErrorBoundary onReset={handleStartOver}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header onStartOver={handleStartOver} showStartOver={currentView !== 'form'} />
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {currentView === 'form' && (
            <CompanyForm 
              onSubmit={handleFormSubmit}
              initialData={compareMode && companyData ? null : companyData}
              companyLabel={compareMode && companyData ? 'Company B' : compareMode ? 'Company A' : null}
              compareMode={compareMode}
              onToggleCompareMode={setCompareMode}
              companyAName={compareMode && companyData ? companyData.companyName : null}
              key={compareMode && companyData ? 'company-b' : 'company-a'}
            />
          )}
          
          {currentView === 'payment' && companyData && (
            <PaymentGateway
              companyData={companyData}
              companyDataB={companyDataB}
              discountCode={discountCode}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handleCancelPayment}
            />
          )}
          
          {currentView === 'analysis' && paymentInfo && (
            <AnalysisResults
              results={analysisResults}
              companyData={companyData}
              paymentInfo={paymentInfo}
              initialError={analysisError}
              onGeneratePlan={handlePlanGenerated}
              onStartOver={handleStartOver}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
          
          {currentView === 'plan' && businessPlan && (
            <BusinessPlanViewer 
              plan={businessPlan}
              companyData={companyData}
              onBack={handleBackToAnalysis}
              onStartOver={handleStartOver}
            />
          )}

          {currentView === 'comparison' && (
            <ComparisonView
              analysisA={comparisonResults?.[0]}
              analysisB={comparisonResults?.[1]}
              companyDataA={companyData}
              companyDataB={companyDataB}
              error={comparisonError}
              onStartOver={handleStartOver}
            />
          )}
        </main>

        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>AI Company Analyzer - Your AI-Powered Business Consultant</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
export { AuthenticatedApp };
