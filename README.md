# 🌍 Tempo — Your AI Travel Companion

**Tempo** is an AI-powered travel planning web app that generates personalized itineraries based on your preferences. Whether you're a solo explorer or a group adventurer, Tempo makes trip planning fast, smart, and fun.

![Tempo Screenshot](/tempo/src/assets/cover-image.jpeg)

---

## 🚀 Features

- ✨ AI-generated itineraries using Gemini API
- 🏨 Smart hotel suggestions via Google Places API
- 🗺️ Day-wise trip planning with rich content and images
- 🔊 Voice-based itinerary change requests (Google Speech-to-Text)
- 🔗 Share trips with others via direct links (edit/view)
- 💾 View and manage saved trips
- 📱 Fully responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Tech                     | Description                           |
| ------------------------ | ------------------------------------- |
| React + TypeScript       | Frontend framework                    |
| Node.js + Express        | Backend API                           |
| MongoDB Atlas            | Cloud-hosted NoSQL database           |
| Gemini API               | Natural language itinerary generation |
| Google Maps / Places API | Location data and hotel images        |
|                          |
| Render                   | Hosting (frontend & backend)          |
| Vite                     | Frontend build tool                   |

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/swathysukumaran/tempo.git
cd tempo
```

2. **Install dependencies**

```bash
cd tempo
npm install
cd ../backend
npm install
```

3. **Environment Variables**

Create `.env` files in both `frontend/` and `backend/`.

### Frontend (`frontend/.env`)

```
VITE_API_URL=https://your-backend-url.com
VITE_GOOGLE_OAUTH_CLIENT_ID=your-client-id
```

### Backend (`backend/.env`)

```
PORT=8081
MONGO_URI=your-mongodb-uri
GOOGLE_CLOUD_KEY_JSON=...
FRONTEND_URL=https://your-frontend-url.com
```

4. **Run Development Servers**

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

---

## 🔐 Authentication

- Session token stored in HTTP-only cookies
- Backend protects routes using an `isAuthenticated` middleware
- CORS configured with `credentials: true`

---

## 🔗 Deployment on Render

### Frontend

Create a `static.json` file in the root:

```json
{
  "root": "dist/",
  "routes": {
    "/**": "index.html"
  }
}
```

This ensures all routes fallback to `index.html` so React Router can handle them client-side.

### Backend

- Deploy as a web service
- Add the environment variables from `.env`
- CORS origin must match frontend deployment URL

---

## 🌐 Live Demo (Example)

The live demo has been taken down due to Google Cloud billing limitations.

---

## 📁 Folder Structure

```
tempo/
├── backend/                # Node.js + Express backend
│   └── src/
├── tempo/               # React + Vite frontend
│   ├── src/
│   └── static.json
├── README.md
└── .env
```

---

## 👩‍💻 Author

**Swathy Sukumaran**  
MERN Stack Developer | NIC, British Columbia  
📍 Based in Comox Valley, Canada  
🔗 [LinkedIn](https://www.linkedin.com/in/swathy-sukumaran-v-1190b7233/)  
🌐 [Portfolio](https://portfolio-y2bu.onrender.com/)

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🤝 Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
