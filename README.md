# Virtual Assistant

A modern AI-powered chat application built with Angular 17 that integrates multiple specialized AI assistants using OpenAI's Assistant API, Firebase authentication, and real-time streaming responses.

## Features

- **Multi-Assistant Chat**: Interact with specialized AI assistants (Napoleon, President, Lisa)
- **Real-time Streaming**: Server-Sent Events (SSE) for live response streaming
- **Firebase Authentication**: Secure email/password authentication
- **Thread Management**: Persistent conversation sessions across assistants
- **Dark/Light Theme**: Toggle between themes with preference persistence
- **Responsive UI**: Built with TailwindCSS and Angular Material

## Tech Stack

- **Frontend**: Angular 17 (Standalone Components), TypeScript 5.2
- **State Management**: Angular Signals
- **Styling**: TailwindCSS 3.4, Angular Material 17.3
- **Backend Integration**: Node.js/FastAPI streaming endpoints
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## Project Structure

```
src/app/
├── components/       # UI components (chat, modals, navigation)
├── pages/           # Route-mapped pages (assistants, admin, docs)
├── services/        # Business logic (auth, theme, assistant selection)
├── models/          # TypeScript interfaces
└── environments/    # Firebase configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Angular CLI 17+
- Firebase account
- Backend API running (see backend endpoints in code)

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200`

### Build

```bash
# Production build
ng build

# Output directory: dist/
```

## Configuration

Configure Firebase credentials in [src/environments/environment.ts](src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  firebase: {
    projectId: 'your-project-id',
    // ... other Firebase config
  }
};
```

## Key Components

- **AgentComponent**: Main chat interface with streaming support
- **HeaderComponent**: Navigation and assistant selection
- **AuthService**: Firebase authentication management
- **AssistantselectorService**: Dynamic assistant configuration

## Backend Endpoints

The app connects to streaming chat endpoints:
- Local: `http://localhost:3000/chat_a_stream_id`
- Production: Railway/Render hosted APIs

Each assistant has a unique OpenAI Assistant ID for specialized behavior.

## Development

```bash
# Run tests
ng test

# Code scaffolding
ng generate component component-name
```

## License

This project is private and proprietary.
