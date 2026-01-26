import { useState } from 'react';
import { downloadBusinessPlanPDF } from '../services/api';

function BusinessPlanViewer({ plan, companyData, onBack, onStartOver }) {
  const [activeSection, setActiveSection] = useState('executive');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const sections = plan.sections;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      await downloadBusinessPlanPDF(plan.planId, companyData.companyName);
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const sectionNav = [
    { id: 'executive', label: 'Executive Summary', icon: 'document' },
    { id: 'company', label: 'Company Description', icon: 'building' },
    { id: 'market', label: 'Market Analysis', icon: 'chart' },
    { id: 'organization', label: 'Organization', icon: 'users' },
    { id: 'products', label: 'Products & Services', icon: 'cube' },
    { id: 'marketing', label: 'Marketing Strategy', icon: 'megaphone' },
    { id: 'financials', label: 'Financial Projections', icon: 'currency' },
    { id: 'funding', label: 'Funding Requirements', icon: 'cash' },
    { id: 'action', label: 'Action Plan', icon: 'clipboard' },
    { id: 'risks', label: 'Risk Assessment', icon: 'shield' },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'executive':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sections.executiveSummary}</p>
          </div>
        );
      
      case 'company':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sections.companyDescription}</p>
          </div>
        );
      
      case 'market':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Analysis</h2>
            
            {sections.marketAnalysis && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Industry Overview</h3>
                  <p className="text-gray-700">{sections.marketAnalysis.industryOverview}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Target Market</h3>
                  <p className="text-gray-700">{sections.marketAnalysis.targetMarket}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Market Size & Growth</h3>
                  <p className="text-gray-700">{sections.marketAnalysis.marketSize}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Competitive Analysis</h3>
                  <p className="text-gray-700">{sections.marketAnalysis.competitiveAnalysis}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'organization':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization & Management</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sections.organizationStructure}</p>
          </div>
        );
      
      case 'products':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Products & Services</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sections.productsServices}</p>
          </div>
        );
      
      case 'marketing':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Strategy</h2>
            
            {sections.marketingStrategy && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Market Positioning</h3>
                  <p className="text-gray-700">{sections.marketingStrategy.positioning}</p>
                </div>
                
                {sections.marketingStrategy.channels && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Marketing Channels</h3>
                    <ul className="space-y-2">
                      {sections.marketingStrategy.channels.map((channel, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {channel}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {sections.marketingStrategy.tactics && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Tactics</h3>
                    <ul className="space-y-2">
                      {sections.marketingStrategy.tactics.map((tactic, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {tactic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'financials':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Projections</h2>
            
            {sections.financialProjections && (
              <div className="space-y-6">
                {/* Financial Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary-50">
                        <th className="text-left p-4 font-semibold text-primary-900">Year</th>
                        <th className="text-left p-4 font-semibold text-primary-900">Revenue</th>
                        <th className="text-left p-4 font-semibold text-primary-900">Expenses</th>
                        <th className="text-left p-4 font-semibold text-primary-900">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['year1', 'year2', 'year3'].map((year, index) => {
                        const data = sections.financialProjections[year] || {};
                        return (
                          <tr key={year} className="border-b border-gray-100">
                            <td className="p-4 font-medium">Year {index + 1}</td>
                            <td className="p-4 text-green-600">{data.revenue || 'N/A'}</td>
                            <td className="p-4 text-red-600">{data.expenses || 'N/A'}</td>
                            <td className="p-4 font-semibold">{data.profit || 'N/A'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Assumptions */}
                {sections.financialProjections.assumptions && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Assumptions</h3>
                    <ul className="space-y-2">
                      {sections.financialProjections.assumptions.map((assumption, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-primary-500 mt-1">•</span>
                          {assumption}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'funding':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Requirements</h2>
            
            {sections.fundingRequirements && (
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-primary-600 mb-1">Total Funding Required</p>
                  <p className="text-3xl font-bold text-primary-900">{sections.fundingRequirements.amount || 'TBD'}</p>
                </div>
                
                {sections.fundingRequirements.use && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Use of Funds</h3>
                    <ul className="space-y-2">
                      {sections.fundingRequirements.use.map((use, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {sections.fundingRequirements.timeline && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                    <p className="text-gray-700">{sections.fundingRequirements.timeline}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'action':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Action Plan & Milestones</h2>
            
            {sections.actionPlan && sections.actionPlan.length > 0 ? (
              <div className="space-y-4">
                {sections.actionPlan.map((item, index) => {
                  const priorityColors = {
                    high: 'bg-red-100 text-red-700 border-red-200',
                    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    low: 'bg-green-100 text-green-700 border-green-200',
                  };
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.milestone}</h4>
                            <p className="text-sm text-gray-500 mt-1">Timeline: {item.timeline || 'TBD'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[item.priority] || priorityColors.medium}`}>
                          {item.priority || 'medium'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Action plan to be developed.</p>
            )}
          </div>
        );
      
      case 'risks':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>
            
            {sections.risks && sections.risks.length > 0 ? (
              <div className="space-y-4">
                {sections.risks.map((risk, index) => (
                  <div key={index} className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">
                      Risk {index + 1}: {risk.risk}
                    </h4>
                    <p className="text-gray-700">
                      <span className="font-medium">Mitigation Strategy:</span> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Risk assessment to be conducted.</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Business Plan Generated
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{plan.companyName} Business Plan</h2>
        <p className="text-gray-600">Generated on {new Date(plan.generatedAt).toLocaleDateString()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-1">
              {sectionNav.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${activeSection === section.id 
                      ? 'bg-primary-100 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            
            {/* Download Button */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              
              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="card min-h-[500px]">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button onClick={onBack} className="btn-secondary">
          Back to Analysis
        </button>
        <button onClick={onStartOver} className="btn-secondary">
          Analyze Another Company
        </button>
      </div>
    </div>
  );
}

export default BusinessPlanViewer;
