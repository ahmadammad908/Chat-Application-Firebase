
import React, { useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { getTheme, isIos, setTheme } from "../src/Utils/Utils";
import { IonApp, IonRouterOutlet, setupIonicReact, IonFooter } from '@ionic/react';
import { IonBackButton, IonButton, IonButtons, IonIcon, IonMenuButton, IonTitle, IonToolbar, IonHeader } from '@ionic/react';

import { create, ellipsisHorizontal, ellipsisVertical, helpCircle, search, personCircle, star, logOut } from 'ionicons/icons';



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

const mode = new URLSearchParams(window.location.search).get("mode");

if (mode) {
  setupIonicReact({
    mode: mode,
  });
} else {
  // If android, use md mode
  if (!isIos()) {
    setupIonicReact({
      mode: "md",
    });
  } else {
    // iOS everywhere else
    setupIonicReact({
      mode: "ios",
    });
  }
}

setTheme(getTheme());




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
    <>
      <IonToolbar color="dark">
        <IonButtons slot="secondary">
          <a href="mailto: ahmadammad.me789@gmail.com">
            <IonButton fill="solid">
              <IonIcon slot="start" icon={personCircle}></IonIcon>
              Contact
            </IonButton>
          </a>
        </IonButtons>
        <IonButtons slot="primary">
          <a href="mailto: ahmadammad.me789@gmail.com">
            <IonButton fill="solid"
            >
              Report
              <IonIcon slot="end" icon={helpCircle}></IonIcon>
            </IonButton>
          </a>
        </IonButtons>
        <IonTitle>Random Chats</IonTitle>
      </IonToolbar>
      <div className="flex flex-col justify-center items-center  app">

        <h1 className="font-bold mb-6" style={{ fontSize: '50px', color: "#333333" }}>
          Gup Shup
        </h1>
        <div className="flex items-center justify-center z-20 sign-in space-x-4">


          <IonButton onClick={signInWithGoogle} size="default" color={"dark"}>
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              alt="Google Icon"
              width={"10%"}
              style={{ marginRight: "10px" }}
            />
            <span style={{ display: "block", marginTop: "3px" }}>    Sign in with Google
            </span>
          </IonButton>
        </div>

        <p style={{ color: "#333333", marginTop: "25px", }} className='font-bold text-center'>Do not violate the community guidelines or you will be banned for life!</p>
        <IonFooter slot='fixed' className='footer'>
          <IonToolbar color='dark' >
            <IonTitle className='md:text-start text-center' >Gup Shup ⚛️🔥💬</IonTitle>
            <IonTitle slot='end' className='hidden md:block'>© 2024 Gup Shup 💬</IonTitle>


          </IonToolbar>
        </IonFooter>
      </div >

    </>

  );
}

function SignOut() {
  return (
    auth.currentUser && (
      // <div >
      //   <header className='App'>
      //     <h1>⚛️🔥💬</h1>

      //     <button onClick={() => signOut(auth)} className="sign-out text-black font-bold"  >
      //       Sign Out
      //     </button>
      //   </header>
      // </div>
      <>
      
      <IonToolbar color={"dark"}>
        <IonButtons slot="secondary" >
        <IonButton>Gup Shup ⚛️🔥💬</IonButton>

        </IonButtons>
        <IonButtons slot="primary" >
          <IonButton fill="solid" color={"danger"}>
            Sign Out
            <IonIcon slot="end" icon={create}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>

      </>
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
      <div className="messages"
      >
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
        <button disabled={!formValue}>Send </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://via.placeholder.com/40'} alt="User" width={"60px"} />
      <p >{text}</p>
    </div>
  );
}

export default App;















