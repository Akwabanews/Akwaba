import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Article, Event } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection Test
async function testConnection() {
  try {
    const testDoc = doc(db, 'test_connection', 'ping');
    await getDocFromServer(testDoc);
    console.log("Firebase: Connection verified.");
  } catch (error: any) {
    console.error("Firebase Connection Error:", error);
    
    if (error.code === 'permission-denied') {
      console.warn("Firebase: Accès refusé. C'est normal si vous n'êtes pas connecté ou si les règles sont strictes.");
    } else if (error.code === 'not-found' || error.message?.includes('database')) {
      console.error("Firebase: Base de données Firestore non trouvée. Avez-vous cliqué sur 'Créer une base de données' dans la console Firebase ?");
    } else {
      console.error("Firebase: Erreur de connexion. Vérifiez votre configuration ou la création de la base de données Firestore dans la console.");
    }
  }
}
testConnection();

// --- Firestore Services ---

export const FirestoreService = {
  // Articles
  async getArticles(): Promise<Article[]> {
    const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() } as Article));
  },

  async saveArticle(article: Article): Promise<void> {
    await setDoc(doc(db, 'articles', article.id), article);
  },

  async deleteArticle(id: string): Promise<void> {
    await deleteDoc(doc(db, 'articles', id));
  },

  // Events
  async getEvents(): Promise<Event[]> {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() } as Event));
  },

  async saveEvent(event: Event): Promise<void> {
    await setDoc(doc(db, 'events', event.id), event);
  },

  async deleteEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'events', id));
  }
};

// --- Auth Utilities ---
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
