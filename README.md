# 🍭 Candy Store Mobile App with React Native

A fully functional mobile-based e-commerce application built for showcasing a candy shopping experience. This app is developed using **React Native (with Expo SDK)** on the frontend and **FastAPI + MongoDB** on the backend.  

This project combines functionality from assignments **A05**, **A06**, and **A07**, resulting in a complete and polished mobile shopping solution featuring login, browsing, cart management, camera input, location services, and real-time chat.

🔗 **Project Repository**  
👉 [Click here to view the full project folder on GitHub](https://github.com/asoma0710/5373-MobileApps/tree/main/Assignments/A05)

---

## 📽️ Demo Videos

- **Part 1 – Login, Browse, Cart, Checkout:**  
  [▶ Watch on YouTube](https://youtu.be/KQhI1Y4Dh8Y)

- **Part 2 – Camera & Location Features:**  
  [▶ Watch on YouTube](https://youtu.be/xEW-b5oX0NE)

---

## 📦 Key Features

### 👥 User Features
- User authentication (login)
- Browse candies by name or category
- Add candies to cart and checkout
- Real-time map showing nearby users
- Camera integration for user uploads
- In-app chat between users

### 🧑‍💼 Admin Features
- Add/update/delete candy items in MongoDB
- Manage images and product stock
- Update pricing and categories
- Track user locations

---

## 🛠️ Tech Stack

### 🖥️ Frontend (React Native)
- **Framework:** React Native + Expo
- **Navigation:** Bottom tab navigation
- **Libraries Used:**  
  - Google Maps API  
  - React Native Camera  
  - Socket.io for chat  
  - AsyncStorage

### ⚙️ Backend (FastAPI)
- **Language:** Python
- **Database:** MongoDB  
  Collections: `Users`, `Candies`, `Categories`, `Images`, `Locations`
- **Server:** REST API hosted on DigitalOcean (previously active)

---

## 📁 Project Structure

| File/Folder                   | Description                                                |
|------------------------------|------------------------------------------------------------|
| `client/App.js`              | Entry point of the React Native app                        |
| `client/screens/`            | All screen components (Home, Cart, Map, Chat, etc.)        |
| `client/assets/`             | Backgrounds, videos, and static assets                     |
| `client/images/`             | Candy/product images used in UI                            |
| `api.py`                     | FastAPI backend server with routes                         |
| `A05.service`                | Service definition for backend deployment                  |
| `myvenv/`                    | Python virtual environment used for backend development    |
| `package.json`               | Frontend dependencies                                      |
| `requirements.txt`           | Backend dependencies                                       |

---

## 🚀 How to Run the Project

### 🔧 Backend (FastAPI)

```bash
# SSH into server or open terminal
cd /root/5373-MobileApps/Assignments/A05
source .venv/bin/activate
python api.py
