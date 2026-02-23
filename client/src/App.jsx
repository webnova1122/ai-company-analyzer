import { useState } from 'react';
import CompanyForm from './components/CompanyForm';
import AnalysisResults from './components/AnalysisResults';
import BusinessPlanViewer from './components/BusinessPlanViewer';
import Header from './components/Header';

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'analysis', 'plan'
  const [companyData, setCompanyData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);

  const handleFormSubmit = (data) => {
    setCompanyData(data);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentView('analysis');
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
  };

  const handleBackToAnalysis = () => {
    setCurrentView('analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onStartOver={handleStartOver} showStartOver={currentView !== 'form'} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'form' && (
          <CompanyForm 
            onSubmit={handleFormSubmit}
            onAnalysisComplete={handleAnalysisComplete}
            initialData={companyData}
          />
        )}
        
        {currentView === 'analysis' && analysisResults && (
          <AnalysisResults 
            results={analysisResults}
            companyData={companyData}
            onGeneratePlan={handlePlanGenerated}
            onStartOver={handleStartOver}
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
  );
}

export default App;
