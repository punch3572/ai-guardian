# 🛡️ AI Guardian - Hackathon Edition

Welcome to the **AI Guardian** platform! This app is designed to analyze digital content (Text, Images, Code) for trust, safety, and authenticity using Google's Gemini models.

## 🚀 Quick Start (VS Code)

Follow these steps to get the app running locally and win that hackathon!

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js 18+ installed.
- **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Firebase Project**: Create a project at [Firebase Console](https://console.firebase.google.com/).

### 2. Installation
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Firebase Setup
1.  Add a **Web App** to your Firebase project.
2.  Copy the configuration object and save it as `firebase-applet-config.json` in the root folder.
3.  Enable **Google Authentication** in the Firebase Auth tab.
4.  Create a **Firestore Database** (Enterprise mode) and set rules to allow read/write for authenticated users.

### 5. Run the App
```bash
npm run dev
```
The app will be available at **`http://localhost:3000`**.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS 4, Motion (Animations), Lucide Icons.
- **Backend**: Express.js, Vite Middleware.
- **AI**: Google Gemini 3 Flash (Text/Code), Gemini 2.5 Flash (Image).
- **Database/Auth**: Firebase Firestore & Google Auth.

## 🏆 Hackathon Tips
- **Demo Data**: Use the "Try demo data" buttons in the app to showcase the AI's capabilities quickly.
- **Real-time History**: Show how the app saves analysis history to Firestore in real-time.
- **Responsive Design**: The app is fully responsive—show it on both desktop and mobile views!

Good luck with the hackathon! 🚀
