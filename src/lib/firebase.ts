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
import { Article, Event, SiteSettings, Comment } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connection Test
async function testConnection() {
  try {
    const testDoc = doc(db, 'test_connection', 'ping');
    await getDoc(testDoc); // Use cached getDoc first
    console.log(`Firebase: Connected to project ${firebaseConfig.projectId} (DB: ${(firebaseConfig as any).firestoreDatabaseId || 'default'})`);
  } catch (error: any) {
    // If it's just a permission error on an empty DB, we don't want to spam the user interface
    if (error.code === 'permission-denied') {
      console.log("Firebase: Readiness test - Waiting for first content or admin login.");
    } else {
      console.error("Firebase Connection Note:", error.message);
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
  },

  // Settings
  async getSettings(): Promise<SiteSettings | null> {
    const d = await getDoc(doc(db, 'settings', 'global'));
    return d.exists() ? d.data() as SiteSettings : null;
  },

  async saveSettings(settings: SiteSettings): Promise<void> {
    await setDoc(doc(db, 'settings', 'global'), settings);
  },

  // Comments management
  async getAllComments(): Promise<Comment[]> {
    const snapshot = await getDocs(collection(db, 'comments'));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Comment));
  },

  async deleteComment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'comments', id));
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
