import React, { useState, useEffect } from 'react';
import { Shield, Mail, Scan, AlertTriangle, Upload, Linkedin } from 'lucide-react';
import { analyzeEmail } from './utils/spamDetection';
import { analyzeEmailWithAI } from './utils/aiAnalysis';
import { SpamAnalysisResult } from './types/SpamAnalysis';
import { SpamMeter } from './components/SpamMeter';
import { IndicatorCard } from './components/IndicatorCard';
import { SenderAnalysis } from './components/SenderAnalysis';
import { ContentAnalysis } from './components/ContentAnalysis';
import { FileUpload } from './components/FileUpload';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AnalysisMethodSelector } from './components/AnalysisMethodSelector';
import { AIAnalysisResult } from './components/AIAnalysisResult';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ParsedEmail } from './utils/emlParser';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setSender] = useState('');
  const [analysis, setAnalysis] = useState<SpamAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload'>('manual');
  const [analysisMethod, setAnalysisMethod] = useState<'local' | 'ai'>('local');
  const [uploadError, setUploadError] = useState<string>('');
  const isOnline = useOnlineStatus();

  const handleAnalyze = async () => {
    if (!emailContent.trim() || !emailSender.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      let result: SpamAnalysisResult;
      
      if (analysisMethod === 'ai' && isOnline) {
        // Use AI analysis
        result = await analyzeEmailWithAI(emailContent, emailSubject, emailSender);
      } else {
        // Use local analysis
        result = analyzeEmail(emailContent, emailSubject, emailSender);
        result.analysisMethod = 'local';
        result.confidence = 75;
      }
      
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to local analysis
      const result = analyzeEmail(emailContent, emailSubject, emailSender);
      result.analysisMethod = 'local';
      result.confidence = 75;
      setAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEmailParsed = (parsedEmail: ParsedEmail) => {
    setSender(parsedEmail.sender);
    setEmailSubject(parsedEmail.subject);
    setEmailContent(parsedEmail.content);
    setUploadError('');
    setInputMethod('upload');
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setTimeout(() => setUploadError(''), 5000);
  };

  const loadSampleEmail = () => {
    setSender('noreply@urgent-security-alert.com');
    setEmailSubject('URGENT: Your account will be suspended in 24 hours');
    setEmailContent(`Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.

Click here to verify your account: http://bit.ly/verify-account-now

If you don't act now, you will lose access to all your files and data permanently.

This is a limited time offer. Act fast!

Security Team
Urgent Security Alerts`);
    setInputMethod('manual');
  };

  const clearAll = () => {
    setSender('');
    setEmailSubject('');
    setEmailContent('');
    setAnalysis(null);
    setUploadError('');
  };

  // Auto-switch to local analysis when offline
  useEffect(() => {
    if (!isOnline && analysisMethod === 'ai') {
      setAnalysisMethod('local');
    }
  }, [isOnline, analysisMethod]);

  useEffect(() => {
    // Auto-analyze when content changes (with debounce)
    const timeoutId = setTimeout(() => {
      if (emailContent.trim() && emailSender.trim()) {
        handleAnalyze();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [emailContent, emailSubject, emailSender, analysisMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <OfflineIndicator />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">SpamGuard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced email security scanner with AI-powered detection and offline capabilities
          </p>
          <div className="mt-2 text-sm text-gray-500">
            ✨ Works offline - Your privacy is protected • 🧠 AI-enhanced when online
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Analysis Method Selector */}
              <AnalysisMethodSelector
                method={analysisMethod}
                onMethodChange={setAnalysisMethod}
                isOnline={isOnline}
              />

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Email Analysis</h2>
                  {analysisMethod === 'ai' && isOnline && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      AI POWERED
                    </span>
                  )}
                </div>

                {/* Input Method Toggle */}
                <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setInputMethod('manual')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                      inputMethod === 'manual'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Manual Input</span>
                  </button>
                  <button
                    onClick={() => setInputMethod('upload')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                      inputMethod === 'upload'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload .EML</span>
                  </button>
                </div>

                {uploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">{uploadError}</span>
                    </div>
                  </div>
                )}

                {inputMethod === 'upload' ? (
                  <FileUpload onEmailParsed={handleEmailParsed} onError={handleUploadError} />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sender Email Address
                      </label>
                      <input
                        type="email"
                        value={emailSender}
                        onChange={(e) => setSender(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="sender@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Email subject line"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Content
                      </label>
                      <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        rows={12}
                        placeholder="Paste the email content here for analysis..."
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={!emailContent.trim() || !emailSender.trim() || isAnalyzing}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>
                          {analysisMethod === 'ai' && isOnline ? 'AI Analyzing...' : 'Analyzing...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        <span>
                          {analysisMethod === 'ai' && isOnline ? 'AI Analyze' : 'Analyze Email'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={loadSampleEmail}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Load Sample
                  </button>

                  {(emailContent || emailSender || emailSubject) && (
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Display parsed email info for uploads */}
                {inputMethod === 'upload' && emailSender && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Email Successfully Parsed:</p>
                    <div className="text-xs text-green-700 space-y-1">
                      <p><span className="font-medium">From:</span> {emailSender}</p>
                      <p><span className="font-medium">Subject:</span> {emailSubject || 'No subject'}</p>
                      <p><span className="font-medium">Content:</span> {emailContent.length} characters</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  <SpamMeter score={analysis.spamScore} riskLevel={analysis.riskLevel} />
                  
                  {/* AI Analysis Results */}
                  {analysis.analysisMethod === 'ai' && (
                    <AIAnalysisResult analysis={analysis} />
                  )}
                  
                  <div className="grid gap-4">
                    <SenderAnalysis analysis={analysis.senderAnalysis} />
                    <ContentAnalysis analysis={analysis.contentAnalysis} />
                  </div>

                  {analysis.indicators.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h3 className="text-xl font-semibold text-gray-800">Security Alerts</h3>
                        {analysis.analysisMethod === 'ai' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            AI ENHANCED
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {analysis.indicators.map((indicator, index) => (
                          <IndicatorCard key={index} indicator={indicator} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-400">
                    Choose your analysis method and enter email details to begin security analysis
                  </p>
                  <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>Local Analysis</span>
                    </div>
                    {isOnline && (
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span className="text-purple-600 font-medium">AI-Powered Detection</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <p>© 2025 SpamGuard - Protecting your inbox from threats</p>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>Created by</span>
              <a
                href="https://www.linkedin.com/in/faqihyugos/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <Linkedin className="w-4 h-4" />
                <span>Faqih Yugos</span>
              </a>
            </div>
          </div>
          <p className="text-xs">
            🔒 Local processing for privacy • 🧠 AI enhancement when online • 📱 Works offline
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;