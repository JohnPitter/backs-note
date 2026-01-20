# Backs Note

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Notepad Online para Registro Rápido de Notas**

*Crie, edite e compartilhe notas instantaneamente sem necessidade de login*

[Demo](#demo) •
[Funcionalidades](#funcionalidades) •
[Instalação](#instalação) •
[Como Usar](#como-usar) •
[Tecnologias](#tecnologias)

</div>

---

## Overview

Backs Note é um notepad online que permite criar e compartilhar notas de forma rápida e segura. Cada nota possui um ID único que pode ser compartilhado, ou você pode criar um alias com PIN para acesso facilitado.

**O que você obtém:**
- **Notas Instantâneas** - Crie notas sem login ou cadastro
- **Compartilhamento Fácil** - ID único de 10 caracteres para cada nota
- **Aliases com PIN** - Nomes amigáveis protegidos por senha
- **Editor Rich Text** - Formatação com negrito, itálico, listas
- **Criptografia** - Conteúdo protegido com AES-256-GCM
- **Multi-idioma** - Português, Inglês e Espanhol
- **Sincronização** - Alterações salvas em tempo real

---

## Demo

| Ambiente | URL |
|----------|-----|
| **Produção** | [backs-note.web.app](https://backs-note.web.app) |
| **GitHub Pages** | [johnpitter.github.io/backs-note](https://johnpitter.github.io/backs-note) |

---

## Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **Notas com ID** | Cada nota recebe um ID único de 10 caracteres |
| **Aliases** | Crie nomes amigáveis como "lista-compras" |
| **PIN de Segurança** | Proteja aliases com PIN de 4-6 dígitos |
| **Editor TipTap** | Rich text com formatação completa |
| **Criptografia AES** | Conteúdo criptografado no servidor |
| **Cache Local** | Acesso offline com cache de 24h |
| **Tema Aurora** | Design glassmorphism moderno |
| **SEO Completo** | Meta tags, Open Graph, JSON-LD |

---

## Instalação

### Requisitos

| Requisito | Versão |
|-----------|--------|
| Node.js | 20+ |
| npm | 9+ |
| Firebase CLI | 13+ |

### Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/JohnPitter/backs-note.git
cd backs-note

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Verificação de tipos
npm test          # Executar testes
```

---

## Como Usar

### Criar Nova Nota

1. Acesse a página inicial
2. Clique em **"Criar Nova Nota"**
3. Comece a digitar - as alterações são salvas automaticamente
4. Copie o ID da nota para compartilhar

### Criar Alias com PIN

1. Na página da nota, clique em **"Criar Alias"**
2. Digite um nome amigável (ex: `minha-lista`)
3. Defina um PIN de 4-6 dígitos
4. Use o alias e PIN para acessar a nota facilmente

### Acessar Nota Existente

- **Por ID**: Digite o ID de 10 caracteres
- **Por Alias**: Digite o alias e PIN

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Frontend** | React 19, TypeScript 5.6, Vite 6 |
| **Editor** | TipTap 3 |
| **Backend** | Firebase Firestore |
| **Hospedagem** | Firebase Hosting, GitHub Pages |
| **Criptografia** | AES-256-GCM (Web Crypto API) |
| **i18n** | i18next |
| **Testes** | Vitest, Testing Library |
| **CI/CD** | GitHub Actions |

---

## Arquitetura

```
src/
├── components/     # Componentes React reutilizáveis
│   └── editor/     # Extensões do TipTap
├── pages/          # Páginas (Home, NotePage)
├── services/       # Firebase, Cache, Crypto, Alias
├── hooks/          # Custom hooks (useNote, useAlias)
├── utils/          # Utilitários (logger, idGenerator)
├── types/          # Definições TypeScript
└── i18n/           # Traduções (pt, en, es)
```

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">

**[⬆ Voltar ao topo](#backs-note)**

Feito com ❤️ por [John Pitter](https://github.com/JohnPitter)

</div>
