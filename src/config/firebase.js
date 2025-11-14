import { message } from "antd";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBynrVba4L_jJAIEexaMw-yEdVpP208f-c",
  authDomain: "devchat-3ec17.firebaseapp.com",
  projectId: "devchat-3ec17",
  storageBucket: "devchat-3ec17.appspot.com",
  messagingSenderId: "603771929932",
  appId: "1:603771929932:web:4fe367e83444ccd9e9fbe9",
  measurementId: "G-6XD9R85B74",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signup = async (userName, email, password) => {
  try {
    // Check if username exists
    const q = query(
      collection(db, "users"),
      where("userName", "==", userName.toLowerCase())
    );
    const existing = await getDocs(q);
    if (!existing.empty) return message.error("Username already taken!");

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      userName: userName.trim().toLowerCase(),
      email,
      name: "",
      bio: "Hey, I'm using devChat!",
      lastSeen: serverTimestamp(),
    });

    message.success("Signup successful!");
    return user;
  } catch (err) {
    `  `;
    console.error("Signup error:", err.message);
    message.error(err.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    message.success("Login successful!");
    return user;
  } catch (err) {
    console.error("Login error:", err.message);
    message.error(err.message);
  }
};

//  Google Sign-in
const googleProvider = new GoogleAuthProvider();
export const googleSignInFn = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const existingDoc = await getDoc(userRef);
  if (!existingDoc.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      userName: user.displayName,
      email: user.email,
      name: "",
      bio: "Hey, I'm using devChat!",
      lastSeen: serverTimestamp(),
    });
  }
  return user;
};

//  GitHub Sign-in
const githubProvider = new GithubAuthProvider();
export const githubSignInFn = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const existingDoc = await getDoc(userRef);

  const userNameToUse =
    user.displayName || user.reloadUserInfo.screenName || "GitHub User";

  if (!existingDoc.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      userName: userNameToUse,
      email: user.email,
      name: "",
      bio: "Hey, I'm using devChat!",
      lastSeen: serverTimestamp(),
    });
  }
  return user;
};

export const getUserData = async (userUid) => {
  try {
    const userRef = doc(db, "users", userUid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) return userSnap.data();
    console.log("User not found");
  } catch (err) {
    console.error(err);
  }
};

// export const getUserChat = async (userUid) => {
//   try {
//     const chatRef = doc(db, "chats", userUid);
//     const chatSnap = await getDoc(chatRef);
//     if (chatSnap.exists()) return chatSnap.data();
//     console.log("Chat not found");
//   } catch (err) {
//     console.error(err);
//   }
// };

// generate chatId
export const getChatId = (uid1, uid2) => {
  return uid1 > uid2 ? uid1 + uid2 : uid2 + uid1;
};

export const sendMessageFn = async (senderUid, receiverUid, text) => {
  try {
    const chatId = getChatId(senderUid, receiverUid);
    const chatDocRef = doc(db, "chats", chatId);
    const messageRef = collection(chatDocRef, "messages");

    await addDoc(messageRef, {
      senderUid,
      receiverUid,
      text,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      chatDocRef,
      {
        users: [senderUid, receiverUid],
        lastMessage: text,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("Message sent!");
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};

export const listenToMessages = (chatId, callback) => {
  const messageRef = collection(db, "chats", chatId, "messages");
  const q = query(messageRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

export const getAllUsers = async () => {
  try {
    const q = collection(db, "users");
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("getAllUsers err", err);
    return []; // Return empty array on error
  }
};

export const logoutFN = async () => {
  await signOut(auth);
};
