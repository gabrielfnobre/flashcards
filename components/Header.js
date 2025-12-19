/**
 * Cabeçalho principal da aplicação, com título e "badges" de tecnologia/tema.
 */
window.Header = () =>
  e(
    "header",
    { className: "py-6 px-6" },
    e(
      "div",
      { className: "max-w-6xl mx-auto flex items-center justify-between" },
      e(
        "div",
        null,
        e(
          "p",
          { className: "text-sm tracking-widest text-accent font-semibold uppercase" },
          "Modo Estudo"
        ),
        e("h1", { className: "text-3xl font-semibold mt-1 text-slate-50" }, "Flashcards Tech"),
        e(
          "p",
          { className: "text-slate-400 text-sm" },
          "Organize grupos, crie cards e treine em tela cheia."
        )
      ),
      e(
        "div",
        { className: "flex gap-2" },
        e(
          "span",
          {
            className:
              "px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 bg-slate-800/40",
          },
          "React + Tailwind (CDN)"
        ),
        e(
          "span",
          {
            className:
              "px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 bg-slate-800/40",
          },
          "Modo dark"
        )
      )
    )
  );
