
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
    <div className="App">
      {user && <SignOut />}
      <section >{user ? <ChatRoom /> : <SignIn />}</section>
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
    <div className="flex flex-col justify-center items-center h-screen gredient">
      <h1 className="font-bold mb-6 text-white" style={{ fontSize: '50px' }}>
        Gup Shup
      </h1>
      <div className="flex items-center  justify-center z-20 sign-in">
        <img
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
          alt="Google Icon"
          className="w-9 h-9"
          style={{ marginLeft: "20px", zIndex: "30" }}
        />
        <button className=" font-bold bg-white text-black " onClick={signInWithGoogle}
          style={{ marginLeft: "-20px", paddingBottom: "16px", border: "none" }}
        >
          Sign in with Google
        </button>
      </div>
      <p style={{ marginTop: "10px" }}>Do not violate the community guidelines or you will be banned for life!</p>


      {/* <Button style={{ background: "black" }}>
          <AppleLogin
            className="flex items-center gap-2 px-4 py-2"

            clientId="com.react.apple.login" // Replace with your actual client ID
            redirectURI="https://test-authw.netlify.app" // Replace with your actual redirect URI

          />
        </Button> */}


    </div >
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <div >
        <header className='App'>
          <h1>⚛️🔥💬</h1>

          <button onClick={() => signOut(auth)} className="sign-out text-white font-bold"  >
            Sign Out
          </button>
        </header>
      </div>
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
      <div className="messages" style={{  paddingLeft:"-20px" }}>
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
        <img src='https://img.icons8.com/?size=100&id=hSL03nbSErZD&format=png&color=000000' className="send-btn" style={{cursor:"pointer"}}/>
     
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://via.placeholder.com/40'} alt="User"  width={"60px"} style={{borderRadius:"50%", marginLeft:"20px" , padding:"10px"}}/>
      <p >{text}</p>
    </div>
  );
}

export default App;















