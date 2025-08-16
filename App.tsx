
import React, { useState, useCallback } from 'react';
import { generateWebsiteCode, editWebsiteCode } from './services/geminiService';
import { ViewMode } from './types';
import PromptInput from './components/PromptInput';
import OutputDisplay from './components/OutputDisplay';
import { LogoIcon } from './components/icons/LogoIcon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.PREVIEW);
  
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the website you want to build.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode('');

    try {
      const code = await generateWebsiteCode(prompt);
      setGeneratedCode(code);
      setActiveView(ViewMode.PREVIEW);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);
  
  const handleAiEdit = useCallback(async () => {
    if (!editPrompt.trim() || !generatedCode) {
      setError('Please enter an edit instruction and ensure there is code to edit.');
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      const updatedCode = await editWebsiteCode(generatedCode, editPrompt);
      setGeneratedCode(updatedCode);
      setEditPrompt(''); // Clear input after successful edit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during the edit.');
    } finally {
      setIsEditing(false);
    }
  }, [editPrompt, generatedCode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="flex items-center justify-center mb-6">
          <LogoIcon className="h-8 w-8 mr-3 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            AI Website Generator
          </h1>
        </header>

        <main className="flex flex-col gap-6">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          
          {error && (
             <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}

          <OutputDisplay
            code={generatedCode}
            setCode={setGeneratedCode}
            isLoading={isLoading}
            activeView={activeView}
            setActiveView={setActiveView}
            editPrompt={editPrompt}
            setEditPrompt={setEditPrompt}
            onAiEdit={handleAiEdit}
            isEditing={isEditing}
          />
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Google Gemini. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;