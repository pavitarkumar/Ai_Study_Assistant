# Firebase Console Integration Guide

This guide explains how to connect your **Firebase Console** project to the **AI Study Assistant** platform.

---

## 1. Firebase Services Supported
1. **Firebase Authentication**: User registration & sign-in (Email/Password, Google Auth).
2. **Cloud Firestore**: Real-time sync for chat messages, conversations, and live study sessions.
3. **Firebase Cloud Storage**: Storage bucket hosting for uploaded PDF/DOCX study materials.
4. **Firebase Analytics & Performance**: Web user telemetry and crash reporting.

---

## 2. Step-by-Step Firebase Console Setup

### Step 1: Create a Project in Firebase Console
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `ai-study-assistant`.
3. Enable or disable Google Analytics as desired, then click **Create project**.

### Step 2: Register Web App
1. In the Firebase Console project overview, click the **Web icon (`</>`)** to add a web app.
2. App nickname: `AI Study Assistant Web`.
3. Click **Register app**.
4. Copy the `firebaseConfig` credentials object.

### Step 3: Configure Environment Variables
Copy the values from your Firebase Console into your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-study-assistant.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-study-assistant
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-study-assistant.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Enable Authentication & Firestore Rules
1. In Firebase Console, go to **Build > Authentication** and enable **Email/Password** or **Google**.
2. Go to **Build > Firestore Database**, click **Create database**, and set security rules enforcing `auth.uid == resource.data.userId`.
