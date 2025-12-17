const { useState: useStateViewer, useEffect: useEffectViewer } = React;

window.FlashcardViewer = ({ cards, currentIndex, onPrev, onNext, shuffleOn, onShuffleToggle }) => {
  const [showAnswer, setShowAnswer] = useStateViewer(false);

  useEffectViewer(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const card = cards[currentIndex];

  if (!cards.length) {
    return e(
      "div",
      {
        className:
          "flex-1 bg-panel/60 border border-dashed border-slate-800 rounded-3xl min-h-[70vh] flex items-center justify-center text-slate-400",
      },
      "Adicione cards para estudar."
    );
  }

  return e(
    "div",
    { className: "flex-1" },
    e(
      "div",
      { className: "flex items-center justify-between mb-3 px-1" },
      e(
        "div",
        { className: "flex items-center gap-2" },
        e("span", { className: "text-xs uppercase tracking-[0.2em] text-slate-400" }, "Estudo"),
        e(
          "span",
          {
            className:
              "px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700 text-xs text-slate-200",
          },
          `${currentIndex + 1} / ${cards.length}`
        )
      ),
      e(
        "div",
        { className: "flex gap-2" },
        e(
          "button",
          {
            onClick: () => onShuffleToggle(!shuffleOn),
            className:
              "px-3 py-1.5 rounded-lg border text-sm transition " +
              (shuffleOn
                ? "border-accent/60 text-accent bg-accent/10"
                : "border-slate-700 text-slate-200 bg-slate-800/60 hover:border-slate-600"),
          },
          `Embaralhar ${shuffleOn ? "✔" : ""}`
        ),
        e(
          "button",
          {
            onClick: onPrev,
            className:
              "px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600",
          },
          "Anterior"
        ),
        e(
          "button",
          {
            onClick: onNext,
            className:
              "px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600",
          },
          "Próximo"
        )
      )
    ),
    e(
      "div",
      {
        className:
          "relative bg-card border border-slate-800 rounded-3xl min-h-[70vh] overflow-hidden shadow-glow flex flex-col",
      },
      e("div", {
        className: "absolute inset-0 pointer-events-none bg-gradient-to-br from-accent/5 via-transparent to-accent2/10",
      }),
      e(
        "div",
        { className: "flex-1 flex items-center justify-center p-10" },
        e(
          "div",
          { className: "w-full h-full" },
          !showAnswer
            ? e(
                "div",
                { className: "h-full flex flex-col items-center justify-center text-center" },
                e(
                  "p",
                  { className: "text-slate-400 uppercase tracking-[0.3em] text-xs mb-3" },
                  "Pergunta"
                ),
                e(
                  "p",
                  { className: "text-3xl font-semibold text-slate-50 leading-tight" },
                  card.question
                )
              )
            : e(
                "div",
                {
                  className:
                    "h-full w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 flex items-center justify-center",
                },
                card.answer_image
                  ? e("img", {
                      src: card.answer_image,
                      alt: "Resposta em imagem",
                      className: "w-full h-full object-cover",
                    })
                  : e(
                      "div",
                      { className: "p-8 text-center" },
                      e(
                        "p",
                        { className: "text-slate-400 uppercase tracking-[0.3em] text-xs mb-3" },
                        "Resposta"
                      ),
                      e(
                        "p",
                        {
                          className:
                            "text-2xl font-semibold text-slate-50 leading-tight whitespace-pre-line",
                        },
                        card.answer || "Sem resposta de texto."
                      )
                    )
              )
        )
      ),
      e(
        "div",
        { className: "p-6 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between" },
        e("div", { className: "text-sm text-slate-400" }, "Clique para virar e revelar."),
        e(
          "button",
          {
            onClick: () => setShowAnswer((v) => !v),
            className: "px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-slate-900 font-semibold shadow-glow",
          },
          showAnswer ? "Mostrar pergunta" : "Ver resposta"
        )
      )
    )
  );
};
