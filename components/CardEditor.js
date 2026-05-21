const { useState: useStateEditor } = React;

/**
 * Editor de flashcard em tela cheia (overlay).
 * Usa RichEditor para pergunta e resposta: você pode escrever texto e colar
 * imagens com Ctrl+V — elas aparecem inline, junto com o texto.
 *
 * @param {{ card: any, onSave: (formData: FormData) => Promise<void>, onClose: () => void }} props
 */
window.CardEditor = ({ card, onSave, onClose }) => {
  const [questionHtml, setQuestionHtml] = useStateEditor(card.question || '');
  const [answerHtml,   setAnswerHtml]   = useStateEditor(card.answer   || '');

  // Imagens legadas (cards antigos com campo answer_image separado)
  const [removeAnswerImage,   setRemoveAnswerImage]   = useStateEditor(false);
  const [removeQuestionImage, setRemoveQuestionImage] = useStateEditor(false);

  const [loading, setLoading] = useStateEditor(false);
  const [error,   setError]   = useStateEditor(null);

  const hasContent = (html) => {
    if (!html) return false;
    const hasImg  = /<img[\s>]/i.test(html);
    const hasText = html.replace(/<[^>]*>/g, '').trim() !== '';
    return hasImg || hasText;
  };

  const handleSave = async () => {
    if (!hasContent(questionHtml)) {
      setError('Pergunta não pode ser vazia.');
      return;
    }
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append('id',       card.id);
    form.append('question', questionHtml);
    form.append('answer',   answerHtml);
    if (removeAnswerImage)   form.append('remove_answer_image',   '1');
    if (removeQuestionImage) form.append('remove_question_image', '1');

    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Exibe um card de imagem legada com opção de remover
  const legacyImageCard = (src, onRemove) =>
    e(
      'div',
      { className: 'flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700 mt-2' },
      e('img', {
        src,
        alt: 'imagem legada',
        className: 'max-h-24 rounded-lg object-contain border border-slate-700 bg-slate-900',
      }),
      e(
        'div',
        { className: 'flex-1 min-w-0' },
        e('p', { className: 'text-xs text-slate-400 mb-1' }, 'Imagem existente'),
        e('p', { className: 'text-xs text-slate-500 leading-snug' },
          'Esta imagem foi adicionada anteriormente de forma separada. ' +
          'Para substituí-la, remova-a e cole uma nova no campo acima.'
        ),
        e(
          'button',
          {
            type: 'button',
            onClick: onRemove,
            className:
              'mt-2 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/40 ' +
              'hover:border-rose-400/60 px-2 py-1 rounded-lg transition',
          },
          'Remover'
        )
      )
    );

  return e(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      style: { background: 'rgba(7, 15, 32, 0.92)' },
      onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); },
    },
    e(
      'div',
      {
        className:
          'bg-panel border border-slate-700 rounded-3xl w-full max-w-2xl ' +
          'max-h-[92vh] overflow-y-auto shadow-glow flex flex-col',
        onClick: (ev) => ev.stopPropagation(),
      },

      // ── Cabeçalho ──────────────────────────────────────────────────────
      e(
        'div',
        {
          className:
            'flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0',
        },
        e(
          'div',
          null,
          e('p', { className: 'text-xs uppercase tracking-[0.2em] text-slate-400' }, 'Edição'),
          e('h2', { className: 'text-xl font-semibold text-slate-50' }, 'Editar flashcard')
        ),
        e(
          'button',
          {
            type: 'button',
            onClick: onClose,
            className:
              'w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 ' +
              'text-slate-400 hover:text-slate-100 hover:border-slate-500 transition text-xl leading-none',
          },
          '×'
        )
      ),

      // ── Corpo ──────────────────────────────────────────────────────────
      e(
        'div',
        { className: 'p-6 space-y-6 flex-1' },

        // Pergunta
        e(
          'div',
          null,
          e('label', { className: 'block text-sm font-semibold text-slate-300 mb-1.5' }, 'Pergunta'),
          e(RichEditor, {
            initialValue: card.question || '',
            onContentChange: setQuestionHtml,
            placeholder: 'O que você quer perguntar?  (Cole imagem com Ctrl+V)',
            minHeight: '120px',
          }),
          // Imagem legada da pergunta
          card.question_image && !removeQuestionImage &&
            legacyImageCard(card.question_image, () => setRemoveQuestionImage(true))
        ),

        // Resposta
        e(
          'div',
          null,
          e('label', { className: 'block text-sm font-semibold text-slate-300 mb-1.5' }, 'Resposta'),
          e(RichEditor, {
            initialValue: card.answer || '',
            onContentChange: setAnswerHtml,
            placeholder: 'Escreva a resposta ou cole imagem com Ctrl+V.',
            minHeight: '150px',
          }),
          // Imagem legada da resposta
          card.answer_image && !removeAnswerImage &&
            legacyImageCard(card.answer_image, () => setRemoveAnswerImage(true))
        ),

        // Erro
        error &&
          e(
            'p',
            {
              className:
                'text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 ' +
                'rounded-xl px-4 py-3',
            },
            error
          )
      ),

      // ── Rodapé ─────────────────────────────────────────────────────────
      e(
        'div',
        {
          className:
            'flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 ' +
            'bg-slate-900/40 rounded-b-3xl flex-shrink-0',
        },
        e(
          'button',
          {
            type: 'button',
            onClick: onClose,
            disabled: loading,
            className:
              'px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 ' +
              'hover:text-slate-100 hover:border-slate-500 transition text-sm disabled:opacity-50',
          },
          'Cancelar'
        ),
        e(
          'button',
          {
            type: 'button',
            onClick: handleSave,
            disabled: loading,
            className:
              'px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent2 ' +
              'text-slate-900 font-semibold shadow-glow disabled:opacity-70 text-sm',
          },
          loading ? 'Salvando…' : 'Salvar card'
        )
      )
    )
  );
};
