import React from 'react';
import { FileText, Link, Clock, AlertTriangle } from 'lucide-react';
import { SpamAnalysisResult } from '../types/SpamAnalysis';

interface ContentAnalysisProps {
  analysis: SpamAnalysisResult['contentAnalysis'];
}

export const ContentAnalysis: React.FC<ContentAnalysisProps> = ({ analysis }) => {
  const getUrgencyColor = () => {
    if (analysis.urgencyLevel >= 3) return 'text-red-600';
    if (analysis.urgencyLevel >= 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Content Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Link className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Links Found</p>
            <p className="text-lg font-bold text-blue-600">{analysis.linkCount}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${getUrgencyColor()}`} />
          <div>
            <p className="text-sm font-medium">Urgency Level</p>
            <p className={`text-lg font-bold ${getUrgencyColor()}`}>{analysis.urgencyLevel}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <div>
            <p className="text-sm font-medium">Suspicious Words</p>
            <p className="text-lg font-bold text-orange-600">{analysis.suspiciousWords.length}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-purple-600" />
          <div>
            <p className="text-sm font-medium">Attachments</p>
            <p className="text-lg font-bold text-purple-600">{analysis.attachmentCount}</p>
          </div>
        </div>
      </div>
      
      {analysis.suspiciousWords.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm font-medium text-orange-800 mb-1">Suspicious Words Found:</p>
          <div className="flex flex-wrap gap-1">
            {analysis.suspiciousWords.map((word, index) => (
              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};