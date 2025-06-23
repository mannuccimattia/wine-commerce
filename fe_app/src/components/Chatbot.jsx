import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // Carica i messaggi da sessionStorage al primo render
  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    if (isActive && bodyRef.current) {
      setTimeout(() => {
        // gli dico di attendere 0 secondi prima di scrollare in fondo per aspettare il rendering dei messaggi
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }, 0);
    }
  }, [isActive]);

  // Salva i messaggi ogni volta che cambiano nel local storage
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    // Scroll automatico in fondo
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const value = inputRef.current.value.trim();
    if (value !== '') {
      const newMessage = {
        sender: 'user',
        text: value
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      inputRef.current.value = '';
      setLoading(true); // <-- set loading to true

      // Prepare history for backend (all previous turns)
      const history = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      try {
        const res = await axios.post('http://localhost:3000/api/chat', {
          history,
          message: value
        });
        if (res.data.reply) {
          setMessages([...updatedMessages, { sender: 'bot', text: res.data.reply }]);
        }
      } catch (err) {
        setMessages([...updatedMessages, { sender: 'bot', text: "Errore nella risposta AI." }]);
      } finally {
        setLoading(false); // <-- set loading to false
      }
    }
  };

  const onEnter = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* icon */}
      <div id='chatbot' className='p-3' onClick={() => setIsActive(!isActive)}>
        <i className="fa-regular fa-comment-dots" id='chatbot-icon'></i>
      </div>

      {/* chat */}
      {
        isActive &&
        <div id='chatbot-modal' className='p-2'>
          <div className='chatbot-header d-flex justify-content-between p-2 align-items-center'>
            <h5 className='m-0'>✨ Digital Sommelier</h5>
            <i
              className="fa-solid fa-minus cursor-pointer" onClick={() => setIsActive(false)}
            ></i>
          </div>

          <div className='chatbot-body' ref={bodyRef}>
            {/* messaggio iniziale */}
            <div className='d-flex justify-content-start w-100'>
              <p className='bot-msg p-1'>
                Welcome to Boolze!<br />
                I am your digital sommelier and assistant.<br />
                How can I help you today?
              </p>
            </div>
            {/* messaggi dinamici */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} w-100`}
              >
                <div className={`${msg.sender === 'user' ? 'user-msg' : 'bot-msg'} p-1`}>
                  {msg.sender === 'bot'
                    ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                    : msg.text}
                </div>
              </div>
            ))}
            {/* Show "thinking..." while waiting for response */}
            {loading && (
              <div className="d-flex justify-content-start w-100">
                <p className="bot-msg p-1" style={{ opacity: 0.7 }}>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  Thinking...
                </p>
              </div>
            )}
          </div>

          <div className='chatbot-footer d-flex justify-content-between align-items-center py-2 gap-1'>
            <input
              type="text"
              data-bs-theme="dark"
              placeholder='Type your message here...'
              className='input-msg'
              id='input-msg'
              onKeyDown={onEnter}
              ref={inputRef}
            />
            <button
              className='btn-msg'
              onClick={sendMessage}>
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default Chatbot;
