// context/AppContext.tsx - Global application context and provider

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/services.ts';
import { Client, CharacterWithDKP, Pool } from '../types/database';

// Application state interface
interface AppState {
  // Authentication & Client
  isAuthenticated: boolean;
  currentUser: string | null;
  currentClient: Client | null;
  clientId: string | null;
  
  // Global data
  characters: CharacterWithDKP[];
  pools: Pool[];
  
  // UI state
  loading: {
    characters: boolean;
    pools: boolean;
    authentication: boolean;
  };
  
  error: {
    characters: string | null;
    pools: string | null;
    authentication: string | null;
  };
  
  // Settings
  preferences: {
    theme: 'light' | 'dark';
    itemsPerPage: number;
    defaultPool: number | null;
    showInactiveCharacters: boolean;
  };
}

// Action types
type AppAction = 
  | { type: 'SET_AUTHENTICATION'; payload: { isAuthenticated: boolean; user: string | null } }
  | { type: 'SET_CLIENT'; payload: Client | null }
  | { type: 'SET_CLIENT_ID'; payload: string | null }
  | { type: 'SET_CHARACTERS'; payload: CharacterWithDKP[] }
  | { type: 'SET_POOLS'; payload: Pool[] }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppState['error']; value: string | null } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppState['preferences']> }
  | { type: 'ADD_CHARACTER'; payload: CharacterWithDKP }
  | { type: 'UPDATE_CHARACTER'; payload: CharacterWithDKP }
  | { type: 'REMOVE_CHARACTER'; payload: number }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  currentClient: null,
  clientId: null,
  characters: [],
  pools: [],
  loading: {
    characters: false,
    pools: false,
    authentication: false,
  },
  error: {
    characters: null,
    pools: null,
    authentication: null,
  },
  preferences: {
    theme: 'light',
    itemsPerPage: 50,
    defaultPool: null,
    showInactiveCharacters: false,
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTHENTICATION':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        currentUser: action.payload.user,
      };
    
    case 'SET_CLIENT':
      return {
        ...state,
        currentClient: action.payload,
        clientId: action.payload?.clientId || null,
      };
    
    case 'SET_CLIENT_ID':
      return {
        ...state,
        clientId: action.payload,
      };
    
    case 'SET_CHARACTERS':
      return {
        ...state,
        characters: action.payload,
      };
    
    case 'SET_POOLS':
      return {
        ...state,
        pools: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
    
    case 'ADD_CHARACTER':
      return {
        ...state,
        characters: [...state.characters, action.payload],
      };
    
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id_character === action.payload.id_character ? action.payload : char
        ),
      };
    
    case 'REMOVE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(char => char.id_character !== action.payload),
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    // Authentication
    login: (user: string, clientId: string) => void;
    logout: () => void;
    
    // Data loading
    loadCharacters: () => Promise<void>;
    loadPools: () => Promise<void>;
    
    // Character management
    addCharacter: (character: CharacterWithDKP) => void;
    updateCharacter: (character: CharacterWithDKP) => void;
    removeCharacter: (characterId: number) => void;
    
    // Preferences
    updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
    
    // Client management
    setClient: (clientId: string) => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('opendkp_preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }

    // Load saved client ID
    const savedClientId = localStorage.getItem('opendkp_client_id');
    if (savedClientId) {
      dispatch({ type: 'SET_CLIENT_ID', payload: savedClientId });
      apiClient.setClientId(savedClientId);
    }

    // Load saved authentication
    const savedUser = localStorage.getItem('opendkp_current_user');
    if (savedUser) {
      dispatch({ 
        type: 'SET_AUTHENTICATION', 
        payload: { isAuthenticated: true, user: savedUser } 
      });
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('opendkp_preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  // Actions
  const actions = {
    login: (user: string, clientId: string) => {
      dispatch({ type: 'SET_AUTHENTICATION', payload: { isAuthenticated: true, user } });
      dispatch({ type: 'SET_CLIENT_ID', payload: clientId });
      apiClient.setClientId(clientId);
      
      localStorage.setItem('opendkp_current_user', user);
      localStorage.setItem('opendkp_client_id', clientId);
    },

    logout: () => {
      dispatch({ type: 'RESET_STATE' });
      
      localStorage.removeItem('opendkp_current_user');
      localStorage.removeItem('opendkp_client_id');
      apiClient.setClientId('');
    },

    loadCharacters: async () => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'characters', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'characters', value: null } });

      try {
        const response = await apiClient.getCharacters();
        if (response.success && response.data) {
          dispatch({ type: 'SET_CHARACTERS', payload: response.data });
        } else {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: { key: 'characters', value: response.error || 'Failed to load characters' } 
          });
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            key: 'characters', 
            value: error instanceof Error ? error.message : 'Unknown error' 
          } 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'characters', value: false } });
      }
    },

    loadPools: async () => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'pools', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'pools', value: null } });

      try {
        const response = await apiClient.getPools();
        if (response.success && response.data) {
          dispatch({ type: 'SET_POOLS', payload: response.data });
        } else {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: { key: 'pools', value: response.error || 'Failed to load pools' } 
          });
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            key: 'pools', 
            value: error instanceof Error ? error.message : 'Unknown error' 
          } 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'pools', value: false } });
      }
    },

    addCharacter: (character: CharacterWithDKP) => {
      dispatch({ type: 'ADD_CHARACTER', payload: character });
    },

    updateCharacter: (character: CharacterWithDKP) => {
      dispatch({ type: 'UPDATE_CHARACTER', payload: character });
    },

    removeCharacter: (characterId: number) => {
      dispatch({ type: 'REMOVE_CHARACTER', payload: characterId });
    },

    updatePreferences: (preferences: Partial<AppState['preferences']>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },

    setClient: (clientId: string) => {
      dispatch({ type: 'SET_CLIENT_ID', payload: clientId });
      apiClient.setClientId(clientId);
      localStorage.setItem('opendkp_client_id', clientId);
    },
  };

  // Auto-load data when client is set and user is authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.clientId) {
      actions.loadCharacters();
      actions.loadPools();
    }
  }, [state.isAuthenticated, state.clientId]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for specific parts of the state
export function useAuth() {
  const { state } = useApp();
  return {
    isAuthenticated: state.isAuthenticated,
    currentUser: state.currentUser,
    clientId: state.clientId,
  };
}

export function useCharacters() {
  const { state, actions } = useApp();
  return {
    characters: state.characters,
    loading: state.loading.characters,
    error: state.error.characters,
    loadCharacters: actions.loadCharacters,
    addCharacter: actions.addCharacter,
    updateCharacter: actions.updateCharacter,
    removeCharacter: actions.removeCharacter,
  };
}

export function usePools() {
  const { state, actions } = useApp();
  return {
    pools: state.pools,
    loading: state.loading.pools,
    error: state.error.pools,
    loadPools: actions.loadPools,
  };
}

export function usePreferences() {
  const { state, actions } = useApp();
  return {
    preferences: state.preferences,
    updatePreferences: actions.updatePreferences,
  };
}