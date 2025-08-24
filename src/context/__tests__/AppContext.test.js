// __tests__/AppContext.test.js - Tests for context state management and reducers

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider, useApp, useAuth, usePreferences } from '../AppContext.tsx';

// Mock AWS Amplify to prevent actual authentication calls
jest.mock('../../services/cognitoAuth.ts', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(() => Promise.resolve(false)),
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
    getAccessToken: jest.fn(() => Promise.resolve(null)),
    signIn: jest.fn(() => Promise.resolve({ 
      success: true, 
      user: { username: 'testuser', email: 'test@example.com', sub: '123' } 
    })),
    signOut: jest.fn(() => Promise.resolve({ success: true })),
    signUp: jest.fn(() => Promise.resolve({ success: false, requiresConfirmation: true })),
    confirmSignUp: jest.fn(() => Promise.resolve({ success: true })),
    resetPassword: jest.fn(() => Promise.resolve({ success: true })),
    confirmResetPassword: jest.fn(() => Promise.resolve({ success: true })),
    resendConfirmationCode: jest.fn(() => Promise.resolve({ success: true })),
  },
}));

// Mock API client
jest.mock('../../api/services.ts', () => ({
  apiClient: {
    setClientId: jest.fn(),
    setAuthToken: jest.fn(),
    getCharacters: jest.fn(() => Promise.resolve({ success: true, data: [] })),
    getPools: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  }
}));

