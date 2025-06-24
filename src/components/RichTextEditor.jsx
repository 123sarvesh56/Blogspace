import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // Trigger change event
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
    }
  };

  const handleImageInsert = () => {
    if (imageUrl) {
      execCommand('insertImage', imageUrl);
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map(({ icon: Icon, command, value, title }) => (
            <button
              key={command}
              type="button"
              onClick={() => execCommand(command, value)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
              title={title}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        id="rich-editor"
        contentEditable
        className="min-h-[300px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.target.innerHTML)}
        placeholder={placeholder}
        style={{
          caretColor: 'currentColor'
        }}
      />

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Insert Image
            </h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleImageInsert}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Insert
              </button>
              <button
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl('');
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;