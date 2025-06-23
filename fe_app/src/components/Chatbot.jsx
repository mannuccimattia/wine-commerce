import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  // lo useRef viene utilizzato per accedere agli elementi DOM direttamente

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
            <h4> Chat with Us</h4>
            <i className="fa-solid fa-xmark cursor-pointer" onClick={() => setIsActive(false)}></i>
          </div>

          <div className='chatbot-body' ref={bodyRef}>
            {/* messaggio iniziale */}
            <div className='d-flex justify-content-start w-100'>
              <p className='bot-msg p-1'>In che modo posso esserti utile?</p>
            </div>
            {/* messaggi dinamici */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} w-100`}
              >
                <p className={`${msg.sender === 'user' ? 'user-msg' : 'bot-msg'} p-1`}>
                  {msg.sender === 'bot'
                    ? <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</pre>
                    : msg.text}
                </p>
              </div>
            ))}
          </div>

          <div className='chatbot-footer d-flex justify-content-between align-items-center py-2 gap-1'>
            <input
              type="text"
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
