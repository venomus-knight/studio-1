'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { useHistory } from '@/contexts/history-context';
import { getUserQueryHistory, QueryHistoryItem, deleteQueryHistoryItem } from '@/services/history-service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, User as UserIcon, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';




export function Navigation() {
  const { user, signOut, isDemo } = useAuth();
  const { refreshTrigger } = useHistory();
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      if (user && !isDemo) {
        setLoading(true);
        try {
          const userHistory = await getUserQueryHistory(user.uid);
          setHistory(userHistory);
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchHistory();
  }, [user, isDemo, refreshTrigger]);

  const toggleHistory = () => {
    setHistoryExpanded(!historyExpanded);
  };

  const handleDeleteHistoryItem = async (id?: string) => {
    if (!id) return;
    
    try {
      await deleteQueryHistoryItem(id);
      // Update the local state to remove the deleted item
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };


  const handleHistoryItemClick = (item: QueryHistoryItem) => {
    // Navigate to assistant page if not already there
    router.push('/assistant');
    
    // Use a custom event to communicate with UnifiedLegalAssistant
    const event = new CustomEvent('restore-query-history', { 
      detail: {
        query: item.query,
        lawsResult: item.lawsResult,
        precedentsResult: item.precedentsResult,
        checklistResult: item.checklistResult
      }
    });
    window.dispatchEvent(event);
  };

  

  return (
    <Sidebar>
      <SidebarTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 md:bg-transparent md:text-foreground md:hover:bg-accent/10" />
      <SidebarContent>
        <SidebarHeader className="text-center p-4">
          <Link href="/" className="flex flex-col items-center space-y-1 group">
            <Image 
              src="/images/Emblem-of-India-01.svg"
              alt="Emblem of India"
              width={48}
              height={48}
              className="text-sidebar-primary group-hover:text-accent"
            />
            <h1 className="font-semibold text-lg mt-2 font-lora text-sidebar-foreground group-hover:text-accent">
              NYAI
            </h1>
          </Link>
          <p className="text-xs text-muted-foreground">AI Legal Assistant</p>
        </SidebarHeader>
        <SidebarSeparator />
        
        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm truncate">{user.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs" 
              onClick={signOut}
            >
              <LogOut className="h-3 w-3 mr-1" /> Sign Out
            </Button>
          </div>
        )}
        
        {/* Query History Section - Only show for authenticated users */}
        {user && !isDemo && (
          <div className="border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full p-4 flex justify-between items-center text-sm font-medium bg-accent/20 hover:bg-accent/30"
              onClick={toggleHistory}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Query History
              </div>
              {historyExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {historyExpanded && (
              <div className="px-4 pb-4">
                <ScrollArea className="h-[200px]">
                  {loading ? (
                    <div className="flex justify-center items-center h-20">
                      <p className="text-xs">Loading history...</p>
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-2 border rounded-md hover:bg-accent/10 cursor-pointer text-xs"
                          onClick={() => handleHistoryItemClick(item)}
                        >
                          <div className="flex items-start">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0 mr-1 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent onClick
                                handleDeleteHistoryItem(item.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p className="font-medium truncate w-[85%]">{item.query}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-xs">
                      <p>No query history yet</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        )}
        
        {isDemo && (
          <div className="p-4 border-b bg-yellow-50 dark:bg-yellow-950">
            <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">Demo Mode</p>
            <p className="text-xs mt-1">Sign in to save your queries and access history.</p>
          </div>
        )}
        
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Enter your legal query or upload a document to get started.
          </p>
        </div>
      </SidebarContent>
      <SidebarFooter className="text-center p-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NYAI
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}