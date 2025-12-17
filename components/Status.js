const { useMemo } = React;

window.Status = ({ status }) => {
  const classes = useMemo(() => {
    if (!status) return "";
    return status.type === "error"
      ? "text-rose-300 border-rose-500/40 bg-rose-500/10"
      : "text-teal-200 border-teal-500/30 bg-teal-500/5";
  }, [status]);

  if (!status) return null;

  return e(
    "div",
    { className: "mt-3 text-sm border rounded-md px-3 py-2 " + classes },
    status.message
  );
};
