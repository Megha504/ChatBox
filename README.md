## Project Overview
Chatbox is a full-stack MERN real-time chat application. It provides a secure, fast, and scalable environment for instant messaging, featuring JWT-based authentication and persistent message storage.

## Key Features
*  Real-Time Communication: Powered by Socket.io for bidirectional, event-based data transfer.
*  Secure Authentication: JWT (JSON Web Token) implementation for protected routes and user sessions.
*  Media Handling: Integration with Cloudinary for efficient image/file uploads.
*  Persistent Storage: MongoDB and Mongoose for robust data modeling of users and chat history.

## Tech Stack
* Frontend: React, Vite, Tailwind CSS, Axios.
* Backend: Node.js, Express.js, Socket.io.
* Database: MongoDB, Mongoose.
* Cloud Services: Cloudinary (Media storage).

## Project Structure
```text
chatbox/
├── client/                 
│   ├── src/                
│   │   ├── pages/          
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── App.jsx        
│   │   ├── index.css       
│   │   └── main.jsx        
│   ├── .gitignore          
│   ├── eslint.config.js    
│   ├── index.html          
│   ├── package.json       
│   └── vite.config.js      
├── server/                 
│   ├── controllers/        
│   ├── lib/                
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── utils.js
│   ├── middleware/         
│   │   └── auth.js
│   ├── models/             
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/            
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── package.json       
│   └── server.js                         
```
## Local Setup
1. Clone the Repository
```text
git clone https://github.com/Megha504/chatbox.git
cd chatbox
```
2. Backend Setup
```text
cd server
npm install
# Create a .env file and add your MONGO_URI, JWT_SECRET, and CLOUDINARY_URL
npm start
```
3. Frontend Setup
```text
cd client
npm install
# Create a .env file and add VITE_BACKEND_URL=http://localhost:5000
npm run dev
```
