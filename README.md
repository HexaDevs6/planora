# 🎉 Planora - Event Management Platform

Planora is a comprehensive event management and discovery platform that connects event organizers, attendees, and service providers.

## ✨ Features

- 🎭 **Event Discovery**: Browse events by category, location, and interests
- 🎫 **Ticket Booking**: Secure online ticket booking system
- 🎤 **Planora AI**: AI-powered voice assistant for event queries
- 👥 **User Management**: Separate dashboards for attendees and organizers
- 🌙 **Dark Mode**: Beautiful dark mode support
- 🌐 **Multi-language**: Support for Arabic and English
- 🎨 **Modern UI**: Beautiful interface with animations and gradients

## 🤖 Planora AI - NEW!

An AI-powered voice chat assistant using Google's Gemini AI model. Features include:

- **Voice Interaction**: Speak to get event recommendations
- **Context-Aware**: Only answers Planora-related questions
- **Real-time Speech Recognition**: Live transcription of your voice
- **Text-to-Speech**: Natural voice responses
- **Smart Event Discovery**: Find events based on your interests

### Quick Setup for Planora AI

**⚠️ Required:** Planora AI needs a Gemini API key to work.

1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env.local` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```
3. Restart the dev server:
```bash
npm run dev
```

**Note:** The `.env.local` file is required. The app will show an error screen if the API key is not configured.

For detailed AI setup instructions, see [PLANORA_AI_README.md](./PLANORA_AI_README.md)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

**Required:** Create `.env.local` file in the project root:

```bash
# Gemini AI (REQUIRED for Planora AI feature)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs (REQUIRED for high-quality voice responses)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Supabase (coming soon)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Important:** 
- Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Get your ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/)
- The `.env.local` file is in `.gitignore` and will not be committed
- Restart the dev server after creating/modifying `.env.local`

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **AI**: Google Gemini AI
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
planora/
├── src/
│   ├── pages/          # Page components
│   │   └── PlanoraAi.jsx  # AI voice assistant
│   ├── components/     # Reusable components
│   │   └── VoiceChat.jsx  # Voice chat UI
│   ├── services/       # API services
│   │   └── geminiService.js  # AI integration
│   ├── data/           # Static data
│   ├── store/          # Redux store
│   ├── layout/         # Layout components
│   └── lib/            # Utilities
├── public/             # Static assets
└── .env.local.example  # Environment template
```

## 🎯 Key Features

### For Event Attendees
- Discover events by category and interests
- Book tickets securely online
- Ask Planora AI for event recommendations
- Manage your bookings and tickets
- Leave reviews and ratings

### For Event Organizers
- Create and manage events
- Track ticket sales and revenue
- Manage attendee lists
- Access analytics dashboard
- Communicate with attendees

### For Service Providers
- Offer event services (catering, DJ, photography, etc.)
- Showcase your portfolio
- Connect with event organizers
- Manage bookings and schedules

## 🎤 Using Planora AI

1. Navigate to the Planora AI page
2. Click the microphone button
3. Ask questions like:
   - "What events are happening this month?"
   - "Show me music concerts"
   - "How do I book tickets?"
   - "Tell me about Planora"

**Note**: Planora AI only answers questions related to events and the Planora platform.

## 🌐 Browser Support

- Chrome (recommended for voice features)
- Edge
- Safari
- Firefox (limited voice support)

## 📝 License

This project is proprietary software for Planora.

## 🤝 Contributing

Please read the contribution guidelines before submitting pull requests.

## 📞 Contact

- Email: info@planora.com
- Phone: +20 123 456 7890
- Website: [planora.com](https://planora.com)

---

Built with ❤️ by the HexaDevs team
