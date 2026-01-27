import { generateStructuredAnalysis, generateBusinessPlanContent } from './openai.js';

export async function analyzeCompany(companyData) {
  // Validate required fields
  if (!companyData.companyName || !companyData.industry) {
    throw new Error('Company name and industry are required');
  }

  // Generate AI-powered analysis
  const analysis = await generateStructuredAnalysis(companyData);
  
  // Add metadata
  return {
    companyName: companyData.companyName,
    industry: companyData.industry,
    analyzedAt: new Date().toISOString(),
    ...analysis,
    summary: generateSummary(analysis)
  };
}

export async function generateBusinessPlan(companyData) {
  // Validate required fields
  if (!companyData.companyName || !companyData.industry) {
    throw new Error('Company name and industry are required');
  }

  // Generate comprehensive business plan
  const businessPlan = await generateBusinessPlanContent(companyData);
  
  // Add metadata and structure
  return {
    companyName: companyData.companyName,
    industry: companyData.industry,
    generatedAt: new Date().toISOString(),
    sections: businessPlan,
    tableOfContents: generateTableOfContents()
  };
}

function generateSummary(analysis) {
  const strengthCount = analysis.strengths?.length || 0;
  const weaknessCount = analysis.weaknesses?.length || 0;
  const opportunityCount = analysis.opportunities?.length || 0;
  const threatCount = analysis.threats?.length || 0;
  
  let summaryText = `Analysis identified ${strengthCount} key strengths and ${weaknessCount} areas for improvement. `;
  summaryText += `Found ${opportunityCount} market opportunities and ${threatCount} potential threats. `;
  summaryText += `Overall growth potential score: ${analysis.growthScore || 'N/A'}/10.`;
  
  return summaryText;
}

function generateTableOfContents() {
  return [
    { section: 'Executive Summary', page: 1 },
    { section: 'Company Description', page: 2 },
    { section: 'Market Analysis', page: 3 },
    { section: 'Organization & Management', page: 5 },
    { section: 'Products & Services', page: 6 },
    { section: 'Marketing Strategy', page: 7 },
    { section: 'Financial Projections', page: 9 },
    { section: 'Funding Requirements', page: 11 },
    { section: 'Action Plan & Milestones', page: 12 },
    { section: 'Risk Assessment', page: 13 }
  ];
}
