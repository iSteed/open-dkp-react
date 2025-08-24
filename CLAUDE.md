# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Start development server (runs on localhost:3000)
- `npm run build` - Create production build
- `npm test` - Run test suite using Jest and React Testing Library
- `npm run eject` - Eject from Create React App (use with caution)

### Code Quality
The project uses ESLint configuration from Create React App with React and Jest extensions. No separate linting command is configured, but you can run `npx eslint src/` if needed.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Styling**: Tailwind CSS classes (implemented in main component)
- **Icons**: Lucide React
- **State Management**: React Context + useReducer pattern
- **API Client**: Custom fetch-based client with TypeScript interfaces
- **Language**: Mixed JavaScript (App.js) and TypeScript (services, hooks, context)

### Architecture Overview

This is a guild DKP (Dragon Kill Points) management system for EverQuest with a sophisticated multi-layered architecture:

#### Core Components Structure
- **App.js**: Main application component containing the entire UI as a single large component (~30k tokens)
- **Context Layer**: `src/context/AppContext.tsx` provides global state management using React Context + useReducer
- **API Layer**: `src/api/services.ts` contains comprehensive API client with full CRUD operations
- **Hooks Layer**: `src/hooks/useData.ts` provides data management hooks for all entities
- **Configuration**: `src/config/app.ts` contains application constants, validation rules, and configuration

#### Data Flow Architecture
1. **Global State Management**: AppContext manages authentication, characters, pools, loading states, and user preferences
2. **API Integration**: Centralized API client (`ApiClient` class) handles all backend communication with client-specific headers
3. **Custom Hooks**: Entity-specific hooks (useCharacters, useRaids, etc.) encapsulate API calls and state management
4. **Local Storage**: Preferences, authentication, and client configuration persisted locally

#### Key Domain Entities
- **Characters**: Player characters with DKP totals, attendance, and guild information
- **Raids**: Events that generate DKP through "ticks" (attendance points)
- **Items**: Raid loot with DKP costs tracked via transactions
- **Adjustments**: Manual DKP corrections with audit trails
- **Pools**: Different DKP categories (Main, Alt, Trial)
- **Ticks**: Individual DKP awards within raids
- **Audit System**: Comprehensive logging of all DKP-related changes

### File Organization Patterns

#### TypeScript Files
- **API Services** (`src/api/services.ts`): Complete API client with typed responses
- **Context** (`src/context/AppContext.tsx`): Global state with actions and selectors
- **Hooks** (`src/hooks/useData.ts`): Custom hooks for data fetching and mutation
- **Config** (`src/config/app.ts`): Constants, validation, and feature flags
- **Utils** (`src/utils/dataTransformers.ts`): Data transformation utilities

#### JavaScript Files
- **Main App** (`src/App.js`): Single large component containing entire UI
- **Entry Point** (`src/index.js`): React application bootstrap

### State Management Patterns

#### Global Context Structure
```typescript
interface AppState {
  // Authentication & Client
  isAuthenticated: boolean;
  currentClient: Client | null;
  clientId: string | null;
  
  // Global data
  characters: CharacterWithDKP[];
  pools: Pool[];
  
  // UI state (loading, error states)
  // User preferences (theme, pagination, etc.)
}
```

#### Custom Hooks Pattern
Each entity has a dedicated hook providing:
- Data fetching with loading/error states
- CRUD operations with automatic refresh
- Optimistic updates where appropriate

### API Integration

#### Client Configuration
- Base URL configurable via environment variables
- Client-specific headers for multi-tenancy
- Comprehensive error handling and typed responses
- Automatic retries and timeout handling

#### Authentication Flow
- Client ID-based authentication stored in localStorage
- AWS Cognito integration prepared but not implemented
- Role-based access control (Member, Officer, Admin)

### EverQuest-Specific Features

#### Character System
- Full EverQuest class and race support
- Level tracking (1-125)
- Guild rank integration
- Character association requests

#### DKP System
- Tick-based attendance tracking
- Item transaction history
- Manual adjustment system
- Multi-pool support (Main/Alt/Trial)
- Comprehensive audit logging

#### Log Parsing
- EverQuest chat log parsing for automatic attendance
- Multiple log format support
- Character auto-creation from parsed data
- Real-time parsing feedback

## Important Implementation Notes

### Code Style Consistency
- Main UI component is in JavaScript (App.js)
- Backend integration layer is in TypeScript
- Use existing patterns when adding features
- Follow EverQuest naming conventions for game-specific features

### State Management
- Always use the global AppContext for shared state
- Use custom hooks for entity-specific operations
- Maintain loading and error states consistently
- Persist important state to localStorage

### API Integration
- All API calls go through the centralized ApiClient
- Use typed request/response interfaces
- Handle errors gracefully with user feedback
- Implement optimistic updates where appropriate

### Multi-Client Architecture
- The system supports multiple guild clients
- Always include client ID in API requests
- Respect client-specific data isolation
- Store client configuration persistently