
export const validateEnv = () => {
  const required = [
    'VITE_AUTH0_DOMAIN',
    'VITE_AUTH0_CLIENT_ID',
    'VITE_AUTH0_AUDIENCE'
  ];

  // Verifica se as chaves existem no process.env
  const missing = required.filter(key => !(process.env as any)[key]);
  
  if (missing.length > 0) {
    // No ambiente de demonstração ou desenvolvimento local sem .env, 
    // o sistema utiliza os valores padrão (fallbacks) definidos no App.tsx.
    // Mudamos de console.error para um log informativo para evitar confusão.
    console.log(
      "%c[SignPlus] %cUtilizando configurações de autenticação padrão (Demo Mode)",
      "color: #2563eb; font-weight: bold;",
      "color: #64748b; font-weight: medium;"
    );
  } else {
    console.log(
      "%c[SignPlus] %cAmbiente de produção validado com sucesso",
      "color: #10b981; font-weight: bold;",
      "color: #64748b; font-weight: medium;"
    );
  }
};

export const getRedirectUri = () => {
  // Prioriza a variável de ambiente, senão usa a origem atual formatada
  const envUri = (process.env as any).VITE_AUTH0_REDIRECT_URI;
  if (envUri) return envUri.endsWith('/') ? envUri : `${envUri}/`;
  
  const origin = window.location.origin;
  return origin.endsWith('/') ? origin : `${origin}/`;
};
