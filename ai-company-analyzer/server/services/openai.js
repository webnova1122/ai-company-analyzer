import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY is not set in environment variables');
}

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
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
  }
  
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

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Provide more helpful error messages
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env file.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('OpenAI API server error. Please try again later.');
    }
    
    throw new Error(`OpenAI API error: ${error.message || 'Unknown error occurred'}`);
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

export async function generateStrategicPlanContent(companyData, planLevel) {
  const timeHorizon = planLevel === 'enterprise' ? '3-year' : '1-year';
  
  const prompt = `Create a comprehensive ${timeHorizon} strategic plan for the following company:

Company Name: ${companyData.companyName}
Industry: ${companyData.industry}
Stage: ${companyData.stage || 'Growth'}
Current Revenue: ${companyData.revenue || 'Not specified'}
Team Size: ${companyData.teamSize || 'Not specified'}
Goals: ${companyData.goals || 'Growth and profitability'}
Challenges: ${companyData.challenges || 'Not specified'}
Market: ${companyData.targetMarket || 'Not specified'}
Products: ${companyData.products || 'Not specified'}

Generate a detailed strategic plan in JSON format:
{
  "executiveSummary": "strategic overview",
  "visionMission": {
    "vision": "long-term vision statement",
    "mission": "mission statement",
    "coreValues": ["value1", "value2", "value3"]
  },
  "strategicObjectives": [
    {
      "objective": "objective name",
      "description": "detailed description",
      "timeframe": "Q1 2024 - Q4 2024",
      "keyResults": ["KR1", "KR2"],
      "priority": "high/medium/low"
    }
  ],
  "growthStrategy": {
    "marketExpansion": "expansion strategy",
    "productDevelopment": "product roadmap",
    "partnerships": "strategic partnerships"
  },
  "competitiveStrategy": {
    "positioning": "market positioning",
    "differentiators": ["differentiator1", "differentiator2"],
    "competitiveAdvantages": "key advantages"
  },
  "operationalStrategy": {
    "scalability": "scalability plan",
    "efficiency": "operational efficiency improvements",
    "technology": "technology investments"
  },
  "financialStrategy": {
    "revenueTargets": "revenue goals and milestones",
    "profitabilityPath": "path to profitability",
    "fundingStrategy": "funding approach"
  },
  "milestones": [
    {
      "milestone": "milestone name",
      "quarter": "Q1 2024",
      "metrics": "success metrics",
      "owner": "responsible party"
    }
  ],
  "risksAndMitigation": [
    {
      "risk": "risk description",
      "impact": "high/medium/low",
      "mitigation": "mitigation strategy"
    }
  ]
}

Make it specific, actionable, and tailored to this company. Respond ONLY with valid JSON.`;

  const response = await generateCompletion(prompt, { maxTokens: 4000, temperature: 0.6 });
  
  try {
    return JSON.parse(response);
  } catch {
    console.error('Failed to parse strategic plan response as JSON');
    throw new Error('Failed to generate structured strategic plan');
  }
}
