const { useRef: useRefRE, useEffect: useEffectRE, useState: useStateRE } = React;

/**
 * Editor de texto rico com suporte a imagens inline coladas via Ctrl+V.
 *
 * - Usa contenteditable nativo do navegador (sem dependências externas).
 * - Ao colar uma imagem, ela é enviada ao servidor e inserida exatamente
 *   onde o cursor está, junto com qualquer texto ao redor.
 * - O conteúdo é armazenado como HTML e pode ser renderizado depois com
 *   dangerouslySetInnerHTML.
 *
 * @param {{
 *   initialValue: string,
 *   onContentChange: (html: string) => void,
 *   placeholder?: string,
 *   minHeight?: string,
 *   className?: string,
 * }} props
 */
window.RichEditor = ({ initialValue, onContentChange, placeholder, minHeight, className }) => {
  const ref      = useRefRE(null);
  const [uploading, setUploading] = useStateRE(false);
  const [empty,     setEmpty]     = useStateRE(true);

  // Inicializa o conteúdo HTML uma única vez ao montar (não reage a
  // mudanças posteriores de initialValue — o DOM é a fonte de verdade).
  useEffectRE(() => {
    if (ref.current) {
      ref.current.innerHTML = initialValue || '';
      setEmpty(isEmptyHtml(initialValue || ''));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Retorna true se o HTML não tem conteúdo visível nem imagens.
  const isEmptyHtml = (html) => {
    if (!html) return true;
    const hasImg  = /<img[\s>]/i.test(html);
    const hasText = html.replace(/<[^>]*>/g, '').trim() !== '';
    return !hasImg && !hasText;
  };

  const handleInput = (ev) => {
    const html = ev.currentTarget.innerHTML;
    setEmpty(isEmptyHtml(html));
    onContentChange(html);
  };

  // Intercepta paste: se o clipboard contiver uma imagem, faz upload e
  // insere <img> no ponto do cursor; texto continua funcionando normalmente.
  const handlePaste = async (ev) => {
    const items = Array.from(ev.clipboardData?.items || []);
    const imgItem = items.find((it) => it.type.startsWith('image/'));
    if (!imgItem) return; // paste de texto — comportamento padrão

    ev.preventDefault();
    const blob = imgItem.getAsFile();
    if (!blob) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', blob, 'paste.jpg');
      const res  = await fetch(window.API_BASE + '?action=upload_image', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar imagem.');

      // Cria o elemento <img> e insere na posição do cursor
      const img = document.createElement('img');
      img.src       = data.url;
      img.className = 'rich-img';

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        // Move cursor para após a imagem
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (ref.current) {
        ref.current.appendChild(img);
      }

      if (ref.current) {
        const html = ref.current.innerHTML;
        onContentChange(html);
        setEmpty(isEmptyHtml(html));
      }
    } catch (err) {
      // Em caso de erro, tenta inserir como base64 local como fallback
      console.error('[RichEditor] upload falhou:', err.message);
      const reader = new FileReader();
      reader.onload = (ev2) => {
        const img = document.createElement('img');
        img.src       = ev2.target.result;
        img.className = 'rich-img';
        if (ref.current) {
          ref.current.appendChild(img);
          const html = ref.current.innerHTML;
          onContentChange(html);
          setEmpty(false);
        }
      };
      reader.readAsDataURL(blob);
    } finally {
      setUploading(false);
    }
  };

  const editorClass =
    className ||
    'w-full rounded-xl bg-card border border-slate-800 ' +
    'focus:border-accent focus:ring-2 focus:ring-accent/30 ' +
    'px-4 py-3 text-slate-100 text-base leading-relaxed outline-none transition';

  return e(
    'div',
    { className: 'relative' },

    // ── Editor contenteditable ──────────────────────────────────────────
    e('div', {
      ref,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onPaste: handlePaste,
      style: { minHeight: minHeight || '100px' },
      className: editorClass,
    }),

    // ── Placeholder (exibido enquanto vazio) ────────────────────────────
    empty && placeholder &&
      e(
        'div',
        {
          className:
            'absolute top-0 left-0 px-4 py-3 text-slate-500 text-base ' +
            'pointer-events-none select-none',
        },
        placeholder
      ),

    // ── Indicador de upload ─────────────────────────────────────────────
    uploading &&
      e(
        'div',
        {
          className:
            'absolute inset-0 bg-slate-900/70 rounded-xl flex items-center justify-center',
        },
        e(
          'span',
          { className: 'text-accent text-sm font-medium animate-pulse' },
          'Enviando imagem…'
        )
      )
  );
};