// Test component to access context values
const TestComponent = () => {
  const { state, actions } = useApp();
  const { isAuthenticated, currentUser } = useAuth();
  const { preferences, updatePreferences } = usePreferences();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="current-user">{currentUser?.username || 'no-user'}</div>
      <div data-testid="theme">{preferences.theme}</div>
      <div data-testid="items-per-page">{preferences.itemsPerPage}</div>
      <div data-testid="loading-auth">{state.loading.authentication ? 'loading' : 'not-loading'}</div>
      <div data-testid="error-auth">{state.error.authentication || 'no-error'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => actions.login('testuser', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn" 
        onClick={() => actions.logout()}
      >
        Logout
      </button>
      <button 
        data-testid="theme-btn" 
        onClick={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
      >
        Toggle Theme
      </button>
      <button 
        data-testid="signup-btn" 
        onClick={() => actions.signUp('newuser', 'password123', 'new@example.com')}
      >
        Sign Up
      </button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('current-user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('items-per-page')).toHaveTextContent('50');
      expect(screen.getByTestId('loading-auth')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('error-auth')).toHaveTextContent('no-error');
    });

    test('should default to dark theme', () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('Authentication State Management', () => {
    test('should handle successful login', async () => {
      // Ensure the mock is properly set up
      const CognitoAuthService = require('../../services/cognitoAuth.ts').default;
      CognitoAuthService.signIn.mockResolvedValueOnce({
        success: true,
        user: { username: 'testuser', email: 'test@example.com', sub: '123' }
      });

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('current-user')).toHaveTextContent('testuser');
      });
    });

    test('should handle logout', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      const logoutBtn = screen.getByTestId('logout-btn');

      // First login
      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      });

      // Then logout
      await act(async () => {
        logoutBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
        expect(screen.getByTestId('current-user')).toHaveTextContent('no-user');
      });
    });

    test('should handle signup with confirmation required', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      // Should not be authenticated after signup (requires confirmation)
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      });
    });

    test('should show loading state during authentication', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');

      act(() => {
        loginBtn.click();
      });

      // Check loading state appears
      expect(screen.getByTestId('loading-auth')).toHaveTextContent('loading');

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByTestId('loading-auth')).toHaveTextContent('not-loading');
      });
    });
  });

  describe('Preferences Management', () => {
    test('should update theme preference', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const themeBtn = screen.getByTestId('theme-btn');
      
      // Initial theme should be dark
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      await act(async () => {
        themeBtn.click();
      });

      // Should switch to light
      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      await act(async () => {
        themeBtn.click();
      });

      // Should switch back to dark
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    test('should persist preferences to localStorage', async () => {
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const themeBtn = screen.getByTestId('theme-btn');

      await act(async () => {
        themeBtn.click();
      });

      // Check localStorage was updated
      const savedPreferences = JSON.parse(localStorage.getItem('opendkp_preferences'));
      expect(savedPreferences.theme).toBe('light');
      expect(savedPreferences.itemsPerPage).toBe(50);
    });

    test('should load preferences from localStorage on mount', () => {
      // Set preferences in localStorage before mounting
      localStorage.setItem('opendkp_preferences', JSON.stringify({
        theme: 'light',
        itemsPerPage: 25,
        defaultPool: 1,
        showInactiveCharacters: true
      }));

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('items-per-page')).toHaveTextContent('25');
    });
  });

  describe('Error Handling', () => {
    test('should handle authentication errors', async () => {
      // Mock failed login
      const CognitoAuthService = require('../../services/cognitoAuth.ts').default;
      CognitoAuthService.signIn.mockResolvedValueOnce({
        success: false,
        error: 'Invalid credentials'
      });

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-auth')).toHaveTextContent('Invalid credentials');
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      });
    });

    test('should clear errors on successful authentication', async () => {
      // First, cause an error
      const CognitoAuthService = require('../../services/cognitoAuth.ts').default;
      CognitoAuthService.signIn.mockResolvedValueOnce({
        success: false,
        error: 'Invalid credentials'
      });

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-auth')).toHaveTextContent('Invalid credentials');
      });

      // Then succeed
      CognitoAuthService.signIn.mockResolvedValueOnce({
        success: true,
        user: { username: 'testuser', email: 'test@example.com', sub: '123' }
      });

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-auth')).toHaveTextContent('no-error');
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      });
    });
  });

  describe('Reducer Actions', () => {
    test('should handle SET_AUTHENTICATION action', () => {
      const TestReducerComponent = () => {
        const { state, dispatch } = useApp();
        
        const handleSetAuth = () => {
          dispatch({
            type: 'SET_AUTHENTICATION',
            payload: { 
              isAuthenticated: true, 
              user: { username: 'directuser', email: 'direct@example.com', sub: '456' } 
            }
          });
        };

        return (
          <div>
            <div data-testid="auth-status">{state.isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="current-user">{state.currentUser?.username || 'no-user'}</div>
            <button data-testid="set-auth-btn" onClick={handleSetAuth}>Set Auth</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestReducerComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');

      act(() => {
        screen.getByTestId('set-auth-btn').click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('current-user')).toHaveTextContent('directuser');
    });

    test('should handle UPDATE_PREFERENCES action', () => {
      const TestReducerComponent = () => {
        const { state, dispatch } = useApp();
        
        const handleUpdatePrefs = () => {
          dispatch({
            type: 'UPDATE_PREFERENCES',
            payload: { 
              theme: 'light',
              itemsPerPage: 100
            }
          });
        };

        return (
          <div>
            <div data-testid="theme">{state.preferences.theme}</div>
            <div data-testid="items-per-page">{state.preferences.itemsPerPage}</div>
            <button data-testid="update-prefs-btn" onClick={handleUpdatePrefs}>Update Prefs</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestReducerComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('items-per-page')).toHaveTextContent('50');

      act(() => {
        screen.getByTestId('update-prefs-btn').click();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('items-per-page')).toHaveTextContent('100');
    });

    test('should handle RESET_STATE action', async () => {
      const TestReducerComponent = () => {
        const { state, dispatch } = useApp();
        
        const handleLogin = () => {
          dispatch({
            type: 'SET_AUTHENTICATION',
            payload: { 
              isAuthenticated: true, 
              user: { username: 'testuser', email: 'test@example.com', sub: '123' } 
            }
          });
        };

        const handleReset = () => {
          dispatch({ type: 'RESET_STATE' });
        };

        return (
          <div>
            <div data-testid="auth-status">{state.isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="current-user">{state.currentUser?.username || 'no-user'}</div>
            <button data-testid="login-btn" onClick={handleLogin}>Login</button>
            <button data-testid="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestReducerComponent />
        </AppProvider>
      );

      // First login
      act(() => {
        screen.getByTestId('login-btn').click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('current-user')).toHaveTextContent('testuser');

      // Then reset
      act(() => {
        screen.getByTestId('reset-btn').click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('current-user')).toHaveTextContent('no-user');
    });
  });

  describe('Hook Integration', () => {
    test('useAuth hook should provide authentication state', () => {
      const TestAuthHook = () => {
        const auth = useAuth();
        
        return (
          <div>
            <div data-testid="hook-auth-status">{auth.isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="hook-current-user">{auth.currentUser?.username || 'no-user'}</div>
            <div data-testid="hook-client-id">{auth.clientId || 'no-client'}</div>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestAuthHook />
        </AppProvider>
      );

      expect(screen.getByTestId('hook-auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('hook-current-user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('hook-client-id')).toHaveTextContent('no-client');
    });

    test('usePreferences hook should provide preferences state', () => {
      const TestPreferencesHook = () => {
        const { preferences, updatePreferences } = usePreferences();
        
        return (
          <div>
            <div data-testid="hook-theme">{preferences.theme}</div>
            <div data-testid="hook-items-per-page">{preferences.itemsPerPage}</div>
            <button 
              data-testid="hook-update-btn" 
              onClick={() => updatePreferences({ theme: 'light', itemsPerPage: 75 })}
            >
              Update
            </button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestPreferencesHook />
        </AppProvider>
      );

      expect(screen.getByTestId('hook-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('hook-items-per-page')).toHaveTextContent('50');

      act(() => {
        screen.getByTestId('hook-update-btn').click();
      });

      expect(screen.getByTestId('hook-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('hook-items-per-page')).toHaveTextContent('75');
    });
  });
});