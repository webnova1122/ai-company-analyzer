import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are an expert business consultant with 20+ years of experience helping companies succeed. You have deep expertise in:
- Business strategy and planning
- Market analysis and competitive intelligence
- Financial planning and projections
- Organizational development
- Marketing and growth strategies
- Risk assessment and mitigation

Analyze the provided company data and generate comprehensive, actionable insights. Be specific, practical, and data-driven in your recommendations. Format your responses in clear, structured sections.`;

export async function generateCompletion(userPrompt, options = {}) {
  const { maxTokens = 4000, temperature = 0.7 } = options;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function generateStructuredAnalysis(companyData) {
  const prompt = `Analyze the following company and provide a structured assessment:

Company Name: ${companyData.companyName}
Industry: ${companyData.industry}
Stage: ${companyData.stage || 'Not specified'}
Products/Services: ${companyData.products || 'Not specified'}
Target Market: ${companyData.targetMarket || 'Not specified'}
Revenue: ${companyData.revenue || 'Not specified'}
Team Size: ${companyData.teamSize || 'Not specified'}
Challenges: ${companyData.challenges || 'Not specified'}
Goals: ${companyData.goals || 'Not specified'}

Provide your analysis in the following JSON format:
{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "threats": ["threat1", "threat2", ...],
  "marketAnalysis": "detailed market analysis text",
  "competitivePosition": "analysis of competitive positioning",
  "riskAssessment": [{"risk": "risk description", "severity": "high/medium/low", "mitigation": "suggested mitigation"}],
  "growthScore": 1-10,
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Respond ONLY with valid JSON, no additional text.`;

  const response = await generateCompletion(prompt, { temperature: 0.5 });
  
  try {
    return JSON.parse(response);
  } catch {
    // If JSON parsing fails, return a structured error response
    console.error('Failed to parse OpenAI response as JSON');
    return {
      strengths: ['Analysis in progress'],
      weaknesses: ['Unable to parse structured data'],
      opportunities: ['Please try again'],
      threats: ['Data parsing error'],
      marketAnalysis: response,
      competitivePosition: 'See market analysis',
      riskAssessment: [],
      growthScore: 5,
      recommendations: ['Please regenerate analysis']
    };
  }
}

export async function generateBusinessPlanContent(companyData) {
  const prompt = `Create a comprehensive business plan for the following company:

Company Name: ${companyData.companyName}
Industry: ${companyData.industry}
Stage: ${companyData.stage || 'Startup'}
Products/Services: ${companyData.products || 'Not specified'}
Target Market: ${companyData.targetMarket || 'Not specified'}
Current Revenue: ${companyData.revenue || 'Pre-revenue'}
Team Size: ${companyData.teamSize || 'Not specified'}
Current Challenges: ${companyData.challenges || 'Not specified'}
Business Goals: ${companyData.goals || 'Growth and profitability'}
Funding Status: ${companyData.funding || 'Not specified'}

Generate a complete business plan with the following sections in JSON format:
{
  "executiveSummary": "comprehensive executive summary (2-3 paragraphs)",
  "companyDescription": "detailed company description including mission, vision, and values",
  "marketAnalysis": {
    "industryOverview": "industry analysis",
    "targetMarket": "target market analysis",
    "marketSize": "estimated market size and growth",
    "competitiveAnalysis": "analysis of key competitors"
  },
  "organizationStructure": "recommended organizational structure and key roles",
  "productsServices": "detailed description of products/services and value proposition",
  "marketingStrategy": {
    "positioning": "market positioning strategy",
    "channels": ["marketing channel 1", "channel 2"],
    "tactics": ["specific tactic 1", "tactic 2"]
  },
  "financialProjections": {
    "year1": {"revenue": "projected", "expenses": "projected", "profit": "projected"},
    "year2": {"revenue": "projected", "expenses": "projected", "profit": "projected"},
    "year3": {"revenue": "projected", "expenses": "projected", "profit": "projected"},
    "assumptions": ["key assumption 1", "assumption 2"]
  },
  "fundingRequirements": {
    "amount": "funding needed",
    "use": ["use of funds 1", "use 2"],
    "timeline": "funding timeline"
  },
  "actionPlan": [
    {"milestone": "milestone description", "timeline": "timeframe", "priority": "high/medium/low"}
  ],
  "risks": [
    {"risk": "risk description", "mitigation": "mitigation strategy"}
  ]
}

Respond ONLY with valid JSON, no additional text.`;

  const response = await generateCompletion(prompt, { maxTokens: 4000, temperature: 0.6 });
  
  try {
    return JSON.parse(response);
  } catch {
    console.error('Failed to parse business plan response as JSON');
    throw new Error('Failed to generate structured business plan');
  }
}
