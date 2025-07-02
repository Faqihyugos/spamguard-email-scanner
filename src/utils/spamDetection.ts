import { SpamAnalysisResult, SpamIndicator } from '../types/SpamAnalysis';

const PHISHING_KEYWORDS = [
  'urgent', 'immediate', 'verify account', 'suspended', 'click here',
  'limited time', 'act now', 'confirm identity', 'security alert',
  'update payment', 'expired', 'locked account', 'win', 'congratulations',
  'free money', 'tax refund', 'inheritance', 'lottery', 'prince'
];

const SUSPICIOUS_DOMAINS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co'
];

const TRUSTED_DOMAINS = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'apple.com', 'microsoft.com',
  'google.com', 'amazon.com', 'paypal.com', 'linkedin.com', 'facebook.com'
];

export function analyzeEmail(
  content: string,
  subject: string,
  sender: string
): SpamAnalysisResult {
  const indicators: SpamIndicator[] = [];
  let spamScore = 0;

  // Extract email domain
  const emailMatch = sender.match(/@([^>]+)/);
  const domain = emailMatch ? emailMatch[1].toLowerCase() : '';

  // Analyze sender
  const senderAnalysis = analyzeSender(sender, domain);
  
  // Analyze content
  const contentAnalysis = analyzeContent(content, subject);
  
  // Check for phishing keywords
  const suspiciousWords = PHISHING_KEYWORDS.filter(keyword => 
    content.toLowerCase().includes(keyword) || subject.toLowerCase().includes(keyword)
  );

  if (suspiciousWords.length > 0) {
    const severity = suspiciousWords.length > 3 ? 'high' : suspiciousWords.length > 1 ? 'medium' : 'low';
    indicators.push({
      type: 'phishing',
      severity,
      description: 'Phishing keywords detected',
      details: `Found suspicious words: ${suspiciousWords.join(', ')}`
    });
    spamScore += suspiciousWords.length * 15;
  }

  // Check for suspicious links
  const linkMatches = content.match(/https?:\/\/[^\s]+/g) || [];
  const suspiciousLinks = linkMatches.filter(link => 
    SUSPICIOUS_DOMAINS.some(domain => link.includes(domain))
  );

  if (suspiciousLinks.length > 0) {
    indicators.push({
      type: 'suspicious_links',
      severity: 'high',
      description: 'Suspicious shortened URLs detected',
      details: `Found ${suspiciousLinks.length} suspicious link(s)`
    });
    spamScore += 25;
  }

  // Check urgency level
  const urgencyWords = ['urgent', 'immediate', 'asap', 'now', 'today', 'expires'];
  const urgencyCount = urgencyWords.filter(word => 
    content.toLowerCase().includes(word) || subject.toLowerCase().includes(word)
  ).length;

  if (urgencyCount > 0) {
    indicators.push({
      type: 'urgency',
      severity: urgencyCount > 2 ? 'high' : 'medium',
      description: 'High urgency language detected',
      details: `Contains ${urgencyCount} urgency indicator(s)`
    });
    spamScore += urgencyCount * 10;
  }

  // Analyze sender reputation
  if (!senderAnalysis.verified) {
    indicators.push({
      type: 'sender',
      severity: senderAnalysis.reputation === 'suspicious' ? 'high' : 'medium',
      description: 'Unverified sender',
      details: `Sender domain ${domain} has ${senderAnalysis.reputation} reputation`
    });
    spamScore += senderAnalysis.reputation === 'suspicious' ? 30 : 15;
  }

  // Grammar and spelling analysis
  const grammarIssues = analyzeGrammar(content);
  if (grammarIssues > 3) {
    indicators.push({
      type: 'grammar',
      severity: 'medium',
      description: 'Poor grammar and spelling',
      details: `Detected ${grammarIssues} potential grammar/spelling issues`
    });
    spamScore += 10;
  }

  // Determine risk level
  let riskLevel: 'safe' | 'suspicious' | 'dangerous';
  if (spamScore >= 60) {
    riskLevel = 'dangerous';
  } else if (spamScore >= 30) {
    riskLevel = 'suspicious';
  } else {
    riskLevel = 'safe';
  }

  return {
    spamScore: Math.min(spamScore, 100),
    riskLevel,
    indicators,
    senderAnalysis,
    contentAnalysis: {
      ...contentAnalysis,
      suspiciousWords,
      urgencyLevel: urgencyCount,
      linkCount: linkMatches.length,
      attachmentCount: (content.match(/attachment|download|file/gi) || []).length
    }
  };
}

function analyzeSender(sender: string, domain: string) {
  const reputation = TRUSTED_DOMAINS.includes(domain) 
    ? 'good' 
    : domain.includes('.') && !domain.includes('suspicious') 
    ? 'unknown' 
    : 'suspicious';
  
  const verified = TRUSTED_DOMAINS.includes(domain);

  return {
    domain,
    reputation,
    verified
  };
}

function analyzeContent(content: string, subject: string) {
  // Basic content analysis
  return {
    length: content.length,
    hasSubject: subject.length > 0,
    containsHTML: /<[^>]*>/.test(content),
    containsImages: /\.(jpg|jpeg|png|gif|bmp)/i.test(content)
  };
}

function analyzeGrammar(content: string): number {
  let issues = 0;
  
  // Simple grammar checks
  if (/\s{2,}/.test(content)) issues++; // Multiple spaces
  if (/[.!?]{2,}/.test(content)) issues++; // Multiple punctuation
  if (/[A-Z]{4,}/.test(content)) issues++; // Excessive caps
  if (!/[.!?]$/.test(content.trim())) issues++; // Missing end punctuation
  
  return issues;
}