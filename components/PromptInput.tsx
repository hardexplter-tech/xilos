
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      onGenerate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 transition-shadow hover:shadow-xl w-full">
      <div className="flex flex-col gap-4">
        <label htmlFor="prompt-textarea" className="sr-only">Website Description</label>
        <textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g., "A modern portfolio for a photographer with a gallery and contact form."'
          className="w-full h-24 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center justify-center w-full md:w-auto md:self-end px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <LoadingSpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
              Generate Website
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
