// filepath: c:\Users\markh\VsCodeProjects\studio\src\components\MyLucidEditor.jsx
import React from 'react';
import { Editor, defaultTools, LucidToolName } from '@lucidreact/editor';
import '@lucidreact/editor/dist/style.css';

// Ensure this path is correct: from src/components/ to src/icons/
import { ReactComponent as IndiaEmblemIcon } from '../icons/Emblem-of-India-01.svg';
// If your setup doesn't use ReactComponent (e.g., Vite/Next.js with SVGR configured differently):
// import IndiaEmblemIcon from '../icons/Emblem-of-India-01.svg?react'; // or similar

const MyCustomLucidEditor = () => {
  const customTools = defaultTools.map(tool => {
    if (tool.name === LucidToolName.PEN) { // Or the string 'pen'
      return {
        ...tool,
        icon: <IndiaEmblemIcon width={20} height={20} />, // Adjust size as needed
        // tooltip: 'Draw with Emblem', // Optional: customize tooltip
      };
    }
    return tool;
  });

  return (
    <div style={{ height: '600px', border: '1px solid #ccc' }}> {/* Adjust styling as needed */}
      <Editor
        tools={customTools}
        // ... other props like initialData, onChange, etc.
      />
    </div>
  );
};

export default MyCustomLucidEditor;