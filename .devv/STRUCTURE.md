# This file is only for editing file nodes, do not break the structure
## Project Description
A secure, local Base64 text converter tool that enables bidirectional conversion between plain text and Base64 encoding. All processing happens client-side for maximum data privacy and security.

## Key Features
- Bidirectional conversion: Text to Base64 and Base64 to text
- One-click copy functionality for easy result sharing
- Local processing: No data sent to external servers
- Responsive design: Works seamlessly on desktop and mobile devices
- Real-time validation and error handling with user-friendly feedback
- Clean all functionality for quick content reset
- Professional UI with accessibility compliance
- Synchronized resizable text areas: When users drag to resize one textarea, the other automatically adjusts to maintain equal height
- Multi-language support: Chinese, English, Japanese, and Korean languages
- Persistent language preference: User's language choice is saved locally
- Elegant language selector with country flags
- Custom professional favicon with Base64 encoding theme matching green color scheme

## Data Storage
**Local Only:**
- Text input: React state (no persist)
- Base64 input: React state (no persist)
- UI feedback: Toast notifications (temporary)
- Language preference: Zustand store with localStorage persistence

## SDK & External Services
**Devv SDK:** Not used - Pure frontend application
**External APIs:** None - All processing happens locally
**Environment Variables:** None required

## Critical Notes
**Dependency Management:**
- Removed unused react-day-picker and date-fns packages that caused deployment conflicts
- Calendar component deleted as it's not needed for Base64 conversion functionality
- Streamlined dependencies for better deployment reliability

**Internationalization System:**
- Complete translation coverage for 4 languages: Chinese (zh), English (en), Japanese (ja), Korean (ko)
- Zustand store with persistence automatically saves language preference
- Language selector in header provides quick switching with country flags
- All UI text, toast messages, and placeholders are fully translated
- Default language is Chinese, but automatically detects and saves user preference

**Text Processing:**
- Uses btoa/atob with proper UTF-8 encoding/decoding for international character support
- Handles special characters and emoji correctly across all languages

/src
├── assets/          # Static resources directory, storing static files like images and fonts
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components, avoid modifying or rewriting unless necessary
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Pre-installed mobile detection Hook from shadcn (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # Toast notification system hook for displaying toast messages (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including the cn function for merging Tailwind class names
│
├── pages/          # Page components directory, based on React Router structure
│   ├── HomePage.tsx # Home page component, serving as the main entry point of the application
│   └── NotFoundPage.tsx # 404 error page component, displays when users access non-existent routes
│
├── store/          # Global state management directory
│   └── i18n-store.ts # Internationalization store with language settings and translations
│
├── components/     # Custom components directory  
│   └── LanguageSelector.tsx # Language selection dropdown component
│
├── App.tsx         # Root component, with React Router routing system configured
│                   # Add new route configurations in this file
│                   # Includes catch-all route (*) for 404 page handling
│
├── main.tsx        # Entry file, rendering the root component and mounting to the DOM
│
├── index.css       # Global styles file, containing Tailwind configuration and custom styles
│                   # Modify theme colors and design system variables in this file
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file
# Contains theme customization, plugins, and content paths
# Includes shadcn/ui theme configuration