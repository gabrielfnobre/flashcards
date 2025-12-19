/**
 * Lista lateral de grupos com seleção e remoção do grupo ativo.
 * @param {{ groups: any[], selectedId: number|null, onSelect: (g:any)=>void, onDeleteGroup?: (id:number)=>void }} props
 */
window.GroupList = ({ groups, selectedId, onSelect, onDeleteGroup }) =>
  e(
    "div",
    { className: "bg-panel/70 border border-slate-800 rounded-2xl p-4" },
    e(
      "div",
      { className: "flex items-center justify-between mb-3" },
      e(
        "div",
        null,
        e("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400" }, "Grupos"),
        e("h2", { className: "text-lg font-semibold text-slate-50" }, "Suas coleções")
      ),
      e("span", { className: "text-xs text-slate-400" }, `${groups.length} ativo(s)`)
    ),
    e(
      "div",
      { className: "grid grid-cols-1 gap-3 max-h-72 overflow-auto pr-1" },
      ...groups.map((g) =>
        e(
          "button",
          {
            key: g.id,
            onClick: () => onSelect(g),
            className:
              "w-full text-left p-3 rounded-xl border transition-all " +
              (selectedId === g.id
                ? "bg-gradient-to-r from-accent/20 to-accent2/20 border-accent/50 shadow-glow"
                : "bg-card border-slate-800 hover:border-slate-700 hover:bg-slate-900"),
          },
          e(
            "div",
            { className: "flex items-center justify-between" },
            e("span", { className: "text-slate-100 font-semibold" }, g.name),
            selectedId === g.id
              ? e("span", { className: "text-xs text-accent" }, "ativo")
              : null
          ),
          g.description
            ? e("p", { className: "text-sm text-slate-400 mt-1" }, g.description)
            : null
        )
      ),
      groups.length === 0
        ? e("p", { className: "text-sm text-slate-500" }, "Nenhum grupo ainda.")
        : null
    ),
    selectedId && onDeleteGroup
      ? e(
          "div",
          { className: "mt-3 flex justify-end" },
          e(
            "button",
            {
              className:
                "px-3 py-1.5 text-xs rounded-lg border border-rose-500/60 text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 transition",
              onClick: () => {
                if (confirm("Tem certeza que deseja apagar este grupo e todos os seus cards?")) {
                  onDeleteGroup(selectedId);
                }
              },
            },
            "Apagar grupo selecionado"
          )
        )
      : null
    );
