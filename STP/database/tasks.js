import { db, auth, isConfigured } from '../backend/firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const fetchTasks = async () => {
  if (!isConfigured || !db || !auth?.currentUser) {
    return [];
  }
  const userId = auth.currentUser.uid;
  const q = query(collection(db, 'tasks'), where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  
  const tasks = snapshot.docs.map(docSnapshot => ({
    id: docSnapshot.id,
    ...docSnapshot.data()
  }));

  // Sort by created_at descending (newest first)
  tasks.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return tasks;
};

export const createTask = async (taskData) => {
  if (!isConfigured || !db || !auth?.currentUser) {
    throw new Error('Database is not connected. Please check your Firebase configuration.');
  }
  const payload = {
    title: taskData.title,
    priority: taskData.priority || 'medium',
    due_date: taskData.due_date || null,
    status: taskData.status || 'todo',
    user_id: auth.currentUser.uid,
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'tasks'), payload);
  return { id: docRef.id, ...payload };
};

export const updateTask = async (id, taskData) => {
  if (!isConfigured || !db) {
    throw new Error('Database is not connected.');
  }
  const docRef = doc(db, 'tasks', id);
  const payload = {};
  if (taskData.title !== undefined) payload.title = taskData.title;
  if (taskData.priority !== undefined) payload.priority = taskData.priority;
  if (taskData.due_date !== undefined) payload.due_date = taskData.due_date;
  if (taskData.status !== undefined) payload.status = taskData.status;

  await updateDoc(docRef, payload);
  return { id, ...taskData };
};

export const deleteTask = async (id) => {
  if (!isConfigured || !db) {
    throw new Error('Database is not connected.');
  }
  const docRef = doc(db, 'tasks', id);
  await deleteDoc(docRef);
};
