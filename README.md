
# SignPlus - Enterprise Digital Signature Platform 🇧🇷

## 📂 Estrutura de Arquivos Estáticos
Para garantir que o PWA e as imagens do sistema funcionem corretamente, siga a estrutura de pastas abaixo no seu diretório `public` ou `dist`:

```text
/
├── assets/
│   └── images/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── logo.png
├── index.html
├── manifest.json
└── sw.js
```

## 📱 Instalação PWA
O SignPlus está configurado para ser instalado como um App Nativo.
- **Android/Chrome**: Menu > Instalar Aplicativo.
- **iOS/Safari**: Compartilhar > Adicionar à Tela de Início.

## 🛠️ Configurações Auth0 (Vite)
Certifique-se de que no Dashboard do Auth0 as URLs de Callback, Logout e Web Origins apontem para:
- `http://localhost:5173/` (Desenvolvimento)
- `https://signplus-digital-signature.netlify.app/` (Produção)

## 🔐 Modo Mock
Caso não tenha as chaves de API do Auth0 ou Gemini prontas, utilize o botão **"Acesso Desenvolvedor (Mock)"** na tela de login para explorar todas as funcionalidades do painel.
