'use client';

import React, {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Icons} from '@/components/icons';
import {useToast} from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";

import {identifyLaws, type IdentifyLawsOutput} from '@/ai/flows/identify-laws-flow';
import {retrievePrecedent, type RetrievePrecedentOutput} from '@/ai/flows/precedent-retrieval';
import {generateChecklist, type GenerateChecklistOutput} from '@/ai/flows/generate-checklist-flow';
import {summarizeDocument, type SummarizeDocumentOutput} from '@/ai/flows/document-summarization';

export function UnifiedLegalAssistant() {
  const {toast} = useToast();

  // Main query states
  const [mainQuery, setMainQuery] = useState('');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [lawsResult, setLawsResult] = useState<IdentifyLawsOutput | null>(null);
  const [precedentsResult, setPrecedentsResult] = useState<RetrievePrecedentOutput | null>(null);
  const [checklistResult, setChecklistResult] = useState<GenerateChecklistOutput | null>(null);
  const [useCustomLibrary, setUseCustomLibrary] = useState(false);


  // Document summarization states
  const [documentText, setDocumentText] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummarizeDocumentOutput | null>(null);

  // Custom RAG states
  const [customRagFile, setCustomRagFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target?.result as string;
        setDocumentText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleCustomRagFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomRagFile(file);
      // Placeholder for actual file processing for RAG
      toast({ title: "File Selected", description: `${file.name} selected for custom library. Processing coming soon.` });
    }
  };

  const handleAddCustomRagDocument = () => {
    if (!customRagFile) {
      toast({ title: "No File Selected", description: "Please select a document to add to your library.", variant: "destructive" });
      return;
    }
    // Placeholder for actual RAG document addition logic
    toast({ title: "Feature in Development", description: `Adding '${customRagFile.name}' to custom library is coming soon.` });
  };


  const handleGetInsights = useCallback(async () => {
    if (!mainQuery.trim()) {
      toast({title: 'Input Required', description: 'Please enter a legal query.', variant: 'destructive'});
      return;
    }
    setIsProcessingQuery(true);
    setLawsResult(null);
    setPrecedentsResult(null);
    setChecklistResult(null);

    try {
      // Parallel execution of independent flows
      const [lawsData, precedentsData, checklistData] = await Promise.all([
        identifyLaws({query: mainQuery}).catch(e => {
          console.error('Error identifying laws:', e);
          toast({title: 'Error Identifying Laws', description: e.message || 'An unknown error occurred.', variant: 'destructive'});
          return null;
        }),
        retrievePrecedent({legalQuestion: mainQuery, useCustomLibrary}).catch(e => {
          console.error('Error retrieving precedents:', e);
          toast({title: 'Error Retrieving Precedents', description: e.message || 'An unknown error occurred.', variant: 'destructive'});
          return null;
        }),
        generateChecklist({query: mainQuery, jurisdiction: 'India'}).catch(e => { // Assuming India, could be dynamic
          console.error('Error generating checklist:', e);
          toast({title: 'Error Generating Checklist', description: e.message || 'An unknown error occurred.', variant: 'destructive'});
          return null;
        }),
      ]);

      if (lawsData) setLawsResult(lawsData);
      if (precedentsData) setPrecedentsResult(precedentsData);
      if (checklistData) setChecklistResult(checklistData);

      if (lawsData || precedentsData || checklistData) {
        toast({title: 'Insights Generated', description: 'Legal insights have been processed.'});
      } else {
        toast({title: 'No Insights Generated', description: 'Could not generate any insights. Please try refining your query.', variant: 'destructive'});
      }

    } catch (error: any) {
      console.error('Error processing query:', error);
      toast({title: 'Processing Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive'});
    } finally {
      setIsProcessingQuery(false);
    }
  }, [mainQuery, toast, useCustomLibrary]);

  const handleSummarizeDocument = useCallback(async () => {
    if (!documentText.trim()) {
      toast({title: 'Input Required', description: 'Please upload or paste a document to summarize.', variant: 'destructive'});
      return;
    }
    setIsSummarizing(true);
    setSummaryResult(null);
    try {
      const result = await summarizeDocument({documentText});
      setSummaryResult(result);
      toast({title: 'Document Summarized', description: 'The document has been successfully summarized.'});
    } catch (error: any) {
      console.error('Error summarizing document:', error);
      toast({title: 'Summarization Error', description: error.message || 'Failed to summarize the document.', variant: 'destructive'});
    } finally {
      setIsSummarizing(false);
    }
  }, [documentText, toast]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="container mx-auto p-4 space-y-6">
        <Card className="glass-dark">
          <CardHeader>
            <CardTitle className="text-xl">Legal Query Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your legal situation, case, or question here..."
              value={mainQuery}
              onChange={e => setMainQuery(e.target.value)}
              rows={4}
              className="text-base"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="custom-library-switch"
                checked={useCustomLibrary}
                onCheckedChange={setUseCustomLibrary}
              />
              <Label htmlFor="custom-library-switch" className="text-sm">
                Reference My Custom Case Library (Beta)
              </Label>
            </div>
            <Button onClick={handleGetInsights} disabled={isProcessingQuery} size="lg" className="w-full">
              {isProcessingQuery ? (
                <>
                  <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
                  Processing Insights...
                </>
              ) : (
                'Get Legal Insights'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center"><Icons.scale className="mr-2 h-5 w-5" />Applicable Laws & Articles</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              {isProcessingQuery && !lawsResult && <Icons.loader className="mx-auto h-8 w-8 animate-spin text-primary" />}
              {lawsResult && lawsResult.laws.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lawsResult.laws.map((law, index) => (
                    <li key={index}>{law}</li>
                  ))}
                </ul>
              )}
              {lawsResult && lawsResult.laws.length === 0 && <p className="text-muted-foreground text-sm">No specific laws or articles identified for this query.</p>}
               {!isProcessingQuery && !lawsResult && <p className="text-muted-foreground text-sm">Results will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center"><Icons.fileText className="mr-2 h-5 w-5" />Similar Past Precedents</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px] space-y-3">
              {isProcessingQuery && !precedentsResult && <Icons.loader className="mx-auto h-8 w-8 animate-spin text-primary" />}
              {precedentsResult && precedentsResult.precedents.length > 0 && (
                <ScrollArea className="h-[200px] pr-3">
                  {precedentsResult.precedents.map((p, index) => (
                    <div key={index} className="mb-3 p-3 border border-border rounded-md bg-background/30 glass">
                      <p className="font-semibold text-base">{p.caseName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Citation: {p.citation}</p>
                      <p className="text-sm mt-2">{p.summary}</p>
                      {p.differences && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs font-semibold text-amber-400">Notable Differences:</p>
                            <p className="text-xs text-amber-300">{p.differences}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
              {precedentsResult && precedentsResult.precedents.length === 0 && <p className="text-muted-foreground text-sm">No relevant precedents found for this query.</p>}
              {!isProcessingQuery && !precedentsResult && <p className="text-muted-foreground text-sm">Results will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center"><Icons.listChecks className="mr-2 h-5 w-5" />Procedural Checklists</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              {isProcessingQuery && !checklistResult && <Icons.loader className="mx-auto h-8 w-8 animate-spin text-primary" />}
              {checklistResult && checklistResult.checklist.length > 0 && (
                <ul className="list-decimal pl-5 space-y-1 text-sm">
                  {checklistResult.checklist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {checklistResult && checklistResult.checklist.length === 0 && <p className="text-muted-foreground text-sm">No specific checklist generated for this query.</p>}
              {!isProcessingQuery && !checklistResult && <p className="text-muted-foreground text-sm">Results will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark md:col-span-2 lg:col-span-1"> {/* Adjust span for layout */}
            <CardHeader>
                <CardTitle className="flex items-center"><Icons.library className="mr-2 h-5 w-5" />My Custom Case Library</CardTitle>
                <CardDescription className="text-xs">Upload your documents to create a personalized knowledge base for the AI to reference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-rag-upload" className="text-sm font-medium">Upload Document (.txt, .md, .pdf)</Label>
                  <Input id="custom-rag-upload" type="file" onChange={handleCustomRagFileChange} accept=".txt,.md,.pdf" className="mt-1"/>
                </div>
                <Button onClick={handleAddCustomRagDocument} disabled={!customRagFile} className="w-full">
                  <Icons.plusCircle className="mr-2 h-4 w-4" />
                  Add to My Library (Coming Soon)
                </Button>
                <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                        {customRagFile ? `Selected: ${customRagFile.name}` : "No document selected."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Feature to build and query custom RAG is under development.
                    </p>
                </div>
            </CardContent>
          </Card>


            <Card className="glass-dark md:col-span-2"> {/* Adjust span for layout */}
              <CardHeader>
                <CardTitle className="flex items-center"><Icons.bookOpenText className="mr-2 h-5 w-5" />Simplify Judgment / Document</CardTitle>
                 <CardDescription className="text-xs">Upload or paste text from a single document to get a simplified summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-upload" className="text-sm font-medium">Upload Document (.txt, .md)</Label>
                  <Input id="document-upload" type="file" onChange={handleFileChange} accept=".txt,.md" className="mt-1"/>
                </div>
                <Textarea
                  placeholder="Or paste document text here..."
                  value={documentText}
                  onChange={e => {
                    setDocumentText(e.target.value);
                    if (documentFile) setDocumentFile(null); // Clear file if text is manually changed
                  }}
                  rows={6}
                  className="text-sm"
                />
                <Button onClick={handleSummarizeDocument} disabled={isSummarizing || !documentText.trim()} className="w-full">
                  {isSummarizing ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    'Summarize Document'
                  )}
                </Button>
                {isSummarizing && !summaryResult && <Icons.loader className="mx-auto mt-4 h-8 w-8 animate-spin text-primary" />}
                {summaryResult && (
                  <div className="mt-4 p-3 border border-border rounded-md bg-background/30 glass">
                    <p className="font-semibold text-base">Summary:</p>
                    <p className="text-sm whitespace-pre-wrap">{summaryResult.summary}</p>
                  </div>
                )}
                 {!isSummarizing && !summaryResult && !documentText && <p className="text-muted-foreground text-sm text-center pt-2">Upload or paste a document to get a summary.</p>}
              </CardContent>
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
