import React from 'react';
import { Shield, AlertTriangle, XCircle } from 'lucide-react';

interface SpamMeterProps {
  score: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
}

export const SpamMeter: React.FC<SpamMeterProps> = ({ score, riskLevel }) => {
  const getColor = () => {
    switch (riskLevel) {
      case 'safe': return 'text-green-600';
      case 'suspicious': return 'text-yellow-600';
      case 'dangerous': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (riskLevel) {
      case 'safe': return 'bg-green-500';
      case 'suspicious': return 'bg-yellow-500';
      case 'dangerous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case 'safe': return <Shield className="w-8 h-8" />;
      case 'suspicious': return <AlertTriangle className="w-8 h-8" />;
      case 'dangerous': return <XCircle className="w-8 h-8" />;
    }
  };

  const getMessage = () => {
    switch (riskLevel) {
      case 'safe': return 'Email appears safe';
      case 'suspicious': return 'Potentially suspicious email';
      case 'dangerous': return 'High risk - likely spam/phishing';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-3 ${getColor()}`}>
          {getIcon()}
          <div>
            <h3 className="text-xl font-bold">Spam Risk: {score}%</h3>
            <p className="text-sm opacity-80">{getMessage()}</p>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className={`h-4 rounded-full transition-all duration-500 ease-out ${getBgColor()}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Safe (0-29%)</span>
        <span>Suspicious (30-59%)</span>
        <span>Dangerous (60%+)</span>
      </div>
    </div>
  );
};