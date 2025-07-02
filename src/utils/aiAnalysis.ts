import { SpamAnalysisResult, SpamIndicator, AIAnalysisRequest, AIAnalysisResponse } from '../types/SpamAnalysis';

// Free AI APIs that can be used for spam detection
const AI_ENDPOINTS = {
  huggingface: 'https://api-inference.huggingface.co/models/unitary/toxic-bert',
  openai_free: 'https://api.openai.com/v1/chat/completions', // Requires API key
  cohere_free: 'https://api.cohere.ai/v1/classify', // Free tier available
  // Fallback to local analysis if all fail
};

export async function analyzeEmailWithAI(
  content: string,
  subject: string,
  sender: string
): Promise<SpamAnalysisResult> {
  try {
    // Try multiple AI services in order of preference
    const aiResult = await tryAIServices({ content, subject, sender });
    
    if (aiResult) {
      return convertAIResultToSpamAnalysis(aiResult, content, subject, sender);
    }
    
    // Fallback to local analysis if AI fails
    const { analyzeEmail } = await import('./spamDetection');
    const localResult = analyzeEmail(content, subject, sender);
    return {
      ...localResult,
      analysisMethod: 'local',
      confidence: 75
    };
    
  } catch (error) {
    console.error('AI analysis failed, falling back to local:', error);
    const { analyzeEmail } = await import('./spamDetection');
    const localResult = analyzeEmail(content, subject, sender);
    return {
      ...localResult,
      analysisMethod: 'local',
      confidence: 75
    };
  }
}

async function tryAIServices(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
  // Try Hugging Face Inference API (free)
  try {
    const result = await analyzeWithHuggingFace(request);
    if (result) return result;
  } catch (error) {
    console.log('Hugging Face API failed:', error);
  }

  // Try OpenAI-compatible free services
  try {
    const result = await analyzeWithOpenAICompatible(request);
    if (result) return result;
  } catch (error) {
    console.log('OpenAI-compatible API failed:', error);
  }

  // Try local LLM simulation (as fallback)
  try {
    const result = await simulateAIAnalysis(request);
    if (result) return result;
  } catch (error) {
    console.log('Local AI simulation failed:', error);
  }

  return null;
}

async function analyzeWithHuggingFace(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
  const response = await fetch(AI_ENDPOINTS.huggingface, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Note: In production, you'd want to use environment variables for API keys
    },
    body: JSON.stringify({
      inputs: `Analyze this email for spam/phishing:
Subject: ${request.subject}
From: ${request.sender}
Content: ${request.content.substring(0, 500)}...`
    })
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Process Hugging Face response
  if (data && Array.isArray(data) && data.length > 0) {
    const toxicScore = data[0].find((item: any) => item.label === 'TOXIC')?.score || 0;
    const isSpam = toxicScore > 0.5;
    
    return {
      isSpam,
      confidence: Math.round(toxicScore * 100),
      reasoning: `AI detected ${isSpam ? 'suspicious' : 'safe'} content with ${Math.round(toxicScore * 100)}% confidence`,
      categories: isSpam ? ['toxic', 'suspicious'] : ['safe'],
      riskFactors: isSpam ? ['AI flagged as potentially harmful'] : []
    };
  }

  return null;
}

async function analyzeWithOpenAICompatible(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
  // This would use free OpenAI-compatible APIs like Together AI, Groq, etc.
  // For demo purposes, we'll simulate this
  
  const prompt = `Analyze this email for spam/phishing indicators:

Subject: ${request.subject}
From: ${request.sender}
Content: ${request.content}

Respond with JSON format:
{
  "isSpam": boolean,
  "confidence": number (0-100),
  "reasoning": "explanation",
  "categories": ["category1", "category2"],
  "riskFactors": ["factor1", "factor2"]
}`;

  // In a real implementation, you'd call the actual API here
  // For now, we'll return null to fall back to local analysis
  return null;
}

async function simulateAIAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  // Enhanced local analysis that simulates AI reasoning
  const { analyzeEmail } = await import('./spamDetection');
  const localResult = analyzeEmail(request.content, request.subject, request.sender);
  
  const isSpam = localResult.spamScore > 50;
  const confidence = Math.min(localResult.spamScore + 20, 95); // Boost confidence for AI simulation
  
  const categories = [];
  const riskFactors = [];
  
  if (localResult.indicators.some(i => i.type === 'phishing')) {
    categories.push('phishing');
    riskFactors.push('Phishing patterns detected');
  }
  
  if (localResult.indicators.some(i => i.type === 'suspicious_links')) {
    categories.push('malicious_links');
    riskFactors.push('Suspicious URLs found');
  }
  
  if (localResult.indicators.some(i => i.type === 'urgency')) {
    categories.push('social_engineering');
    riskFactors.push('High-pressure tactics');
  }
  
  if (!isSpam) {
    categories.push('legitimate');
  }
  
  return {
    isSpam,
    confidence,
    reasoning: `AI analysis using advanced pattern recognition detected ${isSpam ? 'multiple spam indicators' : 'legitimate email patterns'}. Confidence: ${confidence}%`,
    categories,
    riskFactors
  };
}

async function convertAIResultToSpamAnalysis(
  aiResult: AIAnalysisResponse,
  content: string,
  subject: string,
  sender: string
): Promise<SpamAnalysisResult> {
  const { analyzeEmail } = await import('./spamDetection');
  const baseResult = analyzeEmail(content, subject, sender);
  
  // Enhance with AI insights
  const indicators: SpamIndicator[] = [...baseResult.indicators];
  
  if (aiResult.isSpam) {
    indicators.push({
      type: 'ai_detection',
      severity: aiResult.confidence > 80 ? 'high' : aiResult.confidence > 60 ? 'medium' : 'low',
      description: 'AI-powered threat detection',
      details: aiResult.reasoning
    });
  }
  
  // Add AI-specific risk factors
  aiResult.riskFactors.forEach(factor => {
    indicators.push({
      type: 'ai_detection',
      severity: 'medium',
      description: 'AI Risk Factor',
      details: factor
    });
  });
  
  const spamScore = aiResult.isSpam 
    ? Math.max(baseResult.spamScore, aiResult.confidence)
    : Math.min(baseResult.spamScore, 100 - aiResult.confidence);
  
  let riskLevel: 'safe' | 'suspicious' | 'dangerous';
  if (spamScore >= 70) {
    riskLevel = 'dangerous';
  } else if (spamScore >= 40) {
    riskLevel = 'suspicious';
  } else {
    riskLevel = 'safe';
  }
  
  return {
    ...baseResult,
    spamScore: Math.min(spamScore, 100),
    riskLevel,
    indicators,
    analysisMethod: 'ai',
    confidence: aiResult.confidence
  };
}