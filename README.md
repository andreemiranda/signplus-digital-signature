
# SignPlus - Enterprise Digital Signature Platform 🇧🇷

![Auth](https://img.shields.io/badge/Auth-Auth0-orange)
![Deploy](https://img.shields.io/badge/Deploy-Netlify-00ad9f)

## 🛠️ Configuração Obrigatória no Auth0 (Painel Web)

Para que o login funcione em produção e localmente sem erros de "Callback URL mismatch", preencha os campos no seu Dashboard Auth0 ([manage.auth0.com](https://manage.auth0.com/)) exatamente como abaixo:

### 1. Application URIs
- **Application Login URI**: 
  `https://signplus-digital-signature.netlify.app/`
- **Allowed Callback URLs**: 
  `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Allowed Logout URLs**: 
  `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Allowed Web Origins**: 
  `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`

### 2. Canais de Logout e Verificação
- **Back-Channel Logout URI**: 
  `https://signplus-digital-signature.netlify.app/`
- **Allowed Origins (CORS)**: 
  `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Cross-Origin Verification Fallback URL**: 
  `https://signplus-digital-signature.netlify.app/`

---

## 🔐 Credenciais de Teste (Válidas em Produção)

Para acessar o sistema sem passar pelo fluxo real do Auth0 (ou para testes rápidos), utilize o botão **"Acesso Desenvolvedor (Mock)"** na tela de login.

- **Usuário Simulado**: `admin@signplus.test`
- **Senha Simulada**: `SignPlus@Dev2026`

Se você optar pelo login real via Auth0, certifique-se de configurar as conexões (Google, Social ou Database) no seu Tenant.

---

## ✨ Tecnologias
- **Frontend**: React 19 + Tailwind CSS
- **IA**: Google Gemini 3 Pro (Perícia Forense) e Gemini 3 Flash (Assistente)
- **Auth**: Auth0 SDK (SSO Híbrido)
- **Cloud**: Google Drive API + Assinafy SDK
