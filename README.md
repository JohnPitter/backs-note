# Backs Note

Um notepad online para registro rápido de notas com sincronização em tempo real.

## 🚀 Características

- **Sessões por ID**: Cada nota possui um ID único que pode ser compartilhado
- **Sincronização em tempo real**: Alterações são salvas automaticamente
- **Sem autenticação**: Acesso rápido sem necessidade de login
- **Cache offline**: Notas são armazenadas localmente para acesso rápido
- **Design moderno**: Interface limpa e responsiva com tema dark
- **Seguro**: Proteção contra XSS e regras de segurança do Firestore

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Firebase Firestore
- **Hospedagem**: Firebase Hosting
- **Testes**: Vitest + Testing Library
- **CI/CD**: GitHub Actions

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/backs-note.git

# Entre no diretório
cd backs-note

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase
```

## 🔧 Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Execute os testes
npm test

# Execute os testes uma vez
npm run test:run

# Verifique os tipos TypeScript
npm run lint

# Faça o build para produção
npm run build

# Visualize o build de produção
npm run preview
```

## 🔐 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Ative o Firebase Hosting
4. Copie as credenciais do Firebase para o arquivo `.env.local`
5. Configure as regras de segurança do Firestore (já incluídas em `firestore.rules`)

### Variáveis de Ambiente

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deploy

O projeto está configurado para deploy automático via GitHub Actions.

### Configuração do GitHub Secrets

Para habilitar o deploy automático, adicione os seguintes secrets no seu repositório GitHub (Settings > Secrets and variables > Actions):

**Obrigatórios para Build:**
- `VITE_FIREBASE_API_KEY` - API key do Firebase
- `VITE_FIREBASE_AUTH_DOMAIN` - Auth domain (ex: projeto-id.firebaseapp.com)
- `VITE_FIREBASE_PROJECT_ID` - ID do projeto Firebase
- `VITE_FIREBASE_STORAGE_BUCKET` - Storage bucket (ex: projeto-id.appspot.com)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Sender ID
- `VITE_FIREBASE_APP_ID` - App ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Measurement ID para Analytics (opcional)

**Obrigatório para Deploy:**
- `FIREBASE_SERVICE_ACCOUNT` - JSON completo da service account do Firebase
  - Para obter: Firebase Console > Project Settings > Service Accounts > Generate New Private Key

**Nota:** Se o `FIREBASE_SERVICE_ACCOUNT` não estiver configurado, o workflow executará o build e testes, mas pulará o deploy.

### Deploy Manual

```bash
# Faça login no Firebase
firebase login

# Inicialize o projeto (primeira vez)
firebase init

# Faça o build
npm run build

# Deploy
firebase deploy
```

## 📝 Como Usar

1. **Criar uma nova nota**: Acesse a página inicial e clique em "Criar Nova Nota"
2. **Acessar nota existente**: Digite o ID da nota no campo e clique em "Acessar"
3. **Editar nota**: Simplesmente comece a digitar - as alterações são salvas automaticamente
4. **Compartilhar nota**: Copie o ID da nota e compartilhe com outras pessoas

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture:

```
src/
├── components/     # Componentes React reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Serviços (Firebase, Cache)
├── hooks/          # Custom React hooks
├── utils/          # Funções utilitárias
├── types/          # Definições de tipos TypeScript
└── test/           # Configuração de testes
```

## 🧪 Testes

O projeto inclui testes unitários para as principais funcionalidades:

- Geração e validação de IDs
- Sistema de cache
- Serviços Firebase (mocks)

```bash
# Executar testes em watch mode
npm test

# Executar testes uma vez
npm run test:run
```

## 📖 Documentação

Veja o arquivo [CLAUDE.md](./CLAUDE.md) para detalhes sobre os princípios de desenvolvimento e arquitetura do projeto.

Veja o arquivo [CHANGELOG.md](./CHANGELOG.md) para histórico de mudanças.

## 📄 Licença

MIT License - veja o arquivo [LICENSE](./LICENSE) para detalhes.
