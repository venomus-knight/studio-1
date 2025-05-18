'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useHistory } from '@/contexts/history-context';
import { getUserQueryHistory, QueryHistoryItem } from '@/services/history-service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function HistorySidebar() {
  const { user, isDemo } = useAuth();
  const { refreshTrigger } = useHistory();
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  if (isDemo || !user) {
    return null;
  }

  return (
    <div className="w-64 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Query History</h2>
      </div>
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <p>Loading history...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="p-2 space-y-2">
            {history.map((item) => (
              <div key={item.id} className="p-3 border rounded-md hover:bg-accent cursor-pointer">
                <p className="font-medium truncate">{item.query}</p>
                <p className="text-xs text-muted-foreground">
                  {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>No query history yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}