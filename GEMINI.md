## Project Overview

This is a client-side Base64 text converter built with React, TypeScript, and Vite. It allows users to encode and decode text to and from Base64. The application is designed to be secure, with all processing done locally in the browser. It also features internationalization with support for English, Chinese, Japanese, and Korean.

**Key Technologies:**

*   **Frontend:** React 18.2.0, TypeScript 5.7.2, Vite 6.3.1
*   **UI:** Tailwind CSS 3.4.1, shadcn/ui
*   **Routing:** React Router 6.22.1
*   **State Management:** Zustand 5.0.6

## Building and Running

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm, bun, or another package manager

### Installation

```bash
# Using bun (recommended)
bun install

# Using npm
npm install
```

### Development

To start the development server, run:

```bash
# Using bun
bun dev

# Using npm
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
# Using bun
bun run build

# Using npm
npm run build
```

The production-ready files will be located in the `dist` directory.

## Development Conventions

*   **Component-Based Architecture:** The application follows a component-based architecture, with reusable UI components located in `src/components`.
*   **Styling:** Styling is done using Tailwind CSS and shadcn/ui. Custom styles are in `src/index.css`.
*   **State Management:** Global state, such as the i18n translations, is managed with Zustand. Component-level state is managed with React hooks.
*   **Routing:** The application uses React Router for routing. The routes are defined in `src/App.tsx`.
*   **Linting:** The project uses ESLint for code quality. The configuration is in `eslint.config.js`.
*   **TypeScript:** The project is written in TypeScript. The main configuration is in `tsconfig.json`.
