const { useState: useStateCardForm } = React;

window.CardForm = ({ group, onCreated }) => {
  const [question, setQuestion] = useStateCardForm("");
  const [answer, setAnswer] = useStateCardForm("");
  const [file, setFile] = useStateCardForm(null);
  const [loading, setLoading] = useStateCardForm(false);
  const [status, setStatus] = useStateCardForm(null);

  const submit = async (eSubmit) => {
    eSubmit.preventDefault();
    if (!group) {
      setStatus({ type: "error", message: "Escolha um grupo antes." });
      return;
    }
    if (!question.trim()) {
      setStatus({ type: "error", message: "Pergunta obrigatória." });
      return;
    }
    if (!answer.trim() && !file) {
      setStatus({ type: "error", message: "Informe uma resposta ou imagem." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("group_id", group.id);
      form.append("question", question);
      form.append("answer", answer);
      if (file) form.append("answer_image", file);

      const res = await fetch(window.API_BASE + "?action=create_card", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar.");
      setQuestion("");
      setAnswer("");
      setFile(null);
      onCreated(data.card);
      setStatus({ type: "success", message: "Card criado!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return e(
    "div",
    { className: "bg-panel/70 border border-slate-800 rounded-2xl p-4" },
    e(
      "div",
      { className: "flex items-center justify-between mb-3" },
      e(
        "div",
        null,
        e("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400" }, "Novo Card"),
        e("h2", { className: "text-lg font-semibold text-slate-50" }, "Pergunta & resposta")
      ),
      e(
        "span",
        { className: "text-xs text-slate-400" },
        group ? group.name : "Escolha um grupo"
      )
    ),
    e(
      "form",
      { className: "space-y-3", onSubmit: submit },
      e(
        "div",
        null,
        e("label", { className: "text-sm text-slate-300" }, "Pergunta"),
        e("input", {
          value: question,
          onChange: (ev) => setQuestion(ev.target.value),
          className:
            "mt-1 w-full rounded-lg bg-card border border-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/30 px-3 py-2 text-slate-100",
          placeholder: "O que deseja lembrar?",
        })
      ),
      e(
        "div",
        null,
        e("label", { className: "text-sm text-slate-300" }, "Resposta (texto)"),
        e("textarea", {
          value: answer,
          onChange: (ev) => setAnswer(ev.target.value),
          className:
            "mt-1 w-full rounded-lg bg-card border border-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/30 px-3 py-2 text-slate-100",
          rows: "3",
          placeholder: "Escreva a resposta ou use uma imagem.",
        })
      ),
      e(
        "div",
        null,
        e("label", { className: "text-sm text-slate-300" }, "Resposta em imagem (opcional)"),
        e("input", {
          type: "file",
          accept: "image/*",
          onChange: (ev) => setFile(ev.target.files?.[0]),
          className:
            "mt-1 w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-accent/20 file:text-slate-50 file:cursor-pointer bg-card border border-slate-800 rounded-lg",
        }),
        e("p", { className: "text-xs text-slate-500 mt-1" }, "Imagens ocupam todo o card na resposta.")
      ),
      e(
        "button",
        {
          type: "submit",
          disabled: loading,
          className:
            "w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-slate-900 font-semibold shadow-glow disabled:opacity-70",
        },
        loading ? "Salvando..." : "Salvar card"
      ),
      e(Status, { status })
    )
  );
};
