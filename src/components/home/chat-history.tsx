
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function ChatHistory() {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [user]);

  const handleChatClick = (chat) => {
    router.push(`/assistant?chatId=${chat.id}`);
  };

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          className="p-2 hover:bg-accent rounded cursor-pointer"
          onClick={() => handleChatClick(chat)}
        >
          <div className="font-medium">{chat.query}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(chat.createdAt?.toDate()).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
