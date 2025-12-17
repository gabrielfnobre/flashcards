const { useState } = React;

window.GroupForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const submit = async (eSubmit) => {
    eSubmit.preventDefault();
    if (!name.trim()) {
      setStatus({ type: "error", message: "Dê um nome ao grupo." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const data = await fetchJson(window.API_BASE + "?action=create_group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      setName("");
      setDescription("");
      setStatus({ type: "success", message: "Grupo criado!" });
      onCreated(data.group);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return e(
    "div",
    { className: "bg-panel/70 border border-slate-800 rounded-2xl p-4 shadow-glow" },
    e(
      "div",
      { className: "flex items-center justify-between mb-3" },
      e(
        "div",
        null,
        e("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400" }, "Novo Grupo"),
        e("h2", { className: "text-lg font-semibold text-slate-50" }, "Monte trilhas de estudo")
      ),
      e(
        "div",
        {
          className:
            "h-10 w-10 rounded-full border border-slate-700 flex items-center justify-center text-accent",
        },
        "+"
      )
    ),
    e(
      "form",
      { className: "space-y-3", onSubmit: submit },
      e(
        "div",
        null,
        e("label", { className: "text-sm text-slate-300" }, "Nome"),
        e("input", {
          value: name,
          onChange: (ev) => setName(ev.target.value),
          className:
            "mt-1 w-full rounded-lg bg-card border border-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/30 px-3 py-2 text-slate-100",
          placeholder: "Ex: Frontend, Inglês, Certificação...",
        })
      ),
      e(
        "div",
        null,
        e("label", { className: "text-sm text-slate-300" }, "Descrição (opcional)"),
        e("textarea", {
          value: description,
          onChange: (ev) => setDescription(ev.target.value),
          className:
            "mt-1 w-full rounded-lg bg-card border border-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/30 px-3 py-2 text-slate-100",
          rows: "2",
          placeholder: "O que você vai treinar aqui?",
        })
      ),
      e(
        "button",
        {
          type: "submit",
          disabled: loading,
          className:
            "w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-slate-900 font-semibold shadow-glow disabled:opacity-70",
        },
        loading ? "Criando..." : "Criar grupo"
      ),
      e(Status, { status })
    )
  );
};
