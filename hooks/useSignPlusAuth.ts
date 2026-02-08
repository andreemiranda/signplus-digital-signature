
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback } from 'react';
import { getRedirectUri } from '../utils/envValidator';
import { logger } from '../utils/logger';

export const useSignPlusAuth = () => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [isDevSession, setIsDevSession] = useState(localStorage.getItem('signplus_dev_session') === 'true');

  const login = useCallback(async () => {
    try {
      const redirectUri = getRedirectUri();
      logger.info(`Iniciando Login com Redirect URI: ${redirectUri}`);
      
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: redirectUri
        },
        appState: { returnTo: window.location.hash || '#dashboard' }
      });
    } catch (err) {
      logger.error("Erro Crítico no LoginWithRedirect", err);
    }
  }, [loginWithRedirect]);

  const logout = useCallback(() => {
    if (isDevSession) {
      localStorage.removeItem('signplus_dev_session');
      window.location.reload();
    } else {
      auth0Logout({ logoutParams: { returnTo: getRedirectUri() } });
    }
  }, [auth0Logout, isDevSession]);

  const loginDev = () => {
    localStorage.setItem('signplus_dev_session', 'true');
    setIsDevSession(true);
    window.location.reload();
  };

  return {
    user: isDevSession ? { name: 'Admin Tester', email: 'admin@signplus.test' } : auth0User,
    isAuthenticated: auth0IsAuthenticated || isDevSession,
    isLoading: auth0IsLoading,
    login,
    loginDev,
    logout,
    loginWithGoogle: () => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } }),
    loginWithMicrosoft: () => loginWithRedirect({ authorizationParams: { connection: 'windowslive' } }),
  };
};
