import React, { useState } from 'react'; 
import axios from 'axios'; 

const Chat = ({ currentUser, recipient, setRecipient }) => { 
    const [password, setPassword] = useState(''); 
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 
    const [error, setError] = useState(''); 

    const fetchChat = async () => { 
        try { 
            const response = await axios.post('/chat', { 
                from: currentUser, 
                to: recipient, 
                password 
            }); 
            setMessages(response.data); 
            setError(''); 
        } catch (err) { 
            setError('Failed to fetch chat. Check password.'); 
        } 
    }; 

    const sendMessage = async () => { 
        await axios.post('/send', { 
            from: currentUser, 
            to: recipient, 
            text: newMessage 
        }); 
        setNewMessage(''); 
        fetchChat(); // Refresh chat after sending 
    }; 

    return ( 
        <div> 
            <input  
                type="password" 
                placeholder="Enter password to view chat" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            /> 
            <button onClick={fetchChat}>View Chat</button> 
            <button onClick={fetchChat}>Refresh Chat</button> 

            {error && <p style={{ color: 'red' }}>{error}</p>} 

            <div> 
                {messages.map((msg, index) => ( 
                    <p key={index}><b>{msg.from}:</b> {msg.text}</p> 
                ))} 
            </div> 

            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
            /> 
            <button onClick={sendMessage}>Send</button> 
            <button onClick={() => setRecipient(null)}>Back to User Selection</button> 
        </div> 
    ); 
}; 

export default Chat;
