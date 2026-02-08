# Guia de Uso

[Voltar ao README](../README.md)

---

## Criar Nova Nota

1. Acesse a pagina inicial em [backs-note.web.app](https://backs-note.web.app)
2. Clique em **"Criar Nova Nota"**
3. O editor sera aberto com um ID unico de 10 caracteres
4. Comece a digitar - as alteracoes sao salvas automaticamente
5. Copie o ID da nota da barra de endereco para compartilhar

---

## Editor Rich Text

O editor utiliza TipTap 3 e suporta:

| Formatacao | Descricao |
|------------|-----------|
| **Negrito** | Selecione o texto e aplique negrito |
| *Italico* | Selecione o texto e aplique italico |
| Listas | Listas ordenadas e nao-ordenadas |
| Cabecalhos | Diferentes niveis de cabecalho |
| Codigo | Blocos de codigo com syntax highlighting |

---

## Aliases com PIN

Aliases permitem criar nomes amigaveis para suas notas em vez de usar o ID de 10 caracteres.

### Criar Alias

1. Na pagina da nota, clique em **"Criar Alias"**
2. Digite um nome amigavel (ex: `minha-lista`, `reuniao-2024`)
3. Defina um PIN de 4-6 digitos
4. O alias sera associado a nota atual

### Acessar via Alias

1. Na pagina inicial, selecione **"Acessar por Alias"**
2. Digite o alias criado
3. Informe o PIN de seguranca
4. A nota sera carregada automaticamente

---

## Acessar Nota Existente

### Por ID

1. Na pagina inicial, selecione **"Acessar Nota Existente"**
2. Digite o ID de 10 caracteres
3. A nota sera carregada

### Por URL

Acesse diretamente: `https://backs-note.web.app/note/{id}`

---

## Cache Local

As notas sao armazenadas em cache no navegador com expiracao de 24 horas. Isso permite:
- Acesso mais rapido a notas visitadas recentemente
- Funcionamento parcial offline
- Reducao de leituras no Firestore

---

## Multi-idioma

A aplicacao suporta 3 idiomas:

| Idioma | Codigo |
|--------|--------|
| Portugues | pt |
| Ingles | en |
| Espanhol | es |

O idioma e detectado automaticamente pelo navegador ou pode ser alterado nas configuracoes.
