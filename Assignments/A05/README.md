# 🍭 Candy Store Mobile App with React Native

A fully functional e-commerce mobile application built with **React Native** for the frontend and **FastAPI + MongoDB** on the backend. This project represents assignments A05, A06, and A07 combined into a single comprehensive candy store experience.

---

## 📽️ Demo Videos

Experience the complete walkthrough of the application through the following YouTube demos:

- **Part 1 – (Login, Browse, Cart, Checkout):**  
  [▶ Watch on YouTube](https://youtu.be/KQhI1Y4Dh8Y)

- **Part 2 – (Camera, Location Services):**  
  [▶ Watch on YouTube](https://youtu.be/xEW-b5oX0NE)

---

## 📦 Features Overview

### 🎯 User-Side Functionalities
- Browse and search for candies by name and category.
- Add items to cart and place orders.
- View interactive maps to see nearby users.
- Upload images via camera integration.
- Real-time in-app chat with other users.

### 🛠️ Admin-Side Functionalities
- Add, update, and remove candy products from MongoDB.
- Handle image uploads to backend server.
- Manage user location and category data.
- Perform price adjustments and stock updates.

---

## 🛠️ Tech Stack

### Frontend (React Native)
- **Framework:** React Native w/ Expo SDK
- **Navigation:** Bottom tab navigation
- **Libraries:** Google Maps API, React Native Camera, Socket.io, etc.

### Backend (FastAPI)
- **Language:** Python
- **Framework:** FastAPI
- **Database:** MongoDB (Collections: Users, Candies, Categories, Images, Locations)
- **Deployment:** Hosted on DigitalOcean (now deprecated)
- **Architecture:** RESTful API endpoints for all core operations

---

## 📁 Key Files & Folders

| #  | Name                            | Description                                                |
|----|---------------------------------|------------------------------------------------------------|
| 1  | `client/App.js`                        | Root file for launching the mobile application             |
| 2  | `api.py`                        | Backend API built using FastAPI                            |
| 3  | `client/screens/`               | Contains all mobile app screens (Home, Chat, Map, etc.)    |
| 4  | `client/assets/`                | Background images and landing page video                   |
| 5  | `client/images/`                | Image resources used across the app                        |
| 6  | `A05.service`                   | Service file for backend deployment                        |
| 7  | `package.json` & `package-lock.json` | Lists and locks all dependencies                     |
| 8  | `myvenv/`                       | Python virtual environment (server-side)                   |

---

## 🚀 Setup Instructions

### Backend API (FastAPI)
1. SSH into your server.
2. Navigate to the project directory:  
   `cd /root/5373-MobileApps/Assignments/A05`
3. Activate the virtual environment:  
   `source .venv/bin/activate`
4. Run the API:  
   `python api.py`  
   (Accessible at `localhost:8085`)

### Frontend App (React Native)
1. Navigate to `client/` folder.
2. Install dependencies:  
   `npm install` or `yarn install`
3. Launch the app with Expo:  
   `npm start` or `yarn expo start`

---



Enjoy your 🍬 Candy Shopping experience!
