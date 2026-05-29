import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import axios from 'axios';
import toast from 'react-hot-toast';


const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

 const deleteUser = async (userId) => {
  try {
    await axios.delete(`/api/auth/${userId}`); // Matches backend route
    toast.success('User deleted');
    getUsers(); // Refresh user list
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete user');
  }
};


  return (
    <div
      className={`bg-[#1e1e2f] h-full p-5 overflow-y-scroll text-white border-r border-gray-700 shadow-xl ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={assets.sidebar_icon}
              alt="logo"
              className="w-8 h-8 filter icon-white"
            />
            <p className="text-lg font-semibold">ChatBox</p>
          </div>

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="h-5 w-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#2a2a40] border border-gray-600 text-white hidden group-hover:block shadow-md">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm hover:text-violet-300"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => logout()}
                className="cursor-pointer text-sm hover:text-red-300"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-[#2f2f44] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-3 filter brightness-0 invert"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search User..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 flex-1"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col mt-2">
        {filteredUsers.map((user, index) => {
          let pressTimer;

          const handleMouseDown = () => {
            pressTimer = setTimeout(() => {
              if (window.confirm(`Delete ${user.fullName}?`)) {
                deleteUser(user._id);
              }
            }, 800);
          };

          const handleMouseUp = () => clearTimeout(pressTimer);

          return (
            <div
              key={index}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0
                }));
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className={`relative flex items-center gap-3 p-2 pl-4 rounded-lg cursor-pointer transition-colors ${
                selectedUser?._id === user._id
                  ? 'bg-[#3d3d5c]'
                  : 'hover:bg-[#2f2f44]'
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className="w-[35px] aspect-square rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p className="font-medium">{user.fullName}</p>
                <span
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>

              {unseenMessages[user._id] > 0 && (
                <span className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-blue-500 text-white font-semibold">
                  {unseenMessages[user._id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
