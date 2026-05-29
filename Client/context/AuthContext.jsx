import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Set base backend URL from environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// Create the context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Login function
  const login = async (mode, credentials) => {
  try {
    let payload = {};

    if (mode === "signup") {
      const { fullName, email, password, bio } = credentials;
      payload = { fullName, email, password, bio };
    } else {
      const { email, password } = credentials;
      payload = { email, password }; 
    }

    const { data } = await axios.post(`/api/auth/${mode}`, payload);

    if (data.success) {
      setAuthUser(data.userData);
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } else {
      toast.error(data.message || "Login/signup failed.");
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Server error";
    toast.error(message);
  }
};


  // Logout function
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    if (socket) {
      socket.disconnect();
    }
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
       
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const removeProfilePic = async () => {
  try {
    const { data } = await axios.put("/api/auth/delete-profile-pic"); // or .delete if RESTful
    if (data.success) {
      setAuthUser(prev => ({ ...prev, profilePic: null }));
    }
  } catch (error) {
    toast.error(error.message || "Failed to remove profile picture");
  }
};


  // Connect to socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      auth: {
        userId: userData._id,
      }
    });

    newSocket.connect();
    setSocket(newSocket);

    // Corrected: pass userIds as parameter
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // Check auth on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  // Context value
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    removeProfilePic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
