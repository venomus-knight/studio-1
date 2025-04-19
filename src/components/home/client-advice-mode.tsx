'use client';

import {getClientAdvice} from '@/ai/flows/client-advice';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import {Textarea} from '@/components/ui/textarea';
import React, {useState} from 'react';
import {useToast} from '@/hooks/use-toast';

export function ClientAdviceMode() {
  const [legalQuestion, setLegalQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [relevantLaws, setRelevantLaws] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleGetAdvice = async () => {
    setIsLoading(true);
    try {
      const result = await getClientAdvice({legalQuestion});
      setAdvice(result.advice);
      setRelevantLaws(result.relevantLaws);
      toast({
        title: 'Advice Generated',
        description: 'Successfully generated legal advice.',
      });
    } catch (error: any) {
      console.error('Error getting client advice:', error);
      toast({
        title: 'Error',
        description:
          error?.message || 'Failed to generate legal advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Client Advice</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Textarea
            placeholder="Enter your legal question here..."
            value={legalQuestion}
            onChange={e => setLegalQuestion(e.target.value)}
            className="resize-none"
          />
          <Button onClick={handleGetAdvice} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Generating Advice...
              </>
            ) : (
              'Get Advice'
            )}
          </Button>
        </CardContent>
      </Card>

      {advice && (
        <Card>
          <CardHeader>
            <CardTitle>Preliminary Legal Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{advice}</p>
            {relevantLaws.length > 0 && (
              <div>
                <p className="font-bold">Relevant Laws:</p>
                <ul>
                  {relevantLaws.map((law, index) => (
                    <li key={index}>{law}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm italic">
              Disclaimer: This is preliminary legal guidance and not a substitute
              for advice from a professional legal expert.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
