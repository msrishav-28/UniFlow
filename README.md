# UniFlow - Events in Motion

A modern, premium social media app for college events with a TikTok-style vertical feed, built with React, TypeScript, and Firebase.

## ✨ Features

- **Vertical Feed**: TikTok-style infinite scroll experience
- **Event Management**: View, save, and share college events
- **Categories**: Technical, Cultural, Guest Talks, Inter-college, Sports
- **Premium UI**: Glass morphism design with smooth animations
- **PWA Ready**: Works offline with service worker support
- **Performance Optimized**: Lazy loading, virtualization, and code splitting
- **Firebase Integration**: Real-time data, analytics, and feedback system

## 🚀 Quick Setup

### Automated Setup (Recommended)

Choose the script for your operating system:

#### Windows (Command Prompt)
```cmd
setup.bat
```

#### Windows (PowerShell)
```powershell
.\setup.ps1
```

#### Linux/macOS
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Firebase**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration
```

3. **Start Development Server**
```bash
npm run dev
```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Storage (for media uploads)
4. Enable Analytics (optional)
5. Copy your config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Environment Variables

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Firebase Emulator (for development)
VITE_USE_FIREBASE_EMULATOR=false

# Optional: Vercel Analytics
VITE_VERCEL_ANALYTICS_ID=your_analytics_id
```

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Start with network access

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Storage, Analytics)
- **Build Tool**: Vite
- **PWA**: Workbox
- **Testing**: Vitest, React Testing Library

## 📱 Features Overview

### Core Components

- **PremiumVerticalFeed**: Main TikTok-style feed with virtualization
- **PremiumNavigation**: Bottom navigation with haptic feedback
- **EdgeSwipeNavigation**: Gesture-based navigation
- **FeedbackWidget**: User feedback system with screenshots
- **ErrorBoundary**: Graceful error handling

### Performance Optimizations

- **Lazy Loading**: Code splitting for components and pages
- **Virtualization**: Only render visible feed items
- **Progressive Images**: Optimized image loading
- **Service Worker**: Offline functionality and caching

### User Experience

- **Haptic Feedback**: Native-like interactions
- **Dark/Light Theme**: Automatic theme switching
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on all devices

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🔒 Security & Performance

- Environment variables for sensitive data
- Firebase security rules configured
- Image optimization and lazy loading
- Service worker for offline functionality
- Error boundary for graceful failures

## 🐛 Troubleshooting

### Common Issues

1. **Firebase errors**: Check your `.env` configuration
2. **Build errors**: Run `npm run type-check` for TypeScript issues
3. **Dependency issues**: Delete `node_modules` and run `npm install`
4. **Port conflicts**: The app runs on port 5173 by default

### Getting Help

- Check the [Issues](../../issues) page
- Use the in-app feedback widget
- Review Firebase console for backend issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

Built with ❤️ for college communities