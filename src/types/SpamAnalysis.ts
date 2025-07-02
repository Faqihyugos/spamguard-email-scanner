export interface SpamIndicator {
  type: 'phishing' | 'suspicious_links' | 'urgency' | 'sender' | 'grammar' | 'attachment' | 'ai_detection';
  severity: 'low' | 'medium' | 'high';
  description: string;
  details: string;
}

export interface SpamAnalysisResult {
  spamScore: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  indicators: SpamIndicator[];
  senderAnalysis: {
    domain: string;
    reputation: 'good' | 'unknown' | 'suspicious';
    verified: boolean;
  };
  contentAnalysis: {
    suspiciousWords: string[];
    urgencyLevel: number;
    linkCount: number;
    attachmentCount: number;
  };
  analysisMethod: 'local' | 'ai';
  confidence: number;
}

export interface AIAnalysisRequest {
  content: string;
  subject: string;
  sender: string;
}

export interface AIAnalysisResponse {
  isSpam: boolean;
  confidence: number;
  reasoning: string;
  categories: string[];
  riskFactors: string[];
}