
# SignPlus - Enterprise Digital Signature Platform 🇧🇷

![Auth](https://img.shields.io/badge/Auth-Auth0-orange)
![Deploy](https://img.shields.io/badge/Deploy-Netlify-00ad9f)
![IA](https://img.shields.io/badge/AI-Gemini--3--Pro-blue)

## 🔐 Credenciais de Teste (Homologação)

Para testes rápidos em ambiente de desenvolvimento ou produção:

- **Email**: `admin@signplus.test`
- **Senha**: `SignPlus@Dev2026`

> **Dica de Dev**: O botão **"Acesso Desenvolvedor (Mock)"** na tela de login permite ignorar o Auth0 para testes locais rápidos.

---

## 🛠️ Guia de Configuração Auth0 (Produção)

Para que o login funcione corretamente em `https://signplus-digital-signature.netlify.app/`, configure os seguintes campos no seu painel Auth0:

### 1. Application URIs
- **Application Login URI**: `https://signplus-digital-signature.netlify.app/`
- **Allowed Callback URLs**: `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Allowed Logout URLs**: `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Allowed Web Origins**: `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Back-Channel Logout URI**: `https://signplus-digital-signature.netlify.app/`

### 2. Cross-Origin Verification
- **Allowed Origins (CORS)**: `https://signplus-digital-signature.netlify.app/, http://localhost:3000/`
- **Cross-Origin Verification Fallback URL**: `https://signplus-digital-signature.netlify.app/`

---

## ✨ Funcionalidades Ativas
- **Login Unificado**: Integração via Auth0 (Google, Microsoft, Email).
- **Assinatura Digital**: Suporte a PAdES (PDF) e XAdES (XML).
- **IA Forense**: Explicações técnicas de assinaturas via Gemini 3 Pro.
- **Nuvem**: Integração direta com Assinafy Cloud e Google Drive.

**Endereço do App**: [https://signplus-digital-signature.netlify.app/](https://signplus-digital-signature.netlify.app/)
