
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export function ChatHistory() {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div key={chat.id} className="p-2 hover:bg-accent rounded">
          {chat.title}
        </div>
      ))}
    </div>
  );
}
