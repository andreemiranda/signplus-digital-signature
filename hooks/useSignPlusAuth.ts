
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

export const useSignPlusAuth = () => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();

  const [isDevSession, setIsDevSession] = useState(localStorage.getItem('signplus_dev_session') === 'true');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Credenciais de teste solicitadas
  const mockUser = {
    name: 'Admin Tester (SignPlus@Dev2026)',
    email: 'admin@signplus.test',
    picture: 'https://cdn-icons-png.flaticon.com/512/6009/6009041.png',
    sub: 'mock|dev-123'
  };

  useEffect(() => {
    const getToken = async () => {
      if (auth0IsAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: 'https://signplus-api.com',
            }
          });
          setAccessToken(token);

          const claims: any = await getIdTokenClaims();
          setUserPermissions(claims?.permissions || []);
          setUserRole(claims?.['https://signplus.com.br/roles']?.[0] || null);
        } catch (error) {
          console.error('Erro ao obter token:', error);
        }
      } else if (isDevSession) {
        setAccessToken('mock_dev_token');
        setUserPermissions(['admin:all', 'read:documents', 'sign:documents']);
        setUserRole('Admin');
      }
    };
    getToken();
  }, [auth0IsAuthenticated, isDevSession, getAccessTokenSilently, getIdTokenClaims]);

  const login = async () => {
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  const loginDev = () => {
    localStorage.setItem('signplus_dev_session', 'true');
    setIsDevSession(true);
    window.location.reload();
  };

  const logout = () => {
    if (isDevSession) {
      localStorage.removeItem('signplus_dev_session');
      setIsDevSession(false);
      window.location.reload();
    } else {
      auth0Logout({
        logoutParams: { returnTo: window.location.origin }
      });
    }
  };

  return {
    user: isDevSession ? mockUser : auth0User,
    isAuthenticated: auth0IsAuthenticated || isDevSession,
    isLoading: auth0IsLoading,
    accessToken,
    userPermissions,
    userRole,
    login,
    loginDev,
    loginWithGoogle: () => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } }),
    loginWithMicrosoft: () => loginWithRedirect({ authorizationParams: { connection: 'windowslive' } }),
    logout,
    isAdmin: () => userPermissions.includes('admin:all') || userRole === 'Admin',
  };
};
