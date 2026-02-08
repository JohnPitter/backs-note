<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)

**Notepad Online para Registro Rapido de Notas**

*Crie, edite e compartilhe notas instantaneamente sem necessidade de login*

[Overview](#overview) •
[Funcionalidades](#funcionalidades) •
[Instalacao](#instalacao) •
[Como Usar](#como-usar) •
[Tecnologias](#tecnologias) •
[Documentacao](#documentacao)

</div>

---

## Overview

Backs Note e um notepad online que permite criar e compartilhar notas de forma rapida e segura. Cada nota possui um ID unico que pode ser compartilhado, ou voce pode criar um alias com PIN para acesso facilitado.

**O que voce obtem:**
- **Notas Instantaneas** - Crie notas sem login ou cadastro
- **Compartilhamento Facil** - ID unico de 10 caracteres para cada nota
- **Aliases com PIN** - Nomes amigaveis protegidos por senha
- **Editor Rich Text** - Formatacao com negrito, italico, listas
- **Criptografia** - Conteudo protegido com AES-256-GCM
- **Multi-idioma** - Portugues, Ingles e Espanhol
- **Sincronizacao** - Alteracoes salvas em tempo real

---

## Demo

| Ambiente | URL |
|----------|-----|
| **Producao** | [backs-note.web.app](https://backs-note.web.app) |
| **GitHub Pages** | [johnpitter.github.io/backs-note](https://johnpitter.github.io/backs-note) |

---

## Funcionalidades

| Funcionalidade | Descricao |
|----------------|-----------|
| **Notas com ID** | Cada nota recebe um ID unico de 10 caracteres |
| **Aliases** | Crie nomes amigaveis como "lista-compras" |
| **PIN de Seguranca** | Proteja aliases com PIN de 4-6 digitos |
| **Editor TipTap** | Rich text com formatacao completa |
| **Criptografia AES** | Conteudo criptografado no servidor |
| **Cache Local** | Acesso offline com cache de 24h |
| **Tema Aurora** | Design glassmorphism moderno |
| **SEO Completo** | Meta tags, Open Graph, JSON-LD |

---

## Instalacao

### Requisitos

| Requisito | Versao |
|-----------|--------|
| Node.js | 20+ |
| npm | 9+ |
| Firebase CLI | 13+ |

### Clone e Instale

```bash
# Clone o repositorio
git clone https://github.com/JohnPitter/backs-note.git
cd backs-note

# Instale as dependencias
npm install

# Configure as variaveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificacao de tipos |
| `npm test` | Executar testes |

---

## Como Usar

### Criar Nova Nota

1. Acesse a pagina inicial
2. Clique em **"Criar Nova Nota"**
3. Comece a digitar - as alteracoes sao salvas automaticamente
4. Copie o ID da nota para compartilhar

### Criar Alias com PIN

1. Na pagina da nota, clique em **"Criar Alias"**
2. Digite um nome amigavel (ex: `minha-lista`)
3. Defina um PIN de 4-6 digitos
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

## Documentacao

| Documento | Descricao |
|-----------|-----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura do projeto |
| [docs/USAGE.md](docs/USAGE.md) | Guia de uso detalhado |
| [FIREBASE_SETUP.md](FIREBASE_SETUP.md) | Configuracao do Firebase |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problemas comuns e solucoes |
| [CHANGELOG.md](CHANGELOG.md) | Historico de alteracoes |

---

## Licenca

Este projeto esta licenciado sob a [GPL-3.0 License](LICENSE).

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudancas (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Suporte

- Abra uma [issue](https://github.com/JohnPitter/backs-note/issues) para reportar bugs
- Use [discussions](https://github.com/JohnPitter/backs-note/discussions) para perguntas

---

<div align="center">

**[Voltar ao topo](#backs-note)**

</div>
