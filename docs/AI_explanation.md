## Visão Geral da Aplicação
- Frontend single-page em `index.html` usando React via CDN + Tailwind (modo dark tech).  
- Sem JSX: todos os componentes usam `React.createElement` com alias global `e`.  
- Componentes ficam em `components/`:
  - `App.js`: orquestra estado de grupos/cards, chamadas à API, embaralhamento e viewer.
  - `Header.js`: cabeçalho estilizado.
  - `GroupForm.js`: cria grupos.
  - `GroupList.js`: lista e seleciona grupos.
  - `CardForm.js`: cria flashcards (texto ou imagem).
  - `FlashcardViewer.js`: exibe card em tela cheia, flip pergunta/resposta, navegação, shuffle toggle.
  - `Status.js`: mensagens de sucesso/erro.
  - `utils.js`: utilitários `fetchJson`, `shuffleList`, e define `window.e`.
  - `config.js`: define `window.API_BASE = "php/api.php"`.
- Backend PHP em `php/`:
  - `setup.php`: cria DB `flashcards_db` e tabelas `groups` e `cards`.
  - `api.php`: endpoints JSON para listar/criar grupos e cards; suporta upload de imagem (salva em `photos/`).
- Uploads de imagens ficam em `photos/` na raiz e são servidos como `photos/<arquivo>`.

## Banco de Dados
- Database: `flashcards_db` (criado via `setup.php` ou on-the-fly por `api.php`).
- Tabelas:
  - `groups` (`id` PK, `name`, `description`, `created_at`).
  - `cards` (`id` PK, `group_id` FK groups.id ON DELETE CASCADE, `question`, `answer`, `answer_image`, `created_at`).
- Charset: utf8mb4. Host padrão: localhost. Usuário padrão: root (ajustar `$dbUser/$dbPass` se necessário).

## API (`php/api.php`)
- Formato JSON; erros retornam `{ "error": "mensagem" }`.
- Ações via query `action`:
  - `list_groups` (GET): retorna `groups`.
  - `create_group` (POST JSON): body `{ name, description? }` → retorna `group`.
  - `list_cards` (GET): requer `group_id` → retorna `cards`.
  - `create_card` (POST multipart): fields `group_id`, `question`, `answer?`, file `answer_image?`. Salva imagem em `photos/` e grava caminho `photos/<nome>`.
- Validações chave: exige pergunta; exige resposta de texto ou imagem; aceita tipos jpeg/png/gif/webp.

## Fluxo do Frontend
1) `App` carrega grupos (`list_groups`); seleciona o primeiro se nenhum ativo.  
2) Ao trocar de grupo, carrega cards (`list_cards`).  
3) Criação:
   - Grupo: `GroupForm` → `create_group` → adiciona no estado e seleciona.  
   - Card: `CardForm` → `create_card` multipart; limpa formulário e injeta no estado.  
4) Viewer:
   - Exibe card em tela cheia; mostra pergunta e, ao virar, resposta ou imagem.
   - Controles: Anterior/Próximo; toggle “Embaralhar” (embaralha ao aplicar); contador posição/total.
   - Ao mudar de card, volta para pergunta.
5) Estado de erro/sucesso exibido via `Status`.

## Estilo e UX
- Tailwind via CDN; tema dark com cores `accent`/`accent2`.  
- Fonte Space Grotesk.  
- Layout: colunas (forms à esquerda, viewer à direita).  
- Imagens de resposta ocupam todo o card (object-cover).

## Arquitetura de Código (sem JSX)
- Alias global `e = React.createElement` em `utils.js`.
- Componentes definidos como funções que retornam `e(...)`.
- `index.html` importa na ordem: config, utils, Status, Header, GroupForm, GroupList, CardForm, FlashcardViewer, App; monta com `ReactDOM.createRoot(...).render(e(App))`.
- Não há bundler/build; tudo roda via CDN + scripts diretos.

## Como Prosseguir / Modificações Futuras
- Para alterar UI/comportamento, edite os componentes em `components/*.js` usando `e()` em vez de JSX.
- Para novos endpoints ou lógica de dados, edite `php/api.php`; se mudar schema, espelhe em `setup.php`.
- Se adicionar campos às tabelas, ajuste:
  - SQL de criação em `setup.php` e `api.php`.
  - Payloads e respostas da API.
  - Formulários e estado nos componentes (`App`, `CardForm`, etc.).
- Para mudar o backend path, atualize `components/config.js` (`API_BASE`) e garanta que uploads continuem em `photos/` ou ajuste os caminhos de leitura no frontend.
- Para novos recursos de estudo (timer, marcação de acertos, filtros), ampliar estado em `App.js` e UI no `FlashcardViewer.js`.
- Para validar tamanhos de imagem ou tipos extras, refine validação em `api.php` (upload) e mensagens no frontend.

## Notas Operacionais
- Servir via XAMPP em `http://localhost/flashcards/`.
- Rodar `http://localhost/flashcards/php/setup.php` uma vez para criar DB.
- Garantir permissão de escrita na pasta `photos/`.
- Sem build step: qualquer mudança em JS/CSS reflete ao recarregar a página.
