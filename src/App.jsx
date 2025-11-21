import React, { useState } from 'react';
import Login from './components/Login';
import UserSelection from './components/UserSelection';
import Chat from './components/Chat';

// IMPORTANT: Replace this with your actual Vercel deployment URL
const API_URL = 'https://your-project-name.vercel.app/api'; 

function App() {
  const [user, setUser] = useState(null);
  const [recipient, setRecipient] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setRecipient(null);
  };

  const selectChat = (selectedRecipient) => {
    setRecipient(selectedRecipient);
  };

  return (
    <div className="container">
      <h1>Simple Chat Application</h1>
      {user && (
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span>Logged in as: <strong>{user}</strong></span>
          <button onClick={handleLogout} className="logout-button" style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      )}

      {!user ? (
        <Login onLogin={handleLogin} apiUrl={API_URL} />
      ) : !recipient ? (
        <UserSelection onSelectChat={selectChat} />
      ) : (
        <Chat currentUser={user} recipient={recipient} setRecipient={setRecipient} apiUrl={API_URL} />
      )}
    </div>
  );
}

export default App;
