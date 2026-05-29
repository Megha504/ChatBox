import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  return selectedUser && (
   <div className={`bg-[#21213b] text-white w-full relative overflow-y-scroll border-l border-[#2e2e48] shadow-inner ${selectedUser ? "max-md:hidden" : ""}`}>

      
      {/* User Info */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className='w-20 aspect-[1/1] rounded-full object-cover'
        />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
          {selectedUser.fullName}
        </h1>
        {onlineUsers.includes(selectedUser._id) && <p className='px-5 mx-auto text-gray-300'>{selectedUser.bio}</p>}
      </div>

      {/* Divider */}
      <hr className="border-[#ffffff22] my-4" />

      {/* Media Section */}
      <div className='px-5 text-sm'>
        <p className='text-gray-300 font-medium'>Media</p>
        <div className='mt-2 max-h-[300px] overflow-y-scroll grid grid-cols-2 gap-4'>
          {msgImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded overflow-hidden'>
              <img src={url} alt="" className='h-full w-full rounded-md object-cover border border-gray-600' />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => logout()}
        className='absolute mt-5 bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-400 to-purple-300 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:opacity-90 transition'
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
