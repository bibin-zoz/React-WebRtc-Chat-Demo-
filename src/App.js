import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Reference to the WebSocket
  const socketRef = useRef(null);

  // Simulate current user's ID
  const currentUserID = 123; // Replace with the actual current user's ID

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket('ws://localhost:8080/ws?group_id=1');
  
    socketRef.current.onopen = () => {
      console.log('WebSocket connection established.');
    };
  
    socketRef.current.onmessage = (event) => {
      try {
        // Attempt to parse the message as JSON
        const receivedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (e) {
        // If JSON parsing fails, treat it as plain text
        console.error('Error parsing message:', e);
      }
    };
  
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  console.log(messages)
    // Cleanup function to close the WebSocket connection
    return () => {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [messages]); // Empty dependency array to run only on mount

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        sender_id: currentUserID, // Include sender ID in the message
        message: messageInput,
        timestamp: new Date().toISOString(),
      };
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
        // Display the sent message immediately
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        console.error('WebSocket connection is not open.');
      }
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender_id === currentUserID ? 'sent' : 'received'}`}>
              <span className="message-sender">{message.sender_id === currentUserID ? 'You' : `User ${message.sender_id}`}: </span>
              {message.message} {/* Displaying message text */}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
