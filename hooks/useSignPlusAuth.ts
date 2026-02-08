
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useCallback, useEffect } from 'react';
import { getRedirectUri } from '../utils/envValidator';
import { logger } from '../utils/logger';

export const useSignPlusAuth = () => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [isDevSession, setIsDevSession] = useState(localStorage.getItem('signplus_dev_session') === 'true');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Captura o JWT Access Token para uso em integrações backend
  useEffect(() => {
    const fetchToken = async () => {
      if (auth0IsAuthenticated && !isDevSession) {
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
          // Opcionalmente salvar no localStorage para persistência entre abas se necessário
          localStorage.setItem('signplus_jwt', token);
        } catch (e) {
          logger.error("Erro ao obter JWT do Auth0", e);
        }
      }
    };
    fetchToken();
  }, [auth0IsAuthenticated, getAccessTokenSilently, isDevSession]);

  const login = useCallback(async () => {
    try {
      const redirectUri = getRedirectUri();
      logger.info(`Redirect URI enviada: ${redirectUri}`);
      
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: redirectUri
        },
        // Salva a aba atual para retornar após o login
        appState: { returnTo: window.location.hash || '#dashboard' }
      });
    } catch (err) {
      logger.error("Erro Crítico no loginWithRedirect", err);
    }
  }, [loginWithRedirect]);

  const logout = useCallback(() => {
    if (isDevSession) {
      localStorage.removeItem('signplus_dev_session');
      localStorage.removeItem('signplus_jwt');
      window.location.hash = '';
      window.location.reload();
    } else {
      const redirectUri = getRedirectUri();
      auth0Logout({ 
        logoutParams: { 
          returnTo: redirectUri 
        } 
      });
    }
  }, [auth0Logout, isDevSession]);

  const loginDev = () => {
    localStorage.setItem('signplus_dev_session', 'true');
    setIsDevSession(true);
    window.location.hash = '#dashboard';
    window.location.reload();
  };

  return {
    user: isDevSession ? { name: 'Admin Tester', email: 'admin@signplus.test' } : auth0User,
    isAuthenticated: auth0IsAuthenticated || isDevSession,
    isLoading: auth0IsLoading,
    accessToken,
    login,
    loginDev,
    logout,
    loginWithGoogle: () => loginWithRedirect({ 
      authorizationParams: { 
        connection: 'google-oauth2',
        redirect_uri: getRedirectUri()
      },
      appState: { returnTo: window.location.hash || '#dashboard' }
    }),
    loginWithMicrosoft: () => loginWithRedirect({ 
      authorizationParams: { 
        connection: 'windowslive',
        redirect_uri: getRedirectUri()
      },
      appState: { returnTo: window.location.hash || '#dashboard' }
    }),
  };
};
