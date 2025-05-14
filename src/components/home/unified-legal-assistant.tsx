// src/components/home/unified-legal-assistant.tsx
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
import {addDocumentToCustomLibrary, type AddDocumentInput} from '@/ai/flows/add-custom-document-flow';


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
  const [documentTextForSummary, setDocumentTextForSummary] = useState('');
  const [documentFileForSummary, setDocumentFileForSummary] = useState<File | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummarizeDocumentOutput | null>(null);

  // Custom RAG states
  const [customRagFile, setCustomRagFile] = useState<File | null>(null);
  const [customRagFileContent, setCustomRagFileContent] = useState<string | null>(null);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);


  const handleFileChangeForSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocumentFileForSummary(file);
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target?.result as string;
        setDocumentTextForSummary(text);
      };
      reader.readAsText(file);
    }
  };

  const handleCustomRagFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomRagFile(file);
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target?.result as string;
        setCustomRagFileContent(text);
      };
      reader.readAsText(file);
      toast({ title: "File Selected", description: `${file.name} ready to be added to your library.` });
    } else {
      setCustomRagFile(null);
      setCustomRagFileContent(null);
    }
  };

  const handleAddCustomRagDocument = useCallback(async () => {
    if (!customRagFileContent) {
      toast({ title: "No Content", description: "Please select a document file and ensure it has content.", variant: "destructive" });
      return;
    }
    setIsAddingToLibrary(true);
    try {
      const input: AddDocumentInput = { documentText: customRagFileContent };
      const result = await addDocumentToCustomLibrary(input);
      toast({ 
        title: "Library Updated", 
        description: `${result.message} Library now contains ${result.librarySize} document(s).`
      });
      setCustomRagFile(null); // Reset file input
      setCustomRagFileContent(null);
      // Optionally, clear the file input element itself
      const fileInput = document.getElementById('custom-rag-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error adding document to custom library:', error);
      toast({ title: "Error Adding Document", description: error.message || 'Failed to add document.', variant: "destructive" });
    } finally {
      setIsAddingToLibrary(false);
    }
  }, [customRagFileContent, toast]);


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
        generateChecklist({query: mainQuery, jurisdiction: 'India'}).catch(e => { 
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
    if (!documentTextForSummary.trim()) {
      toast({title: 'Input Required', description: 'Please upload or paste a document to summarize.', variant: 'destructive'});
      return;
    }
    setIsSummarizing(true);
    setSummaryResult(null);
    try {
      const result = await summarizeDocument({documentText: documentTextForSummary});
      setSummaryResult(result);
      toast({title: 'Document Summarized', description: 'The document has been successfully summarized.'});
    } catch (error: any) {
      console.error('Error summarizing document:', error);
      toast({title: 'Summarization Error', description: error.message || 'Failed to summarize the document.', variant: 'destructive'});
    } finally {
      setIsSummarizing(false);
    }
  }, [documentTextForSummary, toast]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Card className="glass-dark">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Legal Query Input</CardTitle>
            <CardDescription>Enter your legal question or describe your case details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your legal situation, case, or question here..."
              value={mainQuery}
              onChange={e => setMainQuery(e.target.value)}
              rows={4}
              className="text-base"
            />
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="custom-library-switch"
                checked={useCustomLibrary}
                onCheckedChange={setUseCustomLibrary}
                aria-label="Toggle custom case library"
              />
              <Label htmlFor="custom-library-switch" className="text-sm">
                Reference My Custom Case Library
              </Label>
            </div>
            <Button onClick={handleGetInsights} disabled={isProcessingQuery} size="lg" className="w-full text-base">
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
              <CardTitle className="flex items-center text-lg"><Icons.scale className="mr-2 h-5 w-5 text-primary" />Applicable Laws</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              {isProcessingQuery && !lawsResult && <div className="flex justify-center items-center h-full"><Icons.loader className="h-8 w-8 animate-spin text-primary" /></div>}
              {lawsResult && lawsResult.laws.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {lawsResult.laws.map((law, index) => (
                    <li key={index}>{law}</li>
                  ))}
                </ul>
              )}
              {lawsResult && lawsResult.laws.length === 0 && <p className="text-muted-foreground text-sm">No specific laws or articles identified.</p>}
               {!isProcessingQuery && !lawsResult && <p className="text-muted-foreground text-sm">Applicable laws and articles will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Icons.fileText className="mr-2 h-5 w-5 text-primary" />Similar Precedents</CardTitle>
               {precedentsResult && <CardDescription className="text-xs pt-1">Sourced from: {precedentsResult.sourceType}</CardDescription>}
            </CardHeader>
            <CardContent className="min-h-[150px] space-y-3">
              {isProcessingQuery && !precedentsResult && <div className="flex justify-center items-center h-full"><Icons.loader className="h-8 w-8 animate-spin text-primary" /></div>}
              {precedentsResult && precedentsResult.precedents.length > 0 && (
                <ScrollArea className="h-[220px] pr-3 -mr-3">
                  {precedentsResult.precedents.map((p, index) => (
                    <div key={index} className="mb-3 p-3 border border-border/70 rounded-lg bg-background/40 glass">
                      <p className="font-semibold text-base">{p.caseName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Citation: {p.citation}</p>
                      <p className="text-sm mt-2">{p.summary}</p>
                      {p.differences && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs font-semibold text-amber-500">Notable Differences:</p>
                            <p className="text-xs text-amber-400">{p.differences}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
              {precedentsResult && precedentsResult.precedents.length === 0 && <p className="text-muted-foreground text-sm">No relevant precedents found.</p>}
              {!isProcessingQuery && !precedentsResult && <p className="text-muted-foreground text-sm">Relevant past court cases will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Icons.listChecks className="mr-2 h-5 w-5 text-primary" />Procedural Checklist</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              {isProcessingQuery && !checklistResult && <div className="flex justify-center items-center h-full"><Icons.loader className="h-8 w-8 animate-spin text-primary" /></div>}
              {checklistResult && checklistResult.checklist.length > 0 && (
                <ul className="list-decimal pl-5 space-y-1 text-sm">
                  {checklistResult.checklist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {checklistResult && checklistResult.checklist.length === 0 && <p className="text-muted-foreground text-sm">No procedural checklist generated.</p>}
              {!isProcessingQuery && !checklistResult && <p className="text-muted-foreground text-sm">A procedural checklist based on your query will appear here.</p>}
            </CardContent>
          </Card>

          <Card className="glass-dark md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Icons.library className="mr-2 h-5 w-5 text-primary" />My Custom Case Library</CardTitle>
                <CardDescription className="text-xs pt-1">Upload your documents (.txt, .md) to create a personalized knowledge base for the AI to reference. This is a simplified simulation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="custom-rag-upload" className="text-sm font-medium">Upload Document</Label>
                  <Input id="custom-rag-upload" type="file" onChange={handleCustomRagFileChange} accept=".txt,.md" className="mt-1"/>
                </div>
                <Button onClick={handleAddCustomRagDocument} disabled={!customRagFile || isAddingToLibrary} className="w-full">
                  {isAddingToLibrary ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.plusCircle className="mr-2 h-4 w-4" />}
                  {isAddingToLibrary ? 'Adding...' : 'Add to My Library'}
                </Button>
                <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                        {customRagFile ? `Selected: ${customRagFile.name}` : "No document selected."}
                    </p>
                </div>
            </CardContent>
          </Card>


            <Card className="glass-dark md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg"><Icons.bookOpenText className="mr-2 h-5 w-5 text-primary" />Simplify Document</CardTitle>
                 <CardDescription className="text-xs pt-1">Upload or paste text from a single document (.txt, .md) to get a simplified summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-upload" className="text-sm font-medium">Upload Document</Label>
                  <Input id="document-upload" type="file" onChange={handleFileChangeForSummary} accept=".txt,.md" className="mt-1"/>
                </div>
                <Textarea
                  placeholder="Or paste document text here..."
                  value={documentTextForSummary}
                  onChange={e => {
                    setDocumentTextForSummary(e.target.value);
                    if (documentFileForSummary) setDocumentFileForSummary(null); 
                  }}
                  rows={6}
                  className="text-sm"
                />
                <Button onClick={handleSummarizeDocument} disabled={isSummarizing || !documentTextForSummary.trim()} className="w-full">
                  {isSummarizing ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    'Summarize Document'
                  )}
                </Button>
                {isSummarizing && !summaryResult && <div className="flex justify-center items-center pt-4"><Icons.loader className="h-8 w-8 animate-spin text-primary" /></div>}
                {summaryResult && (
                  <ScrollArea className="h-[150px] mt-4 pr-3 -mr-3">
                    <div className="p-3 border border-border/70 rounded-lg bg-background/40 glass">
                      <p className="font-semibold text-base">Summary:</p>
                      <p className="text-sm whitespace-pre-wrap">{summaryResult.summary}</p>
                    </div>
                  </ScrollArea>
                )}
                 {!isSummarizing && !summaryResult && !documentTextForSummary.trim() && <p className="text-muted-foreground text-sm text-center pt-2">Upload or paste a document to get a summary.</p>}
              </CardContent>
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
