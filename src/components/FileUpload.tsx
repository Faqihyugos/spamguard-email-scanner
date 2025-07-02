import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { parseEmlFile, validateEmlFile, ParsedEmail } from '../utils/emlParser';

interface FileUploadProps {
  onEmailParsed: (email: ParsedEmail) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onEmailParsed, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!validateEmlFile(file)) {
      onError('Please upload a valid .eml file');
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);

    try {
      const text = await file.text();
      const parsedEmail = parseEmlFile(text);
      
      if (!parsedEmail.sender || !parsedEmail.content) {
        onError('Unable to parse email file. Please check the file format.');
        return;
      }
      
      onEmailParsed(parsedEmail);
    } catch (error) {
      onError('Error reading file. Please try again.');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onEmailParsed, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-3">
          <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-600">Processing email file...</span>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop your .eml file here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Secure file processing - your email stays private
                </p>
              </div>
              
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".eml,message/rfc822"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {uploadedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <File className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
            <span className="text-xs text-green-600">
              ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={clearFile}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-blue-800">
          <p className="font-medium mb-1">Privacy Notice:</p>
          <p>Your email files are processed locally in your browser. No data is sent to external servers.</p>
        </div>
      </div>
    </div>
  );
};