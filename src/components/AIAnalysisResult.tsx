import React from 'react';
import { Brain, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { SpamAnalysisResult } from '../types/SpamAnalysis';

interface AIAnalysisResultProps {
  analysis: SpamAnalysisResult;
}

export const AIAnalysisResult: React.FC<AIAnalysisResultProps> = ({ analysis }) => {
  if (analysis.analysisMethod !== 'ai') return null;

  const getConfidenceColor = () => {
    if (analysis.confidence >= 80) return 'text-green-600';
    if (analysis.confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = () => {
    if (analysis.confidence >= 80) return 'bg-green-100 border-green-200';
    if (analysis.confidence >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className={`border rounded-lg p-4 ${getConfidenceBg()}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">AI Analysis Results</h3>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
          AI POWERED
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Zap className={`w-4 h-4 ${getConfidenceColor()}`} />
          <div>
            <p className="text-sm font-medium">AI Confidence</p>
            <p className={`text-lg font-bold ${getConfidenceColor()}`}>
              {analysis.confidence}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {analysis.riskLevel === 'safe' ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : analysis.riskLevel === 'suspicious' ? (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <div>
            <p className="text-sm font-medium">Risk Assessment</p>
            <p className={`text-lg font-bold capitalize ${
              analysis.riskLevel === 'safe' ? 'text-green-600' :
              analysis.riskLevel === 'suspicious' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.riskLevel}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <div>
            <p className="text-sm font-medium">AI Indicators</p>
            <p className="text-lg font-bold text-purple-600">
              {analysis.indicators.filter(i => i.type === 'ai_detection').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* AI-specific indicators */}
      {analysis.indicators.filter(i => i.type === 'ai_detection').length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800 mb-2">AI Insights:</h4>
          {analysis.indicators
            .filter(i => i.type === 'ai_detection')
            .map((indicator, index) => (
              <div key={index} className="p-3 bg-white bg-opacity-50 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{indicator.description}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    indicator.severity === 'high' ? 'bg-red-100 text-red-800' :
                    indicator.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {indicator.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{indicator.details}</p>
              </div>
            ))}
        </div>
      )}
      
      <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Note:</span> AI analysis uses advanced machine learning models 
          to detect sophisticated threats that traditional rule-based systems might miss.
        </p>
      </div>
    </div>
  );
};