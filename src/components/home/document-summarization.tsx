'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export function DocumentSummarization() {
  const [documentContent, setDocumentContent] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    try {
      // Add your document summarization logic here
      // This is a placeholder for the actual implementation
    } catch (error) {
      console.error('Error summarizing document:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Document Summarization</h2>
      <Textarea
        placeholder="Paste your document content here..."
        value={documentContent}
        onChange={(e) => setDocumentContent(e.target.value)}
        className="min-h-[200px] mb-4"
      />
      <Button onClick={handleSummarize}>Summarize Document</Button>
      {summary && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </Card>
  );
}
