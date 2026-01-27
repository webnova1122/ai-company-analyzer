import { useState, useEffect } from 'react';
import CompanyForm from './components/CompanyForm';
import AnalysisResults from './components/AnalysisResults';
import BusinessPlanViewer from './components/BusinessPlanViewer';
import PaymentGateway from './components/PaymentGateway';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'payment', 'analysis', 'plan'
  const [companyData, setCompanyData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const handleFormSubmit = (data) => {
    setCompanyData(data);
    // Move to payment - email will be collected there
    setCurrentView('payment');
  };

  const handlePaymentComplete = async (payment) => {
    setPaymentInfo(payment);
    setCurrentView('analysis');
    // Analysis will be triggered in the payment complete handler
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handlePlanGenerated = (plan) => {
    setBusinessPlan(plan);
    setCurrentView('plan');
  };

  const handleStartOver = () => {
    setCurrentView('form');
    setCompanyData(null);
    setAnalysisResults(null);
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
              initialData={companyData}
            />
          )}
          
          {currentView === 'payment' && companyData && (
            <PaymentGateway
              companyData={companyData}
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
        </main>

        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>AI Company Analyzer - Your AI-Powered Business Consultant</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
