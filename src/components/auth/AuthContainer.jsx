// components/auth/AuthContainer.jsx - Main authentication container

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ConfirmationForm from './ConfirmationForm';
import CognitoAuthService from '../../services/cognitoAuth.ts';

const AuthContainer = () => {
  const { state } = useApp();
  const [authView, setAuthView] = useState('login'); // 'login', 'signup', 'confirm'
  const [usernameForConfirmation, setUsernameForConfirmation] = useState('');

  // Handle OAuth redirect if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Clear URL parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);
      CognitoAuthService.handleOAuthRedirect();
    }
  }, []);

  // If user is authenticated, don't show auth forms
  if (state.isAuthenticated) {
    return null;
  }

  const showLogin = () => setAuthView('login');
  const showSignup = () => setAuthView('signup');
  const showConfirmation = (username) => {
    setUsernameForConfirmation(username);
    setAuthView('confirm');
  };
  const showForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log('Forgot password flow not implemented yet');
  };

  const handleConfirmationSuccess = () => {
    setAuthView('login');
    setUsernameForConfirmation('');
  };

  switch (authView) {
    case 'signup':
      return (
        <SignupForm
          onShowLogin={showLogin}
          onShowConfirmation={showConfirmation}
        />
      );
    
    case 'confirm':
      return (
        <ConfirmationForm
          username={usernameForConfirmation}
          onBackToLogin={showLogin}
          onConfirmed={handleConfirmationSuccess}
        />
      );
    
    case 'login':
    default:
      return (
        <LoginForm
          onShowSignup={showSignup}
          onShowForgotPassword={showForgotPassword}
        />
      );
  }
};

export default AuthContainer;