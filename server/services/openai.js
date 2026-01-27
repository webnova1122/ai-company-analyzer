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
      model: 'gpt-4o',
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
    
    // Provide user-friendly error messages for common issues
    if (error.status === 429) {
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing and add credits to your OpenAI account at https://platform.openai.com/account/billing');
      } else {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a few moments.');
      }
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
    } else if (error.code === 'model_not_found') {
      throw new Error(`OpenAI model not found or not accessible. Please check your API key has access to the requested model.`);
    }
    
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
  "marketAnalysis": "detailed market analysis as plain text only - NO JSON, NO code blocks, just readable text",
  "competitivePosition": "competitive positioning analysis as plain text only - NO JSON, NO code blocks, just readable text",
  "riskAssessment": [{"risk": "risk description", "severity": "high/medium/low", "mitigation": "suggested mitigation"}],
  "growthScore": 1-10,
  "recommendations": ["recommendation1", "recommendation2", ...]
}

CRITICAL REQUIREMENTS:
- Respond ONLY with valid JSON
- Do NOT wrap the response in markdown code blocks (no triple backticks with json or plain triple backticks)
- The "marketAnalysis" field must be plain text only - readable sentences, NO JSON objects, NO code blocks
- The "competitivePosition" field must be plain text only - readable sentences, NO JSON objects, NO code blocks
- Return pure JSON only, no additional text before or after`;

  const response = await generateCompletion(prompt, { temperature: 0.5 });
  
  // Clean response: remove markdown code blocks if present
  let cleanedResponse = response.trim();
  
  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  
  // Try to extract JSON if it's embedded in text
  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedResponse = jsonMatch[0];
  }
  
  try {
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate that we got the expected structure
    if (typeof parsed === 'object' && parsed !== null) {
      // Ensure marketAnalysis is clean plain text only
      if (parsed.marketAnalysis) {
        if (typeof parsed.marketAnalysis === 'object') {
          // If it's an object, convert to readable text
          parsed.marketAnalysis = 'Market analysis is available. Please see other sections for detailed insights.';
        } else if (typeof parsed.marketAnalysis === 'string') {
          let text = parsed.marketAnalysis.trim();
          // Remove any JSON-like structures
          text = text.replace(/\{[^}]*\}/g, '').trim();
          // Remove markdown code blocks if present
          text = text.replace(/```[^`]*```/g, '').trim();
          // Remove any remaining JSON structure indicators
          text = text.replace(/^\{[\s\S]*\}$/m, '').trim();
          // If text is empty or looks like JSON, use default
          if (!text || text.startsWith('{') || text.length < 10) {
            parsed.marketAnalysis = 'Market analysis is available. Please see other sections for detailed insights.';
          } else {
            parsed.marketAnalysis = text;
          }
        }
      }
      
      // Ensure competitivePosition is clean plain text only
      if (parsed.competitivePosition) {
        if (typeof parsed.competitivePosition === 'object') {
          // If it's an object, convert to readable text
          parsed.competitivePosition = 'Competitive position analysis is available. Please see other sections for detailed insights.';
        } else if (typeof parsed.competitivePosition === 'string') {
          let text = parsed.competitivePosition.trim();
          // Remove any JSON-like structures
          text = text.replace(/\{[^}]*\}/g, '').trim();
          // Remove markdown code blocks if present
          text = text.replace(/```[^`]*```/g, '').trim();
          // Remove any remaining JSON structure indicators
          text = text.replace(/^\{[\s\S]*\}$/m, '').trim();
          // If text is empty or looks like JSON, use default
          if (!text || text.startsWith('{') || text.length < 10) {
            parsed.competitivePosition = 'Competitive position analysis is available. Please see other sections for detailed insights.';
          } else {
            parsed.competitivePosition = text;
          }
        }
      }
      
      return parsed;
    }
    throw new Error('Invalid response structure');
  } catch (parseError) {
    // If JSON parsing fails, log the error and return a structured error response
    console.error('Failed to parse OpenAI response as JSON:', parseError.message);
    console.error('Response preview:', cleanedResponse.substring(0, 500));
    return {
      strengths: ['Analysis in progress'],
      weaknesses: ['Unable to parse structured data'],
      opportunities: ['Please try again'],
      threats: ['Data parsing error'],
      marketAnalysis: 'Unable to parse market analysis. Please try regenerating the analysis.',
      competitivePosition: 'Unable to parse competitive position. Please try regenerating the analysis.',
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

IMPORTANT: Respond ONLY with valid JSON. Do NOT wrap the response in markdown code blocks (no triple backticks with json or plain triple backticks). Return pure JSON only, no additional text before or after.`;

  const response = await generateCompletion(prompt, { maxTokens: 4000, temperature: 0.6 });
  
  // Clean response: remove markdown code blocks if present
  let cleanedResponse = response.trim();
  
  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  
  // Try to extract JSON if it's embedded in text
  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedResponse = jsonMatch[0];
  }
  
  try {
    return JSON.parse(cleanedResponse);
  } catch (parseError) {
    console.error('Failed to parse business plan response as JSON:', parseError.message);
    console.error('Response preview:', cleanedResponse.substring(0, 500));
    throw new Error('Failed to generate structured business plan');
  }
}
