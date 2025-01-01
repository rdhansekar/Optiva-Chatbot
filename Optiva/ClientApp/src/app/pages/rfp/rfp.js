// src/Chatbot.js
import React, { useState } from 'react';
import './rfp.css';
import { postdata } from '../../../service/httputlity';
import { PageTitle } from '../../../_metronic/layout/core';

const RFP = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const newMessages = [...messages, { text: input, user: 'user' }];
      setMessages(newMessages);
      setInput('');
      postdata("rfp", JSON.stringify({ Message: input })).then((d) => {
        if (d) {
          const botReply = { text: d.data, user: 'bot' };
          setMessages([...newMessages, botReply]);
        }
      }, (rej) => {
        console.log(rej)
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
 const rfpsBreadCrumbs = [
      {
        title: 'Home >',
        path: '/home',
        isSeparator: false,
        isActive: false,
      },
      {
        title: '',
        path: '',
        isSeparator: true,
        isActive: false,
      },
    ]
  return (
    <div className='row h-100'>
       <PageTitle breadcrumbs={rfpsBreadCrumbs}>RFP Chat</PageTitle>
        <div className='col-md-8 h-100'>
        <div className="chatbot-container">
           <div className='chat-header'>
               <h3 class="card-title">Bid/No-Bid Guide: Save Time and Increase RFP Success</h3>
                </div>
            <div className="chat-window">
             
                <div className="messages h-100">
                  {messages && messages.length > 0 ? messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.user === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                      {message.text.split('<br/>').map((m, i) => (
                        <p>{m}</p>
                      ))}
                    </div>
                  )) : <div class="titleBar m-auto">
                  <div class="mb-5 text-center">
                    <span className='fs-2'>Hello!! I'm here to help you with any RFP questions.</span><br></br>
                    <span className='text-muted fs-4'> Please go ahead and ask your first question.</span></div>
                  </div>}
                </div>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
          </div>
        </div>
      <div className='col-md-4'>
        <div class="card align-items-center">
           <img src='/media/illustrations/sigma-1/17.png' alt='' width="60%"/>
          <div class="card-body px-3">
            <h4 class="card-title">What's Coming Next</h4>
           <ul class="list-group">
              <li class="list-group-item fs-6 py-3">Input an Excel and get output as an Excel (beta) </li>
              <li class="list-group-item fs-6 py-3">Reinforced Learning </li>
              <li class="list-group-item fs-6 py-3">UI to upload Training Data</li>
          </ul>
          </div>
          <img src='/media/illustrations/files.jpg' alt='' width="40%"/>
        </div>
      
        <div className='bg-white flex-column d-flex align-items-center justify-content-center'>
          
        </div>
       </div>
    </div>
    
  );
};

export default RFP;
