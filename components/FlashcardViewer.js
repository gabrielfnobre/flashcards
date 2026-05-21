const { useState: useStateViewer, useEffect: useEffectViewer } = React;

/**
 * Área principal de estudo: exibe o card atual com suporte a conteúdo rico
 * (texto + imagens inline), navegação, embaralhar, editar e apagar.
 *
 * @param {{ cards:any[], currentIndex:number, onPrev:()=>void, onNext:()=>void,
 *          shuffleOn:boolean, onShuffleToggle:(v:boolean)=>void,
 *          onOpenEditor?:(card:any)=>void,
 *          onDeleteCard?:(id:number)=>void }} props
 */
window.FlashcardViewer = ({
  cards,
  currentIndex,
  onPrev,
  onNext,
  shuffleOn,
  onShuffleToggle,
  onOpenEditor,
  onDeleteCard,
}) => {
  const [showAnswer, setShowAnswer] = useStateViewer(false);

  useEffectViewer(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const card = cards[currentIndex];

  if (!cards.length) {
    return e(
      'div',
      {
        className:
          'flex-1 bg-panel/60 border border-dashed border-slate-800 rounded-3xl ' +
          'min-h-[70vh] flex items-center justify-center text-slate-400',
      },
      'Adicione cards para estudar.'
    );
  }

  /**
   * Renderiza conteúdo que pode ser HTML rico (com imagens inline) ou
   * texto puro (cards antigos). Detecta automaticamente o formato.
   */
  const renderRich = (html, fallbackText) => {
    const content = html || fallbackText || '';
    if (!content) return e('span', { className: 'text-slate-500' }, 'Sem conteúdo.');

    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      return e('div', {
        dangerouslySetInnerHTML: { __html: content },
        className: 'rich-content',
      });
    }
    // Texto puro — preserva quebras de linha
    return e('p', { className: 'whitespace-pre-line text-slate-50 leading-relaxed' }, content);
  };

  // ── Lado da Pergunta ──────────────────────────────────────────────────
  const questionSide = e(
    'div',
    {
      className:
        'h-full flex flex-col items-center justify-center text-center gap-4 p-10 overflow-y-auto',
    },
    e('p', { className: 'text-slate-400 uppercase tracking-[0.3em] text-xs flex-shrink-0' }, 'Pergunta'),
    // Imagem legada da pergunta (cards antigos)
    card.question_image &&
      e('img', {
        src: card.question_image,
        alt: 'Imagem da pergunta',
        className: 'max-h-52 rounded-2xl object-contain border border-slate-700 bg-slate-900/60',
      }),
    e(
      'div',
      { className: 'text-2xl font-semibold text-slate-50 leading-snug max-w-full' },
      renderRich(card.question)
    )
  );

  // ── Lado da Resposta ──────────────────────────────────────────────────
  const hasLegacyImage = !!card.answer_image;
  const hasAnswerText  = !!(card.answer && card.answer.trim());

  const answerSide = e(
    'div',
    {
      className:
        'h-full w-full flex flex-col items-center justify-center gap-4 p-8 overflow-y-auto',
    },
    e('p', { className: 'text-slate-400 uppercase tracking-[0.3em] text-xs flex-shrink-0' }, 'Resposta'),
    // Imagem legada da resposta (cards antigos com campo answer_image separado)
    hasLegacyImage &&
      e('img', {
        src: card.answer_image,
        alt: 'Imagem da resposta',
        className: hasAnswerText
          ? 'max-h-64 object-contain rounded-xl border border-slate-700 mx-auto'
          : 'flex-1 max-h-full object-contain rounded-xl border border-slate-700',
      }),
    hasAnswerText
      ? e(
          'div',
          { className: 'text-xl font-semibold text-slate-50 leading-snug max-w-full' },
          renderRich(card.answer)
        )
      : !hasLegacyImage &&
          e('p', { className: 'text-slate-500' }, 'Sem resposta.')
  );

  return e(
    'div',
    { className: 'flex-1' },

    // ── Barra superior ────────────────────────────────────────────────────
    e(
      'div',
      { className: 'flex items-center justify-between mb-3 px-1' },
      e(
        'div',
        { className: 'flex items-center gap-2' },
        e('span', { className: 'text-xs uppercase tracking-[0.2em] text-slate-400' }, 'Estudo'),
        e(
          'span',
          {
            className:
              'px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700 text-xs text-slate-200',
          },
          `${currentIndex + 1} / ${cards.length}`
        )
      ),
      e(
        'div',
        { className: 'flex gap-2' },
        e(
          'button',
          {
            onClick: () => onShuffleToggle(!shuffleOn),
            className:
              'px-3 py-1.5 rounded-lg border text-sm transition ' +
              (shuffleOn
                ? 'border-accent/60 text-accent bg-accent/10'
                : 'border-slate-700 text-slate-200 bg-slate-800/60 hover:border-slate-600'),
          },
          `Embaralhar ${shuffleOn ? '✔' : ''}`
        ),
        e(
          'button',
          {
            onClick: onPrev,
            className:
              'px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600',
          },
          'Anterior'
        ),
        e(
          'button',
          {
            onClick: onNext,
            className:
              'px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600',
          },
          'Próximo'
        )
      )
    ),

    // ── Card principal ────────────────────────────────────────────────────
    e(
      'div',
      {
        className:
          'relative bg-card border border-slate-800 rounded-3xl min-h-[70vh] ' +
          'overflow-hidden shadow-glow flex flex-col',
      },
      e('div', {
        className:
          'absolute inset-0 pointer-events-none bg-gradient-to-br ' +
          'from-accent/5 via-transparent to-accent2/10',
      }),
      e(
        'div',
        { className: 'flex-1 flex items-center justify-center overflow-hidden' },
        e('div', { className: 'w-full h-full' }, !showAnswer ? questionSide : answerSide)
      ),

      // ── Rodapé do card ──────────────────────────────────────────────────
      e(
        'div',
        {
          className:
            'p-6 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between flex-shrink-0',
        },
        e('div', { className: 'text-sm text-slate-400' }, 'Clique para virar e revelar.'),
        e(
          'div',
          { className: 'flex items-center gap-3' },
          e(
            'button',
            {
              onClick: () => setShowAnswer((v) => !v),
              className:
                'px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 ' +
                'text-slate-900 font-semibold shadow-glow',
            },
            showAnswer ? 'Mostrar pergunta' : 'Ver resposta'
          ),
          e(
            'button',
            {
              onClick: () => onOpenEditor && onOpenEditor(card),
              className:
                'px-3 py-2 rounded-lg border border-slate-600 text-xs text-slate-200 ' +
                'hover:bg-slate-800/80 transition',
            },
            'Editar'
          ),
          e(
            'button',
            {
              onClick: () => {
                if (!onDeleteCard) return;
                if (confirm('Tem certeza que deseja apagar este card?')) {
                  onDeleteCard(card.id);
                }
              },
              className:
                'px-3 py-2 rounded-lg border border-rose-500/60 text-xs text-rose-300 ' +
                'bg-rose-500/5 hover:bg-rose-500/10 transition',
            },
            'Apagar'
          )
        )
      )
    )
  );
};
