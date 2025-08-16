
import React from 'react';
import { ViewMode } from '../types';
import PreviewView from './PreviewView';
import CodeView from './CodeView';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { EyeIcon } from './icons/EyeIcon';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface OutputDisplayProps {
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  onAiEdit: () => void;
  isEditing: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  code, 
  setCode, 
  isLoading, 
  activeView, 
  setActiveView,
  editPrompt,
  setEditPrompt,
  onAiEdit,
  isEditing
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <LoadingSpinnerIcon className="animate-spin h-12 w-12 mb-4" />
          <p className="text-lg">Generating your website...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      );
    }

    if (!code) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <CodeBracketIcon className="h-16 w-16 mb-4" />
          <h3 className="text-xl font-semibold">Your website will appear here</h3>
          <p>Describe your ideal site above and click "Generate Website".</p>
        </div>
      );
    }
    
    return activeView === ViewMode.PREVIEW ? <PreviewView code={code} /> : <CodeView code={code} setCode={setCode} />;
  };

  const tabButtonClasses = (view: ViewMode) => `
    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800
    ${activeView === view 
      ? 'bg-indigo-600 text-white shadow-sm' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }
  `;
  
  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onAiEdit();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-h-[60vh] flex flex-col transition-shadow hover:shadow-xl">
      {code && !isLoading && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            <button className={tabButtonClasses(ViewMode.PREVIEW)} onClick={() => setActiveView(ViewMode.PREVIEW)}>
              <EyeIcon className="h-5 w-5" /> Preview
            </button>
            <button className={tabButtonClasses(ViewMode.CODE)} onClick={() => setActiveView(ViewMode.CODE)}>
              <CodeBracketIcon className="h-5 w-5" /> Code
            </button>
          </div>
          {activeView === ViewMode.CODE && <CodeView.Actions code={code} />}
        </div>
      )}
      <div className="flex-grow p-1 md:p-2 bg-gray-100 dark:bg-gray-900 rounded-b-xl overflow-hidden relative">
        {renderContent()}
      </div>
       {code && !isLoading && activeView === ViewMode.CODE && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
          <div className="flex gap-2 items-center">
             <label htmlFor="ai-edit-input" className="sr-only">AI Edit Prompt</label>
            <input
              id="ai-edit-input"
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyDown={handleEditKeyDown}
              placeholder="e.g., 'Change the background to dark blue and make the header sticky'"
              className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isEditing}
            />
            <button 
              onClick={onAiEdit} 
              disabled={isEditing || !editPrompt.trim()} 
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
            >
              {isEditing ? (
                <LoadingSpinnerIcon className="animate-spin h-5 w-5" />
              ) : (
                <SparklesIcon className="h-5 w-5" />
              )}
              <span className="ml-2 hidden sm:inline">{isEditing ? 'Editing...' : 'Edit with AI'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;
