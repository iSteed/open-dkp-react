// services/cognitoAuth.ts - AWS Cognito Authentication Service

import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  type SignInInput,
  type SignUpInput,
  type ConfirmSignUpInput,
  type ResendSignUpCodeInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';

// Cognito configuration from claudeinput.txt
const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_HPtTdREcv',
      userPoolClientId: '3gjtetfc85ascp4m0t40uiss9s',
      loginWith: {
        oauth: {
          domain: 'us-east-2hpttdrecv.auth.us-east-2.amazoncognito.com',
          scopes: ['email', 'openid', 'phone'],
          redirectSignIn: ['http://localhost:3000/auth/callback'],
          redirectSignOut: ['http://localhost:3000/auth/signout'],
          responseType: 'code',
        },
        email: true,
        phone: true,
      },
    },
  },
};

// Configure Amplify
Amplify.configure(cognitoConfig);

export interface CognitoUser {
  username: string;
  email?: string;
  phone_number?: string;
  sub: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: CognitoUser;
  error?: string;
  requiresConfirmation?: boolean;
}

export class CognitoAuthService {
  // Sign in with email/username and password
  static async signIn(username: string, password: string): Promise<AuthResult> {
    try {
      const signInInput: SignInInput = { username, password };
      const { isSignedIn, nextStep } = await signIn(signInInput);

      if (isSignedIn) {
        const user = await this.getCurrentUser();
        return {
          success: true,
          user: user || undefined,
        };
      }

      // Handle additional sign-in steps if needed
      if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        return {
          success: false,
          requiresConfirmation: true,
          error: 'Account needs to be confirmed. Please check your email.',
        };
      }

      return {
        success: false,
        error: 'Sign-in incomplete. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign-in failed',
      };
    }
  }

  // Sign up new user
  static async signUp(
    username: string,
    password: string,
    email: string,
    phone?: string
  ): Promise<AuthResult> {
    try {
      const signUpInput: SignUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email,
            ...(phone && { phone_number: phone }),
          },
        },
      };

      const { isSignUpComplete, userId, nextStep } = await signUp(signUpInput);

      if (isSignUpComplete) {
        return {
          success: true,
          user: { username, email, sub: userId || username },
        };
      }

      return {
        success: false,
        requiresConfirmation: true,
        error: 'Please check your email to confirm your account.',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign-up failed',
      };
    }
  }

  // Confirm sign-up with verification code
  static async confirmSignUp(username: string, confirmationCode: string): Promise<AuthResult> {
    try {
      const confirmSignUpInput: ConfirmSignUpInput = {
        username,
        confirmationCode,
      };

      const { isSignUpComplete, nextStep } = await confirmSignUp(confirmSignUpInput);

      if (isSignUpComplete) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: 'Confirmation incomplete. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Confirmation failed',
      };
    }
  }

  // Resend confirmation code
  static async resendConfirmationCode(username: string): Promise<AuthResult> {
    try {
      const resendInput: ResendSignUpCodeInput = { username };
      await resendSignUpCode(resendInput);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend code',
      };
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResult> {
    try {
      await signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign-out failed',
      };
    }
  }

  // Get current authenticated user
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (session.tokens?.idToken) {
        const payload = session.tokens.idToken.payload;
        return {
          username,
          email: payload.email as string,
          phone_number: payload.phone_number as string,
          sub: userId,
          email_verified: payload.email_verified as boolean,
          phone_number_verified: payload.phone_number_verified as boolean,
        };
      }

      return {
        username,
        sub: userId,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      return session.tokens !== undefined;
    } catch (error) {
      return false;
    }
  }

  // Get access token for API calls
  static async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Reset password
  static async resetPassword(username: string): Promise<AuthResult> {
    try {
      const resetInput: ResetPasswordInput = { username };
      await resetPassword(resetInput);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  }

  // Confirm password reset with code
  static async confirmResetPassword(
    username: string,
    confirmationCode: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const confirmResetInput: ConfirmResetPasswordInput = {
        username,
        confirmationCode,
        newPassword,
      };

      await confirmResetPassword(confirmResetInput);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset confirmation failed',
      };
    }
  }

  // Handle OAuth redirect
  static handleOAuthRedirect(): void {
    // This will be called when user returns from OAuth flow
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Handle OAuth error
      return;
    }

    if (code) {
      // OAuth code received, Amplify will handle token exchange automatically
      console.log('OAuth code received, processing authentication...');
    }
  }

  // Sign out with redirect to Cognito logout URL
  static signOutWithRedirect(): void {
    const clientId = '3gjtetfc85ascp4m0t40uiss9s';
    const logoutUri = 'http://localhost:3000/auth/signout';
    const cognitoDomain = 'https://us-east-2hpttdrecv.auth.us-east-2.amazoncognito.com';
    
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }
}

export default CognitoAuthService;