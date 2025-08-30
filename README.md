# Chat-App

Real-time chat application built with **React (frontend)** and **Node.js/Express (backend)**.  
Supports live messaging, image uploads via **Cloudinary**, JWT authentication, and push notifications using **VAPID keys**.

> Monorepo layout
> ```
> .
> ├─ backend/   # Node.js + Express + Socket.IO + MongoDB + Cloudinary
> └─ frontend/  # React client (no .env needed)
> ```

---

## ✨ Features

- 🔑 JWT authentication (register/login)  
- 💬 Real-time chat with **Socket.IO**  
- 👥 Private and group chats  
- 📸 Image upload & storage with **Cloudinary**  
- 🔔 Web push notifications (VAPID)  
- 🗄️ Message persistence in **MongoDB**  
- 🧾 REST APIs for users, chats, and messages  

---

## 🛠 Tech Stack

**Frontend**: React, Axios, Tailwind/AntD (optional)  
**Backend**: Node.js, Express, Socket.IO, MongoDB (Mongoose), JWT  
**Cloud Services**: Cloudinary (media), VAPID (push notifications)

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Sherlock-holmes1029/Chat-App.git
cd Chat-App

2. Backend setup

Go into the backend folder:

cd backend
npm install

Create a .env file in backend/ with dummy values like:

MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/chat_db
PORT=5001
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key


Run the backend:

npm run dev   # starts on http://localhost:5001

3. Frontend setup

Go into the frontend folder:

cd ../frontend
npm install
npm run dev   # starts on http://localhost:5173
