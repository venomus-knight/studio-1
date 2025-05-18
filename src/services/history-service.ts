import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  DocumentData,
  deleteDoc,
  doc
} from 'firebase/firestore';

export interface QueryHistoryItem {
  id?: string;
  userId: string;
  query: string;
  timestamp: Date;
  lawsResult?: any;
  precedentsResult?: any;
  checklistResult?: any;
}

export async function saveQueryHistory(historyItem: Omit<QueryHistoryItem, 'timestamp'>) {
  try {
    const docRef = await addDoc(collection(db, 'queryHistory'), {
      ...historyItem,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving query history:', error);
    throw error;
  }
}

export async function getUserQueryHistory(userId: string): Promise<QueryHistoryItem[]> {
  try {
    const q = query(
      collection(db, 'queryHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        query: data.query,
        timestamp: data.timestamp.toDate(),
        lawsResult: data.lawsResult,
        precedentsResult: data.precedentsResult,
        checklistResult: data.checklistResult,
      };
    });
  } catch (error) {
    console.error('Error getting user query history:', error);
    throw error;
  }
}

export async function deleteQueryHistoryItem(id: string) {
    try {
      await deleteDoc(doc(db, 'queryHistory', id));
      return true;
    } catch (error) {
      console.error('Error deleting query history item:', error);
      throw error;
    }
  }