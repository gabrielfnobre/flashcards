## Flashcards Tech

Aplicação de flashcards com React (CDN) e Tailwind, backend em PHP + MySQL. Visual moderno/dark, suporte a grupos, cartões com texto ou imagem, flip e embaralhamento.

### Pré-requisitos
- PHP 8+ e MySQL rodando no XAMPP (localhost).
- Servir este diretório em `http://localhost/flashcards/` (padrão do XAMPP htdocs).

### Estrutura
- `index.html` — SPA React/Tailwind.
- `php/api.php` — API para criar/listar grupos e cards (upload de imagem).
- `php/setup.php` — Cria DB e tabelas automaticamente.
- `photos/` — Pasta para imagens das respostas (upload).

### Setup rápido
1) Ajuste credenciais do MySQL em `php/api.php` e `php/setup.php` se necessário (`$dbUser`, `$dbPass`, host/porta).  
2) Garanta permissão de escrita na pasta `photos/`.  
3) Rode uma vez no navegador: `http://localhost/flashcards/php/setup.php`  
   - Cria o banco `flashcards_db` e as tabelas `groups` e `cards`.

### Uso
1) Abra `http://localhost/flashcards/`.  
2) Crie um grupo (nome e descrição opcional).  
3) Com o grupo selecionado, cadastre cards: pergunta + resposta em texto ou imagem.  
4) Estude em tela cheia: clique em “Ver resposta” para virar; use “Embaralhar” para ordem aleatória; navegue com Anterior/Próximo.  
5) Imagens enviadas são salvas em `photos/` e exibidas ocupando o card inteiro na resposta.

### Notas
- A API responde JSON; erros vêm como `{ error: "..."} `.  
- Tipos de imagem aceitos: jpeg, png, gif, webp.  
- Os cards de um grupo são listados em ordem de criação (mais recente primeiro); o viewer embaralha quando a opção está ligada.
