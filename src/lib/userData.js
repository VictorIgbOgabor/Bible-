import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// ---- Profile ----

export async function ensureUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || "Friend",
      email: user.email || null,
      photoURL: user.photoURL || null,
      translation: "web",
      streak: 0,
      lastReadDate: null,
      notificationsEnabled: false,
      reminderTime: "07:00",
      createdAt: serverTimestamp(),
    });
  }
  return ref;
}

export function watchProfile(uid, cb) {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    cb(snap.exists() ? snap.data() : null);
  });
}

export async function updateProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

// ---- Reading progress / streak ----

export async function markChapterRead(uid, reference) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const data = snap.data() || {};
  const today = new Date().toISOString().slice(0, 10);
  let streak = data.streak || 0;

  if (data.lastReadDate !== today) {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    streak = data.lastReadDate === yesterday ? streak + 1 : 1;
    await updateDoc(userRef, { streak, lastReadDate: today });
  }

  await addDoc(collection(db, "users", uid, "history"), {
    reference,
    readAt: serverTimestamp(),
  });

  return streak;
}

// ---- Notes ----

export function watchNotes(uid, cb) {
  const q = query(
    collection(db, "users", uid, "notes"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export async function addNote(uid, reference, text) {
  await addDoc(collection(db, "users", uid, "notes"), {
    reference,
    text,
    createdAt: serverTimestamp(),
  });
}

export async function deleteNote(uid, noteId) {
  await deleteDoc(doc(db, "users", uid, "notes", noteId));
}

// ---- Prayers ----

export function watchPrayers(uid, cb) {
  const q = query(
    collection(db, "users", uid, "prayers"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export async function addPrayer(uid, text) {
  await addDoc(collection(db, "users", uid, "prayers"), {
    text,
    answered: false,
    createdAt: serverTimestamp(),
  });
}

export async function togglePrayerAnswered(uid, prayerId, answered) {
  await updateDoc(doc(db, "users", uid, "prayers", prayerId), { answered });
}

export async function deletePrayer(uid, prayerId) {
  await deleteDoc(doc(db, "users", uid, "prayers", prayerId));
}

// ---- Reading plans ----

export async function startPlan(uid, planId, title) {
  await setDoc(doc(db, "users", uid, "plans", planId), {
    title,
    startedAt: serverTimestamp(),
    progress: 0,
    completed: false,
  });
}

export async function advancePlan(uid, planId, progress, totalDays) {
  await updateDoc(doc(db, "users", uid, "plans", planId), {
    progress,
    completed: progress >= totalDays,
  });
}

export function watchPlans(uid, cb) {
  return onSnapshot(collection(db, "users", uid, "plans"), (snap) => {
    const map = {};
    snap.docs.forEach((d) => (map[d.id] = d.data()));
    cb(map);
  });
}
