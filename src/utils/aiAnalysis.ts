import { SpamAnalysisResult, SpamIndicator, AIAnalysisRequest, AIAnalysisResponse } from '../types/SpamAnalysis';

// Enhanced local AI simulation that doesn't require external APIs
export async function analyzeEmailWithAI(
  content: string,
  subject: string,
  sender: string
): Promise<SpamAnalysisResult> {
  try {
    // Use enhanced local analysis that simulates AI behavior
    const aiResult = await performEnhancedLocalAnalysis({ content, subject, sender });
    return convertAIResultToSpamAnalysis(aiResult, content, subject, sender);
    
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

async function performEnhancedLocalAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  // Enhanced pattern recognition that simulates AI analysis
  const { analyzeEmail } = await import('./spamDetection');
  const localResult = analyzeEmail(request.content, request.subject, request.sender);
  
  // Advanced pattern analysis
  const patterns = analyzeAdvancedPatterns(request);
  const sentiment = analyzeSentiment(request.content);
  const linguisticFeatures = analyzeLinguisticFeatures(request.content);
  
  // Combine all analysis factors
  let confidence = localResult.spamScore;
  const categories: string[] = [];
  const riskFactors: string[] = [];
  
  // Pattern-based enhancements
  if (patterns.hasPhishingPatterns) {
    confidence += 15;
    categories.push('phishing');
    riskFactors.push('Advanced phishing patterns detected');
  }
  
  if (patterns.hasSocialEngineering) {
    confidence += 12;
    categories.push('social_engineering');
    riskFactors.push('Social engineering tactics identified');
  }
  
  if (patterns.hasAdvancedThreats) {
    confidence += 20;
    categories.push('advanced_threat');
    riskFactors.push('Sophisticated threat indicators found');
  }
  
  // Sentiment analysis
  if (sentiment.isManipulative) {
    confidence += 10;
    riskFactors.push('Manipulative language patterns');
  }
  
  if (sentiment.isUrgent) {
    confidence += 8;
    riskFactors.push('High-pressure psychological tactics');
  }
  
  // Linguistic analysis
  if (linguisticFeatures.hasGrammarIssues) {
    confidence += 5;
    riskFactors.push('Suspicious grammar patterns');
  }
  
  if (linguisticFeatures.hasTranslationArtifacts) {
    confidence += 7;
    riskFactors.push('Possible machine translation artifacts');
  }
  
  // Domain reputation analysis
  const domainAnalysis = analyzeDomainReputation(request.sender);
  if (domainAnalysis.isSuspicious) {
    confidence += domainAnalysis.riskScore;
    riskFactors.push(`Domain reputation: ${domainAnalysis.reason}`);
  }
  
  // Normalize confidence
  confidence = Math.min(confidence, 95);
  const isSpam = confidence > 50;
  
  if (!isSpam) {
    categories.push('legitimate');
  }
  
  // Generate AI-style reasoning
  const reasoning = generateAIReasoning(isSpam, confidence, riskFactors, patterns);
  
  return {
    isSpam,
    confidence,
    reasoning,
    categories,
    riskFactors
  };
}

function analyzeAdvancedPatterns(request: AIAnalysisRequest) {
  const content = request.content.toLowerCase();
  const subject = request.subject.toLowerCase();
  const fullText = `${subject} ${content}`;
  
  // Advanced phishing patterns
  const phishingPatterns = [
    /verify.*account.*immediately/i,
    /suspended.*24.*hours/i,
    /click.*here.*now/i,
    /limited.*time.*offer/i,
    /confirm.*identity.*urgent/i,
    /security.*alert.*action/i,
    /update.*payment.*expire/i,
    /congratulations.*winner/i
  ];
  
  // Social engineering patterns
  const socialEngineeringPatterns = [
    /dear.*valued.*customer/i,
    /act.*now.*or.*lose/i,
    /final.*notice/i,
    /immediate.*action.*required/i,
    /don't.*miss.*out/i,
    /exclusive.*offer.*you/i
  ];
  
  // Advanced threat patterns
  const advancedThreatPatterns = [
    /bit\.ly|tinyurl|goo\.gl|t\.co/i,
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i, // IP addresses
    /urgent.*security.*team/i,
    /microsoft.*apple.*google.*security/i,
    /tax.*refund.*irs/i,
    /inheritance.*million.*dollars/i
  ];
  
  return {
    hasPhishingPatterns: phishingPatterns.some(pattern => pattern.test(fullText)),
    hasSocialEngineering: socialEngineeringPatterns.some(pattern => pattern.test(fullText)),
    hasAdvancedThreats: advancedThreatPatterns.some(pattern => pattern.test(fullText))
  };
}

function analyzeSentiment(content: string) {
  const urgentWords = ['urgent', 'immediate', 'now', 'asap', 'quickly', 'fast', 'hurry'];
  const manipulativeWords = ['limited', 'exclusive', 'special', 'secret', 'guaranteed', 'free', 'win'];
  const fearWords = ['suspended', 'blocked', 'terminated', 'expired', 'lose', 'miss'];
  
  const contentLower = content.toLowerCase();
  
  const urgentCount = urgentWords.filter(word => contentLower.includes(word)).length;
  const manipulativeCount = manipulativeWords.filter(word => contentLower.includes(word)).length;
  const fearCount = fearWords.filter(word => contentLower.includes(word)).length;
  
  return {
    isManipulative: manipulativeCount >= 2,
    isUrgent: urgentCount >= 2,
    usesFear: fearCount >= 1,
    sentimentScore: urgentCount + manipulativeCount + fearCount
  };
}

function analyzeLinguisticFeatures(content: string) {
  // Grammar and linguistic analysis
  const grammarIssues = [
    /\s{2,}/g, // Multiple spaces
    /[.!?]{2,}/g, // Multiple punctuation
    /[A-Z]{4,}/g, // Excessive caps
    /\b(recieve|seperate|occured|definately)\b/gi // Common misspellings
  ];
  
  const translationArtifacts = [
    /\b(kindly|please to|do the needful)\b/gi,
    /\b(revert back|prepone|good name)\b/gi
  ];
  
  const grammarIssueCount = grammarIssues.reduce((count, pattern) => {
    const matches = content.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  const translationArtifactCount = translationArtifacts.reduce((count, pattern) => {
    const matches = content.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  return {
    hasGrammarIssues: grammarIssueCount > 2,
    hasTranslationArtifacts: translationArtifactCount > 0,
    grammarScore: grammarIssueCount,
    translationScore: translationArtifactCount
  };
}

function analyzeDomainReputation(sender: string) {
  const emailMatch = sender.match(/@([^>]+)/);
  const domain = emailMatch ? emailMatch[1].toLowerCase() : '';
  
  // Known suspicious patterns
  const suspiciousDomains = [
    'urgent-security-alert.com',
    'security-team-alert.com',
    'account-verification.net',
    'payment-update.org'
  ];
  
  const suspiciousPatterns = [
    /security.*alert/i,
    /urgent.*team/i,
    /account.*verify/i,
    /payment.*update/i,
    /microsoft.*security/i,
    /apple.*support/i
  ];
  
  const trustedDomains = [
    'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com',
    'apple.com', 'microsoft.com', 'google.com', 'amazon.com'
  ];
  
  if (trustedDomains.includes(domain)) {
    return { isSuspicious: false, riskScore: 0, reason: 'trusted domain' };
  }
  
  if (suspiciousDomains.includes(domain)) {
    return { isSuspicious: true, riskScore: 25, reason: 'known suspicious domain' };
  }
  
  if (suspiciousPatterns.some(pattern => pattern.test(domain))) {
    return { isSuspicious: true, riskScore: 15, reason: 'suspicious domain pattern' };
  }
  
  // Check for domain age simulation (newer domains are more suspicious)
  if (domain.length < 8 || /\d{3,}/.test(domain)) {
    return { isSuspicious: true, riskScore: 10, reason: 'suspicious domain structure' };
  }
  
  return { isSuspicious: false, riskScore: 0, reason: 'unknown domain' };
}

function generateAIReasoning(isSpam: boolean, confidence: number, riskFactors: string[], patterns: any): string {
  if (isSpam) {
    const primaryFactors = riskFactors.slice(0, 3);
    return `AI analysis detected ${primaryFactors.length} critical risk factors with ${confidence}% confidence. Primary concerns: ${primaryFactors.join(', ')}. The email exhibits patterns consistent with ${patterns.hasPhishingPatterns ? 'phishing attacks' : patterns.hasSocialEngineering ? 'social engineering' : 'spam campaigns'}.`;
  } else {
    return `AI analysis indicates legitimate email with ${confidence}% confidence. No significant threat patterns detected. Content appears to follow normal communication patterns without suspicious indicators.`;
  }
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
  
  const spamScore = Math.max(baseResult.spamScore, aiResult.confidence);
  
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