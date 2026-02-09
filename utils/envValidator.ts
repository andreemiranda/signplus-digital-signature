
export const validateEnv = () => {
  const required = [
    'VITE_AUTH0_DOMAIN',
    'VITE_AUTH0_CLIENT_ID'
  ];

  const missing = required.filter(key => !(process.env as any)[key]);
  
  if (missing.length > 0) {
    console.log(
      "%c[SignPlus] %cAmbiente de Demonstração (Porta 5173 Ativa)",
      "color: #2563eb; font-weight: bold;",
      "color: #64748b; font-weight: medium;"
    );
  } else {
    console.log(
      "%c[SignPlus] %cProdução: Configurações Auth0 Carregadas",
      "color: #10b981; font-weight: bold;",
      "color: #64748b; font-weight: medium;"
    );
  }
};

/**
 * Retorna a URL de redirecionamento absoluta dinâmica.
 * O Auth0 exige correspondência EXATA. Esta função garante que a URL 
 * termine sempre com "/" para bater com o cadastro no dashboard.
 * 
 * Em desenvolvimento local (Vite), origin será: http://localhost:5173
 * Em produção (Netlify), origin será: https://signplus-digital-signature.netlify.app
 */
export const getRedirectUri = () => {
  // Se houver uma variável de ambiente definida, usa ela mas garante a barra final
  const envUri = (process.env as any).VITE_AUTH0_REDIRECT_URI;
  if (envUri) return envUri.endsWith('/') ? envUri : `${envUri}/`;
  
  // Caso contrário, gera dinamicamente a partir da origem atual (localhost:5173 ou netlify)
  const origin = window.location.origin;
  return origin.endsWith('/') ? origin : `${origin}/`;
};
