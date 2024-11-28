
import React, { useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button } from 'flowbite-react';
// import AppleLogin from 'react-apple-login'


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ_nOGhr_tlYzwDnGTQWDtodSYrp_D9zA",
  authDomain: "chat-app-292fa.firebaseapp.com",
  projectId: "chat-app-292fa",
  storageBucket: "chat-app-292fa.appspot.com",
  messagingSenderId: "487201513938",
  appId: "1:487201513938:web:343597a3813b278bf1e80b",
  measurementId: "G-F8DCLBV33R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="app">
      <header>{user && <SignOut />}</header>
      <div className="content">{user ? <ChatRoom /> : <SignIn />}</div>
    </div>
  );
};

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => console.error('Error signing in with Google:', error));
  };

  const signInWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful sign-in
        console.log('Signed in with Apple:', result.user);
      })
      .catch((error) => {
        console.error('Error signing in with Apple:', error);
      });
  };


  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold mb-6 text-white" style={{ fontSize: '50px' }}>
        Gup Shup
      </h1>
      <Button.Group outline>
        <Button
          color="gray"
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2"
        >
          <img
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            width="20px"
            alt="Google Icon"
            className="flex-shrink-0 mr-2"
          />
          <span className="flex-1 text-center">Sign In with Google</span>
        </Button>

        {/* <Button style={{ background: "black" }}>
          <AppleLogin
            className="flex items-center gap-2 px-4 py-2"

            clientId="com.react.apple.login" // Replace with your actual client ID
            redirectURI="https://test-authw.netlify.app" // Replace with your actual redirect URI

          />
        </Button> */}

      </Button.Group>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="btn signout" onClick={() => signOut(auth)}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue('');
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          className="message-input"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message"
        />
        <button className="send-btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://via.placeholder.com/40'} alt="User" />
      <p>{text}</p>
    </div>
  );
}

export default App;
