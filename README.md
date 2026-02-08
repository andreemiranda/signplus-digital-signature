
# SignPlus - Enterprise Digital Signature Platform 🇧🇷

## 🛠️ Configurações Críticas do Auth0

Para resolver o erro de "Callback URL mismatch", preencha o painel do Auth0 ([manage.auth0.com](https://manage.auth0.com/)) seguindo este padrão dinâmico. O app agora força o uso da barra final `/` para garantir compatibilidade.

### 1. URLs de Aplicação (Copie e Cole)

**Allowed Callback URLs**
```text
http://localhost:3000/, https://signplus-digital-signature.netlify.app/
```

**Allowed Logout URLs**
```text
http://localhost:3000/, https://signplus-digital-signature.netlify.app/
```

**Allowed Web Origins**
```text
http://localhost:3000/, https://signplus-digital-signature.netlify.app/
```

### 2. Configurações de API (JWT)
- No menu **Applications -> Settings**, role até o final e configure o **Application Login URI**: `https://signplus-digital-signature.netlify.app/`.
- O app agora captura o **Access Token (JWT)** automaticamente. Você pode visualizá-lo na aba "Configurações" do sistema após o login.

---

## 🔐 Modo Desenvolvedor (Mock)

Se desejar testar o sistema sem configurar o Auth0, clique no botão azul piscante na tela de login: **"Acesso Desenvolvedor (Mock)"**.
- Isso criará uma sessão local simulada com privilégios de administrador.

---

## ✨ Arquitetura de Navegação
O app utiliza **Hash Routing** (`/#aba`). Isso permite que você navegue entre as funcionalidades sem que o servidor precise de configurações complexas de redirecionamento, mantendo o domínio base limpo para a integração com provedores de identidade.
