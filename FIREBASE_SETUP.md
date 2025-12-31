# Firebase Setup Guide

Este guia mostra como configurar o Firebase para o Backs Note.

## 📋 Pré-requisitos

- Conta Google/Firebase
- Node.js instalado
- Firebase CLI instalado: `npm install -g firebase-tools`

## 🔥 Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Digite um nome (ex: "backs-note")
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

## 🗄️ Passo 2: Configurar Firestore Database

1. No menu lateral, vá para **Build > Firestore Database**
2. Clique em "Criar banco de dados" ou "Create database"
3. Selecione o local mais próximo (ex: `southamerica-east1` para Brasil)
4. Escolha **modo de produção** (vamos configurar as rules depois)
5. Clique em "Ativar"

## 🔐 Passo 3: Obter Credenciais

1. Vá para **⚙️ Project Settings** (ícone de engrenagem no menu lateral)
2. Role até "Seus apps" ou "Your apps"
3. Clique no ícone **</>** (Web)
4. Digite um apelido (ex: "backs-note-web")
5. **NÃO** marque "Firebase Hosting" ainda
6. Clique em "Registrar app"
7. **Copie todas as configurações** que aparecem

## 📝 Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e cole as credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=backs-note.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=backs-note
   VITE_FIREBASE_STORAGE_BUCKET=backs-note.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
   VITE_LOG_LEVEL=debug
   ```

## 🛡️ Passo 5: Deploy das Security Rules **[IMPORTANTE]**

**Este é o passo mais importante!** Sem isso, você verá o erro "Missing or insufficient permissions".

### Opção A: Via Firebase Console (Mais Fácil)

1. Vá para **Firestore Database > Rules**
2. **Apague** todo o conteúdo existente
3. **Cole** o conteúdo do arquivo `firestore.rules` deste repositório
4. Clique em "**Publicar**" ou "**Publish**"

### Opção B: Via Firebase CLI (Recomendado)

1. Faça login no Firebase:
   ```bash
   firebase login
   ```

2. Inicialize o Firebase no projeto (apenas primeira vez):
   ```bash
   firebase init firestore
   ```
   - Selecione o projeto que você criou
   - Mantenha `firestore.rules` quando perguntado
   - Mantenha `firestore.indexes.json` quando perguntado

3. Deploy das rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Verifique se as rules foram aplicadas:
   - Firebase Console > Firestore > Rules
   - Deve mostrar as regras do arquivo `firestore.rules`

## ✅ Passo 6: Testar Localmente

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o navegador em `http://localhost:3000`

3. Abra o DevTools (F12) e vá para Console

4. Você deve ver:
   ```
   🐛 Backs Note - Debug Info
   Environment: development
   Log Level: debug
   Firebase Config:
     Project ID: backs-note
     Auth Domain: backs-note.firebaseapp.com
     Has API Key: ✅
     Has App ID: ✅
   ```

5. Crie uma nova nota e verifique se ela é salva sem erros

## 🚀 Passo 7: Configurar Firebase Hosting (Opcional)

1. No Firebase Console, vá para **Build > Hosting**
2. Clique em "Começar" ou "Get started"
3. Siga as instruções (você pode pular os comandos, já temos configurado)

### Deploy Manual

```bash
# Build do projeto
npm run build

# Deploy
firebase deploy --only hosting
```

### Deploy Automático via GitHub Actions

1. Gere uma Service Account:
   - Firebase Console > Project Settings > Service Accounts
   - Clique em "Generate new private key"
   - Salve o arquivo JSON

2. Adicione o secret no GitHub:
   - GitHub repo > Settings > Secrets and variables > Actions
   - New repository secret
   - Nome: `FIREBASE_SERVICE_ACCOUNT`
   - Valor: Cole todo o conteúdo do arquivo JSON

3. Adicione os outros secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

4. Faça um push para `main` e o deploy será automático!

## 🐛 Troubleshooting

### Erro: "Missing or insufficient permissions"

**Causa:** Firestore rules não foram deployadas

**Solução:**
```bash
firebase deploy --only firestore:rules
```

### Erro: "Firebase configuration is missing"

**Causa:** Arquivo `.env.local` não existe ou está incompleto

**Solução:**
1. Copie `.env.example` para `.env.local`
2. Preencha todas as variáveis com valores do Firebase Console

### Erro: "PERMISSION_DENIED" ao criar nota

**Causa:** Rules muito restritivas ou não deployadas

**Solução:**
1. Verifique se as rules foram deployadas
2. No console: `window.backsNote.debug()` para ver se Firebase está conectado
3. Tente executar no Console do Firebase:
   ```javascript
   firebase.firestore().collection('notes').add({
     id: 'test',
     content: 'test',
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     updatedAt: firebase.firestore.FieldValue.serverTimestamp()
   })
   ```

### Como verificar se as rules estão corretas?

1. Firebase Console > Firestore Database > Rules
2. Clique na aba "Rules Simulator" ou "Simulador de regras"
3. Teste:
   - Collection: `notes`
   - Document ID: `test123`
   - Operation: `get` ou `create`
4. Deve mostrar "**Simulação permitida**" ou "**Simulation allowed**"

## 📚 Recursos Adicionais

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
