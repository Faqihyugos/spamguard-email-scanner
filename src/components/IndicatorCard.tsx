import React from 'react';
import { AlertTriangle, XCircle, Info, Shield, Link, Clock } from 'lucide-react';
import { SpamIndicator } from '../types/SpamAnalysis';

interface IndicatorCardProps {
  indicator: SpamIndicator;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  const getIcon = () => {
    switch (indicator.type) {
      case 'phishing': return <XCircle className="w-5 h-5" />;
      case 'suspicious_links': return <Link className="w-5 h-5" />;
      case 'urgency': return <Clock className="w-5 h-5" />;
      case 'sender': return <Shield className="w-5 h-5" />;
      case 'grammar': return <Info className="w-5 h-5" />;
      case 'attachment': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (indicator.severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getSeverityBadge = () => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (indicator.severity) {
      case 'high': return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getColorClasses()}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h4 className="font-semibold">{indicator.description}</h4>
        </div>
        <span className={getSeverityBadge()}>
          {indicator.severity.toUpperCase()}
        </span>
      </div>
      <p className="text-sm opacity-80">{indicator.details}</p>
    </div>
  );
};