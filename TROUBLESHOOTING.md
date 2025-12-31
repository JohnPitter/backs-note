# Troubleshooting Guide

Este guia ajuda a resolver problemas comuns ao usar o Backs Note.

## Erro: "Erro ao carregar nota" / Firebase não conecta

### Causa 1: Variáveis de ambiente não configuradas

**Sintoma:**
```
Firebase configuration incomplete. Missing: VITE_FIREBASE_API_KEY, ...
```

**Solução:**
1. Verifique se você criou o arquivo `.env.local` na raiz do projeto
2. Copie o conteúdo de `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
3. Preencha todas as variáveis com suas credenciais do Firebase
4. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Causa 2: Ad-blocker bloqueando Google Analytics

**Sintoma:**
```
GET https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-... net::ERR_BLOCKED_BY_CLIENT
```

**Explicação:**
Este erro é **normal e esperado** se você usar ad-blockers (uBlock Origin, AdBlock, etc.). O Google Analytics está sendo bloqueado, mas isso **não afeta** o funcionamento principal do app.

**Solução:**
- Nenhuma ação necessária! O app funciona normalmente sem Analytics
- Para habilitar Analytics (opcional):
  1. Desabilite o ad-blocker para `localhost:3000`
  2. Ou ignore o erro - ele não impacta as funcionalidades

### Causa 3: Credenciais do Firebase incorretas

**Sintoma:**
- Erro ao criar/carregar notas
- Mensagens de "permission denied"

**Solução:**
1. Verifique se as credenciais no `.env.local` estão corretas
2. Confira no Firebase Console:
   - Project Settings > General > Your apps
3. Certifique-se de que o Firestore Database está ativo:
   - Firebase Console > Build > Firestore Database
   - Se não estiver, clique em "Create database"

### Causa 4: Regras de segurança do Firestore

**Sintoma:**
```
Permission denied
```

**Solução:**
1. Vá para Firebase Console > Firestore Database > Rules
2. Aplique as regras do arquivo `firestore.rules` do projeto
3. Ou temporariamente use (apenas para testes):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   ⚠️ **ATENÇÃO:** As regras acima são inseguras! Use apenas para testes.

## Erro: "Build failed" no CI/CD

### Causa: TypeScript errors

**Solução:**
```bash
# Rode localmente para ver os erros
npm run lint

# Corrija os erros apontados
```

## Erro: Deploy falha no GitHub Actions

### Causa: Secrets não configurados

**Solução:**
1. Vá para: GitHub repo > Settings > Secrets and variables > Actions
2. Adicione todos os secrets necessários:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID` (opcional)
   - `FIREBASE_SERVICE_ACCOUNT` (necessário apenas para deploy)

## Performance lenta

### Causa: Bundle size grande

**Sintoma:**
- Carregamento inicial lento
- Warning: "chunks are larger than 500 kB"

**Solução:**
Isso é esperado devido ao Firebase SDK. Para melhorar:
1. Use code splitting no futuro
2. Configure manualChunks no vite.config.ts
3. O cache do browser ajudará em carregamentos subsequentes

## Nota não sincroniza

### Verificações:
1. Conexão com internet está ativa?
2. Console do browser mostra erros?
3. Firestore está ativo no Firebase Console?
4. Rules do Firestore permitem write?

### Debug:
1. Abra o DevTools (F12)
2. Vá para Console
3. Procure por erros em vermelho
4. Verifique a aba Network se há requisições falhando

## LocalStorage cheio

**Sintoma:**
```
QuotaExceededError
```

**Solução:**
```javascript
// No console do browser:
localStorage.clear()
```

Ou limpe apenas o cache do Backs Note:
1. DevTools > Application > Local Storage
2. Encontre chaves começando com `backs-note-cache-`
3. Delete-as

## Ainda com problemas?

1. **Verifique os logs do console** (F12 > Console)
2. **Limpe o cache do browser** (Ctrl+Shift+Delete)
3. **Tente em modo anônimo** para descartar extensões
4. **Verifique o status do Firebase**: https://status.firebase.google.com/

## Modo Debug

Para habilitar logs detalhados, abra o DevTools e observe os logs com prefixo:
- `[INFO]` - Operações normais
- `[WARN]` - Avisos (não impedem funcionamento)
- `[ERROR]` - Erros (precisam ser resolvidos)
- `[DEBUG]` - Informações detalhadas (apenas em desenvolvimento)
