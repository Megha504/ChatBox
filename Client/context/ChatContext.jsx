import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext); // Ensure we get authUser here

  // Get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get messages for selected user
const getMessages = async (userId) => {
  if (!authUser) return;

  try {
    const { data } = await axios.get(`/api/messages/${userId}`);
    if (data.success) {
      const visibleMessages = data.messages.filter(
        (msg) => !msg.deletedBy.includes(authUser._id)
      );
      setMessages(visibleMessages);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  // Send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete message (soft delete for the current user)
  const deleteMessage = async (messageId) => {
    try {
      const { data } = await axios.delete(`/api/messages/${messageId}`);
      if (data.success) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to real-time messages
  const subscribeToMessages = async () => {
  if (!socket || !authUser) return;

  socket.on("newMessage", (newMessage) => {
    if (newMessage.deletedBy && newMessage.deletedBy.includes(authUser._id)) return;

    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      axios.put(`/api/messages/mark/${newMessage._id}`);
    } else {
      setUnseenMessages((prevUnseenMessages) => ({
        ...prevUnseenMessages,
        [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
          ? prevUnseenMessages[newMessage.senderId] + 1
          : 1,
      }));
    }
  });
};


  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]); 

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    deleteMessage, // ✅ make sure it's exported
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
