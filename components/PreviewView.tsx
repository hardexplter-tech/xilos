
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowsPointingOutIcon } from './icons/ArrowsPointingOutIcon';
import { XMarkIcon } from './icons/XMarkIcon';


interface PreviewViewProps {
  code: string;
}

const PreviewView: React.FC<PreviewViewProps> = ({ code }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="w-full h-full relative group">
      <iframe
        srcDoc={code}
        title="Website Preview"
        className="w-full h-full border-0 rounded-lg bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
      <button 
        onClick={() => setIsFullscreen(true)}
        className="absolute top-3 right-3 bg-gray-800/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-gray-800/80"
        aria-label="Enter fullscreen preview"
      >
        <ArrowsPointingOutIcon className="h-5 w-5" />
      </button>

      {isFullscreen && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 animate-fade-in">
          <div className="flex-shrink-0 p-2 flex justify-end items-center bg-gray-900 border-b border-gray-700">
            <h2 className="text-white font-semibold mr-auto pl-2">Fullscreen Preview</h2>
            <button 
              onClick={() => setIsFullscreen(false)} 
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-200 hover:bg-gray-600"
              aria-label="Exit fullscreen preview"
            >
              <XMarkIcon className="h-5 w-5" />
              Close
            </button>
          </div>
          <div className="flex-grow relative bg-white">
            <iframe 
              srcDoc={code} 
              title="Fullscreen Website Preview" 
              className="w-full h-full border-0" 
              sandbox="allow-scripts allow-same-origin" 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PreviewView;
