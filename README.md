
# SignPlus - Enterprise Digital Signature Platform 🇧🇷

![Status](https://img.shields.io/badge/Status-Produção-emerald)
![Compliance](https://img.shields.io/badge/Conformidade-ICP--Brasil-blue)
![Cloud](https://img.shields.io/badge/Cloud-Assinafy%20%7C%20Drive-indigo)

SignPlus é uma plataforma de alta performance para assinatura, gestão e validação de documentos digitais. Projetada para atender desde o operador individual até fluxos corporativos complexos, a solução combina a soberania da assinatura local (ICP-Brasil) com a agilidade da colaboração em nuvem.

## ✨ Diferenciais de Produção

### 🔐 Assinatura Local (ICP-Brasil)
- **Certificados A1 & A3**: Suporte completo a arquivos `.pfx/.p12` e tokens/smartcards via integração segura.
- **Padrões Suportados**: PAdES (PDF), CAdES e XAdES (XML) com políticas de assinatura atualizadas.
- **Carimbo de Tempo (TSA)**: Garantia de tempestividade com sincronização em Autoridades de Carimbo de Tempo.

### ☁️ Ecossistema Cloud Híbrido
- **Assinafy Cloud**: Fluxo de assinaturas remotas. Envie documentos para a nuvem e solicite assinaturas via E-mail ou WhatsApp sem necessidade de certificados físicos para os signatários finais.
- **Google Drive Sync**: Backup automático e espelhamento de documentos assinados diretamente para sua conta Google via OAuth 2.0.

### 🤖 Inteligência Artificial (Gemini 3 Flash)
- **Perícia Digital Assistida**: O sistema analisa a cadeia de confiança e a integridade do hash, traduzindo resultados técnicos complexos em relatórios simples para o usuário final.
- **Sugestão de Layouts**: Assistente para criação de estampas visuais de assinatura (selos).

## 🛠️ Stack Tecnológica de Elite

- **Frontend**: React 19 com arquitetura de componentes resilientes.
- **Estilização**: Tailwind CSS com foco em acessibilidade e Glassmorphism.
- **Gráficos**: Recharts para monitoramento de volume e expiração de certificados.
- **APIs**:
  - **Google GenAI SDK**: Processamento de linguagem natural para auditoria.
  - **Google Drive API v3**: Integração nativa para armazenamento persistente.
  - **Assinafy API v1**: Motor de assinaturas remotas e workflow de nuvem.

## 🚀 Guia de Configuração

Para operação plena em ambiente de produção, configure os seguintes parâmetros na aba **Configurações**:

1.  **Assinafy Credentials**: Insira seu `Account ID` e sua `API Key` obtidos no console Assinafy.
2.  **Google Authentication**: Realize o login via OAuth para permitir que o SignPlus gerencie a pasta de backups no seu Drive.
3.  **Segurança**: Ative o PIN obrigatório para garantir que nenhuma assinatura seja feita sem autorização explícita do portador do certificado.

## ⚖️ Segurança e Conformidade (Compliance)

O SignPlus adere rigorosamente às normas:
- **MP nº 2.200-2/2001**: Institui a Infraestrutura de Chaves Públicas Brasileira - ICP-Brasil.
- **Lei nº 14.063/2020**: Dispõe sobre o uso de assinaturas eletrônicas em interações com entes públicos e em questões de saúde.
- **DOC-ICP-15**: Requisitos para assinaturas digitais na ICP-Brasil.

---
**SignPlus** - Segurança Jurídica com Experiência de Usuário Superior.
