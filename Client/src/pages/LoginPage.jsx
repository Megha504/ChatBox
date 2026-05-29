import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const clearForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmitted(false);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    if (currState === "Sign up") {
      login("signup", { fullName, email, password, bio });
    } else {
      login("login", { email, password });
    }
  };

  const switchMode = (mode) => {
    setCurrState(mode);
    clearForm();
  };

  return (
    <div className='min-h-screen bg-[#0D0C1D] text-white flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col'>
      {/* Left */}
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src={assets.sidebar_icon}
          alt="logo"
          className="w-[min(20vw,200px)] icon-white"
        />
        <p className="text-4xl font-semibold text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.6)]">ChatBox</p>
      </div>

      {/* Right */}
      <form onSubmit={onSubmitHandler} className='border border-[#3f3f46] bg-[#1A1A2E] p-6 flex flex-col gap-6 rounded-lg shadow-xl w-[min(90%,400px)]'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && currState === "Sign up" && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className='w-5 cursor-pointer'
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            required
            className="p-2 bg-[#2E2E48] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        )}

        {!isDataSubmitted || currState === "Login" ? (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 bg-[#2E2E48] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 bg-[#2E2E48] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </>
        ) : null}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder='Provide a short bio...'
            required
            className="p-2 bg-[#2E2E48] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        )}

        <button
          type="submit"
          className='py-3 bg-gradient-to-r from-indigo-400 to-purple-300 rounded-md cursor-pointer hover:opacity-90 transition-opacity duration-300'
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        

        <div className="flex flex-col gap-2 text-sm">
          {currState === "Sign up" ? (
            <p className="text-gray-200">
              Already have an account?{" "}
              <span
                onClick={() => switchMode("Login")}
                className="text-violet-300 font-medium cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-200">
              Create an account{" "}
              <span
                onClick={() => switchMode("Sign up")}
                className="text-violet-300 font-medium cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
