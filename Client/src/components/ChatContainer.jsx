import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaTrashAlt } from 'react-icons/fa'; 

import { FaTimes } from 'react-icons/fa';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState('');
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [showHelp, setShowHelp] = useState(false);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className='h-full overflow-hidden relative bg-[#1c1b2c] text-white'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-gray-600'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className='flex-1 text-lg flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden w-6 cursor-pointer' />
   {/* Help Icon */}
<img
  src={assets.help_icon}
  alt="Help"
  className='max-md:hidden w-5 cursor-pointer'
  onClick={() => setShowHelp(true)}
/>

{/* Help Tooltip Box */}
{showHelp && (
  <div className="absolute right-5 top-10 w-65 bg-[#2a273a] text-white border border-gray-600 p-4 rounded-xl shadow-lg z-50">
    {/* Close 'X' icon */}
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm font-semibold">How to use</p>
      <FaTimes
        onClick={() => setShowHelp(false)}
        className="cursor-pointer text-gray-300 hover:text-red-500 transition duration-200 text-sm"
      />
    </div>

    {/* Help Content */}
    <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
      <li>Select a user to start chatting</li>
      <li>Send messages or upload images</li>
      <li>Hover over a message to delete</li>
    </ul>
  </div>
)}


      </div>

      {/* Chat Area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
       {messages.map((msg, index) => {
  const isSender = msg.senderId === authUser._id;
  const isHovered = hoveredMsgId === msg._id;

  return (
    <div
      key={index}
      className={`flex items-end gap-2 justify-end ${!isSender && 'flex-row-reverse'}`}
      onMouseEnter={() => setHoveredMsgId(msg._id)}
      onMouseLeave={() => setHoveredMsgId(null)}
    >
      <div className="relative group">
        {msg.image ? (
          <img
            src={msg.image}
            alt=""
            className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
          />
        ) : (
          <p
            className={`p-2 max-w-[200px] text-sm font-light rounded-lg mb-8 break-words ${
              isSender
                ? 'bg-violet-300/30 text-white rounded-br-none'
                : 'bg-white/10 text-white rounded-bl-none'
            }`}
          >
            {msg.text}
          </p>
        )}

        {/* Show delete icon for both sender and receiver */}
        {isHovered && (
          <button
            onClick={() => {
              if (confirm("Delete this message?")) deleteMessage(msg._id);
            }}
            className="absolute top-1 right-1 text-gray-400 hover:text-red-500 text-sm transition duration-200"
            title="Delete message"
          >
            <FaTrashAlt size={12} />
          </button>
        )}
      </div>

      {/* Avatar + Time */}
      <div className="text-center text-xs">
        <img
          src={
            isSender
              ? authUser?.profilePic || assets.avatar_icon
              : selectedUser?.profilePic || assets.avatar_icon
          }
          alt=""
          className="w-7 h-7 rounded-full object-cover"
        />
        <p className="text-gray-400">{formatMessageTime(msg.createdAt)}</p>
      </div>
    </div>
  );
})}

        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-[#2a273a] border-t border-gray-700'>
        <div className='flex-1 flex items-center bg-[#3a3750] px-3 rounded-full'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder="Send a message"
            className='flex-1 text-sm p-3 bg-transparent outline-none text-white placeholder-gray-400'
          />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-300 bg-[#1c1b2c] max-md:hidden'>
      <img src={assets.sidebar_icon} className='max-w-16 filter icon-white' alt="" />
      <p className='text-lg font-medium'>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
