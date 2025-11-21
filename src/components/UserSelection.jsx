import React, { useState } from 'react';

const UserSelection = ({ onSelectChat }) => {
  const [recipient, setRecipient] = useState('');

  const handleStartChat = () => {
    if (recipient.trim()) {
      onSelectChat(recipient.trim());
    }
  };

  return (
    <div className="form-container">
      <h2>Select a User to Chat With</h2>
      <input
        type="text"
        placeholder="Enter recipient's username"
        value={recipient}
        onChange={(e) => setRecipient(e.value)}
      />
      <button onClick={handleStartChat}>Start Chat</button>
    </div>
  );
};

export default UserSelection;
