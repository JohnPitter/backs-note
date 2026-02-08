# Arquitetura do Projeto

[Voltar ao README](../README.md)

---

## Visao Geral

Backs Note e construido com React 19, TypeScript e Vite, utilizando Firebase Firestore como backend e AES-256-GCM para criptografia do conteudo das notas.

---

## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizaveis
│   └── editor/     # Extensoes do TipTap
├── pages/          # Paginas (Home, NotePage)
├── services/       # Firebase, Cache, Crypto, Alias
├── hooks/          # Custom hooks (useNote, useAlias)
├── utils/          # Utilitarios (logger, idGenerator)
├── types/          # Definicoes TypeScript
└── i18n/           # Traducoes (pt, en, es)
```

---

## Camadas

### Components

Componentes React reutilizaveis da interface:
- **NoteEditor** - Textarea para edicao de notas com TipTap
- **ErrorMessage** - Exibicao de erros
- **LoadingSpinner** - Estado de carregamento

### Pages

Paginas da aplicacao:
- **Home** - Pagina inicial para criar ou acessar notas
- **NotePage** - Pagina do editor de notas

### Services

Logica de negocio:
- **firebase.ts** - Inicializacao do Firebase
- **noteService.ts** - CRUD no Firestore com criptografia
- **cryptoService.ts** - Criptografia AES-256-GCM
- **cacheService.ts** - Cache no LocalStorage com expiracao de 24h
- **analyticsService.ts** - Firebase Analytics

### Hooks

Custom hooks para gerenciamento de estado:
- **useNote** - Busca e sincronizacao em tempo real das notas
- **useAlias** - Gerenciamento de aliases com PIN

---

## Criptografia

O conteudo das notas e criptografado antes de ser armazenado no Firestore:

| Propriedade | Valor |
|-------------|-------|
| Algoritmo | AES-GCM |
| Tamanho da chave | 256 bits |
| IV | 12 bytes, gerado aleatoriamente por criptografia |
| Formato | `{base64(iv)}:{base64(ciphertext)}` |
| Chave | 64 caracteres hexadecimais (256 bits) |

---

## CI/CD Pipeline

O pipeline roda em push/PR para main com 5 jobs:

| Job | Descricao |
|-----|-----------|
| **Lint** | Verificacao de tipos TypeScript |
| **Test** | Testes unitarios via Vitest |
| **Build** | Bundle de producao (artifact uploaded) |
| **Deploy Firebase** | Firebase Hosting (apenas branch main) |
| **Deploy GitHub Pages** | GitHub Pages com base path `/backs-note/` (apenas branch main) |

---

## Variaveis de Ambiente

Crie `.env.local` para desenvolvimento local:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=     # opcional
VITE_ENCRYPTION_KEY=              # 64 caracteres hexadecimais
VITE_LOG_LEVEL=debug              # debug | info | warn | error | none
```
