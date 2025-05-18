'use client';

import {UnifiedLegalAssistant} from '@/components/home/unified-legal-assistant';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    if (chatId) {
      const fetchChat = async () => {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          setChatData(chatDoc.data());
        }
      };
      fetchChat();
    }
  }, [chatId]);
  return (
    <UnifiedLegalAssistant />
  );
}
