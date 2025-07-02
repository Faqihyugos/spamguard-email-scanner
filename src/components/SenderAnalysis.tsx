import React from 'react';
import { Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SpamAnalysisResult } from '../types/SpamAnalysis';

interface SenderAnalysisProps {
  analysis: SpamAnalysisResult['senderAnalysis'];
}

export const SenderAnalysis: React.FC<SenderAnalysisProps> = ({ analysis }) => {
  const getReputationIcon = () => {
    switch (analysis.reputation) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'unknown': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'suspicious': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getReputationColor = () => {
    switch (analysis.reputation) {
      case 'good': return 'text-green-800 bg-green-50 border-green-200';
      case 'unknown': return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'suspicious': return 'text-red-800 bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getReputationColor()}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Mail className="w-5 h-5" />
        <h3 className="font-semibold">Sender Analysis</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Domain:</span>
          <span className="text-sm font-mono">{analysis.domain}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Reputation:</span>
          <div className="flex items-center space-x-1">
            {getReputationIcon()}
            <span className="text-sm capitalize">{analysis.reputation}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Verified:</span>
          <div className="flex items-center space-x-1">
            {analysis.verified ? 
              <CheckCircle className="w-4 h-4 text-green-600" /> : 
              <XCircle className="w-4 h-4 text-red-600" />
            }
            <span className="text-sm">{analysis.verified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};