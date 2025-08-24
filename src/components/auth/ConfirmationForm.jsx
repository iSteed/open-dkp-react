// components/auth/ConfirmationForm.jsx - Email confirmation form component

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Mail, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import CognitoAuthService from '../../services/cognitoAuth.ts';

const ConfirmationForm = ({ username, onBackToLogin, onConfirmed }) => {
  const { state, actions } = useApp();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await actions.confirmSignUp(username, confirmationCode);
      if (success) {
        onConfirmed();
      }
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      const result = await CognitoAuthService.resendConfirmationCode(username);
      if (result.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Confirm your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We sent a confirmation code to your email address. Enter the code below to verify your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {state.error.authentication && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Confirmation Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {state.error.authentication}
                  </div>
                </div>
              </div>
            </div>
          )}

          {resendSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Code Sent
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    A new confirmation code has been sent to your email.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Username:</span> {username}
              </p>
            </div>

            <div>
              <label htmlFor="confirmationCode" className="sr-only">
                Confirmation Code
              </label>
              <input
                id="confirmationCode"
                name="confirmationCode"
                type="text"
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                placeholder="Enter confirmation code"
                maxLength="6"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                The code is usually 6 digits long
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || state.loading.authentication || !confirmationCode.trim()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {(isSubmitting || state.loading.authentication) ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Confirm Email'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationForm;