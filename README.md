# Backs Note

Um notepad online para registro rápido de notas com sincronização em tempo real.

## Características

- **Sessões por ID**: Cada nota possui um ID único que pode ser compartilhado
- **Aliases com PIN**: Crie nomes amigáveis protegidos por PIN para suas notas
- **Sincronização em tempo real**: Alterações são salvas automaticamente
- **Sem autenticação**: Acesso rápido sem necessidade de login
- **Cache offline**: Notas são armazenadas localmente para acesso rápido
- **Criptografia**: Conteúdo das notas criptografado com AES-256-GCM
- **Multi-idioma**: Suporte para Português, Inglês e Espanhol
- **Design moderno**: Interface glassmorphism com tema Aurora

## Tecnologias

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase Firestore
- **Hospedagem**: Firebase Hosting + GitHub Pages
- **Testes**: Vitest + Testing Library
- **CI/CD**: GitHub Actions

## Como Usar

1. **Criar uma nova nota**: Acesse a página inicial e clique em "Criar Nova Nota"
2. **Acessar nota existente**: Digite o ID da nota no campo e clique em "Acessar"
3. **Criar alias**: Na página da nota, clique em "Criar Alias" para criar um nome amigável com PIN
4. **Acessar via alias**: Use o alias e PIN para acessar sua nota facilmente
5. **Editar nota**: Simplesmente comece a digitar - as alterações são salvas automaticamente
6. **Compartilhar nota**: Copie o ID ou alias da nota e compartilhe

## Arquitetura

```
src/
├── components/     # Componentes React reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Serviços (Firebase, Cache, Crypto)
├── hooks/          # Custom React hooks
├── utils/          # Funções utilitárias
├── types/          # Definições de tipos TypeScript
├── i18n/           # Arquivos de tradução
└── test/           # Configuração de testes
```

## Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/JohnPitter/backs-note.git
cd backs-note

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Execute os testes
npm test

# Faça o build para produção
npm run build
```

## Links

- **Aplicação**: [backs-note.web.app](https://backs-note.web.app)
- **GitHub Pages**: [johnpitter.github.io/backs-note](https://johnpitter.github.io/backs-note)

## Licença

MIT License
