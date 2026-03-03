import LoadingSpinner from './LoadingSpinner';

function getScoreColor(score) {
  if (score >= 8) return 'text-green-600';
  if (score >= 5) return 'text-yellow-600';
  return 'text-red-600';
}

function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function AnalysisColumn({ analysis, companyData, label, isColumnB }) {
  const displayName = analysis?.companyName || companyData?.companyName || label;
  const industry = analysis?.industry || companyData?.industry || '';
  const stage = companyData?.stage || '';

  const borderClass = isColumnB ? 'border-2 border-indigo-200' : 'border-2 border-primary-200';
  const badgeClass = isColumnB ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700';

  return (
    <div className={`flex-1 min-w-0 rounded-xl ${borderClass} bg-white p-6 shadow-sm`}>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClass} mb-2`}>
          {label}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
        <p className="text-sm text-gray-600">{industry}{stage ? ` | ${stage}` : ''}</p>
      </div>

      {/* Growth Score */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-600 mb-1">Growth Potential Score</p>
        <p className={`text-4xl font-bold ${getScoreColor(analysis?.growthScore)}`}>
          {analysis?.growthScore ?? '—'}<span className="text-lg text-gray-400">/10</span>
        </p>
        {analysis?.summary && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{analysis.summary}</p>
        )}
      </div>

      {/* SWOT */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border-l-4 border-green-500 pl-3">
          <h4 className="font-semibold text-green-700 text-sm mb-2">Strengths</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(analysis?.strengths || []).slice(0, 4).map((item, i) => (
              <li key={i} className="flex gap-1"><span className="text-green-500">+</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="border-l-4 border-red-500 pl-3">
          <h4 className="font-semibold text-red-700 text-sm mb-2">Weaknesses</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(analysis?.weaknesses || []).slice(0, 4).map((item, i) => (
              <li key={i} className="flex gap-1"><span className="text-red-500">−</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="border-l-4 border-blue-500 pl-3">
          <h4 className="font-semibold text-blue-700 text-sm mb-2">Opportunities</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(analysis?.opportunities || []).slice(0, 4).map((item, i) => (
              <li key={i} className="flex gap-1"><span className="text-blue-500">→</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="border-l-4 border-yellow-500 pl-3">
          <h4 className="font-semibold text-yellow-700 text-sm mb-2">Threats</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(analysis?.threats || []).slice(0, 4).map((item, i) => (
              <li key={i} className="flex gap-1"><span className="text-yellow-500">!</span>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market & Competitive */}
      {analysis?.marketAnalysis && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">Market Analysis</h4>
          <p className="text-sm text-gray-700 line-clamp-4">{analysis.marketAnalysis}</p>
        </div>
      )}
      {analysis?.competitivePosition && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">Competitive Position</h4>
          <p className="text-sm text-gray-700 line-clamp-4">{analysis.competitivePosition}</p>
        </div>
      )}

      {/* Risks */}
      {analysis?.riskAssessment?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 text-sm mb-2">Top Risks</h4>
          <div className="space-y-2">
            {analysis.riskAssessment.slice(0, 3).map((risk, i) => (
              <div key={i} className="bg-gray-50 rounded p-2 text-xs">
                <span className="font-medium text-gray-900">{risk.risk}</span>
                <span className={`ml-2 px-1.5 py-0.5 rounded ${getSeverityColor(risk.severity)}`}>
                  {risk.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis?.recommendations?.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Recommendations</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {analysis.recommendations.slice(0, 4).map((rec, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary-600 font-medium">{i + 1}.</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ComparisonView({ analysisA, analysisB, companyDataA, companyDataB, error, onStartOver }) {
  const isLoading = !error && (!analysisA || !analysisB);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Comparison failed</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Check that the server is running and your OpenAI API key is set in the server&apos;s .env file.</p>
          <button onClick={onStartOver} className="btn-primary">
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center py-16">
          <LoadingSpinner size="lg" text="Comparing both companies..." />
          <p className="text-gray-500 mt-4">Running two analyses in parallel. This can take 1–2 minutes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Side-by-side comparison
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Company comparison</h2>
        <p className="text-gray-600">
          {companyDataA?.companyName || analysisA.companyName} vs {companyDataB?.companyName || analysisB.companyName}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <AnalysisColumn
          analysis={analysisA}
          companyData={companyDataA}
          label="Company A"
          isColumnB={false}
        />
        <AnalysisColumn
          analysis={analysisB}
          companyData={companyDataB}
          label="Company B"
          isColumnB
        />
      </div>

      <div className="flex justify-center">
        <button onClick={onStartOver} className="btn-secondary">
          Analyze another company
        </button>
      </div>
    </div>
  );
}
