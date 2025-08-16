
import React, { useState, useCallback, ChangeEvent, ClipboardEvent } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { XMarkIcon } from './icons/XMarkIcon';


// This allows TypeScript to recognize JSZip loaded from the CDN
declare var JSZip: any;

interface CodeViewProps {
  code: string;
  setCode: (code: string) => void;
}

interface ActionsProps {
  code: string;
}

const ImageUploadModal: React.FC<{
  onClose: () => void;
  imageSrc: string;
  imageSnippet: string;
}> = ({ onClose, imageSrc, imageSnippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(imageSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [imageSnippet]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg text-gray-800 dark:text-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Image Uploaded</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm">Your image is ready to be embedded. Copy the snippet below and paste it into your code.</p>
          <div className="max-h-60 overflow-auto p-2 rounded-md bg-gray-100 dark:bg-gray-900 flex justify-center">
             <img src={imageSrc} alt="Uploaded preview" className="max-w-full h-auto object-contain" />
          </div>
          <div className="space-y-2">
             <label htmlFor="image-snippet" className="text-sm font-medium">HTML Snippet:</label>
            <textarea
              id="image-snippet"
              readOnly
              value={imageSnippet}
              className="w-full p-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              rows={4}
            />
          </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700">
                {copied ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                {copied ? 'Copied!' : 'Copy Snippet'}
            </button>
        </div>
      </div>
    </div>
  )
}


const CodeActions: React.FC<ActionsProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState({ src: '', snippet: ''});

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const handleDownload = useCallback(() => {
    const zip = new JSZip();
    zip.file("index.html", code);
    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "ai-generated-website.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  }, [code]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setUploadedImage({
          src: base64String,
          snippet: `<img src="${base64String}" alt="${file.name}" style="width: 100%; height: auto; max-width: 400px;" />`
        });
        setIsUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; // Reset input to allow uploading the same file again
  };
  
  const actionButtonClasses = "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 bg-gray-700 text-gray-200 hover:bg-gray-600";

  return (
    <>
    <div className="flex space-x-2">
       <input type="file" id="image-upload-input" hidden accept="image/*" onChange={handleImageUpload} />
       <button onClick={() => document.getElementById('image-upload-input')?.click()} className={actionButtonClasses}>
        <PhotoIcon className="h-4 w-4" />
        Upload Image
      </button>
      <button onClick={handleCopy} className={actionButtonClasses}>
        {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button onClick={handleDownload} className={actionButtonClasses}>
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download
      </button>
    </div>
    {isUploadModalOpen && <ImageUploadModal onClose={() => setIsUploadModalOpen(false)} imageSrc={uploadedImage.src} imageSnippet={uploadedImage.snippet} />}
    </>
  );
};


const CodeView: React.FC<CodeViewProps> & { Actions: React.FC<ActionsProps> } = ({ code, setCode }) => {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
        <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 bg-transparent text-sm text-gray-200 font-mono resize-none border-0 focus:ring-0 focus:outline-none"
            spellCheck="false"
            aria-label="Website Code Editor"
        />
    </div>
  );
};

CodeView.Actions = CodeActions;

export default CodeView;
