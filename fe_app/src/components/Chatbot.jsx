import React from 'react'
import { useState } from 'react'


const Chatbot = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* icon */}
      <div id='chatbot' onClick={() => setIsActive(!isActive)}>
        <i class="fa-regular fa-comment-dots"></i>
      </div>

      {/* chat */}
      {
        (isActive)
          ? (<div id='chatbot-modal' className='p-2'>
            <div className='chatbot-header d-flex justify-content-between p-2 align-items-center'>
              <h2> Parla con noi</h2>
              <i class="fa-solid fa-xmark cursor-pointer" onClick={() => setIsActive(!isActive)}></i>
            </div>

            <div className='chatbot-body'>
              <div className='d-flex justify-content-start w-100'>
                <p className='bot-msg p-1'>in che modo posso esserti utile modo posso esserti utile modo posso esserti utile?</p>
              </div>
              <div className='d-flex justify-content-end w-100'>
                <p className='user-msg text-end p-1'>io sono l'utente </p>
              </div>
            </div>

            <div className='chatbot-footer d-flex justify-content-between align-items-center py-2 gap-1'>
              <input type="text" placeholder='Type your message here...' className='input-msg' />
              <button className='btn-msg'><i class="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>
          ) : (null)
      }
    </>


  )
}

export default Chatbot
