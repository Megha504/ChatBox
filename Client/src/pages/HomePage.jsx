import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div className="w-screen h-screen bg-transparent">
      <div
        className={`w-full h-full backdrop-blur-lg bg-white/60 border border-gray-300 shadow-lg overflow-hidden grid grid-cols-1 
          ${selectedUser
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'md:grid-cols-2'}
        `}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
