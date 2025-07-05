# Firebase Setup Guide

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Firebase configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project or create a new one
   - Go to Project Settings (⚙️ gear icon)
   - Scroll to "Your apps" section
   - Select your web app or click "Add app" → Web
   - Copy the configuration values

3. **Update your `.env` file** with the actual values from Firebase

4. **Enable required Firebase services:**
   - **Firestore Database** (for storing events data)
   - **Storage** (for uploading images/videos)
   - **Analytics** (optional, for user tracking)

## Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase project's API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Authentication domain (projectname.firebaseapp.com) |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Your app's unique identifier |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID |
| `VITE_VERCEL_ANALYTICS_ID` | Vercel Analytics ID (optional) |

## Security Notes

- ✅ `.env` is already in `.gitignore` - your secrets won't be committed
- ✅ Firebase config is safe to expose in frontend (it's designed for client-side use)
- ✅ Use Firebase Security Rules to protect your data

## Next Steps

After setting up your environment variables:

1. **Test the connection:**
   ```bash
   npm run dev
   ```

2. **Check browser console** for any Firebase connection errors

3. **Configure Firestore rules** in Firebase Console for your data security

4. **Set up Storage rules** if you plan to upload media files
