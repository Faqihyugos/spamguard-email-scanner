import React from 'react';
import { Brain, Cpu, Wifi, WifiOff, Zap, Shield } from 'lucide-react';

interface AnalysisMethodSelectorProps {
  method: 'local' | 'ai';
  onMethodChange: (method: 'local' | 'ai') => void;
  isOnline: boolean;
}

export const AnalysisMethodSelector: React.FC<AnalysisMethodSelectorProps> = ({
  method,
  onMethodChange,
  isOnline
}) => {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Zap className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">Analysis Method</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Basic Local Analysis */}
        <button
          onClick={() => onMethodChange('local')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            method === 'local'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${method === 'local' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Shield className={`w-5 h-5 ${method === 'local' ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h4 className={`font-semibold ${method === 'local' ? 'text-blue-900' : 'text-gray-700'}`}>
                Basic Analysis
              </h4>
              <div className="flex items-center space-x-1">
                <WifiOff className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Offline Ready</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Standard rule-based spam detection
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              🔒 Private
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              ⚡ Fast
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              📱 Offline
            </span>
          </div>
        </button>

        {/* Enhanced Local Analysis */}
        <button
          onClick={() => onMethodChange('ai')}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            method === 'ai'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${method === 'ai' ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Brain className={`w-5 h-5 ${method === 'ai' ? 'text-purple-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h4 className={`font-semibold ${method === 'ai' ? 'text-purple-900' : 'text-gray-700'}`}>
                Enhanced Analysis
              </h4>
              <div className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">AI-Style Local</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Advanced pattern recognition & heuristic analysis
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              🧠 Smart Patterns
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
              🎯 More Accurate
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              🔒 Still Private
            </span>
          </div>
        </button>
      </div>
      
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            <strong>Privacy First:</strong> Both methods process emails locally in your browser. No data is sent to external servers.
          </span>
        </div>
      </div>
    </div>
  );
};