/**
 * Embaralha uma lista (Fisher–Yates) e retorna uma nova instância.
 * @template T
 * @param {T[]} list Lista original.
 * @returns {T[]} Lista embaralhada.
 */
window.shuffleList = (list) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Faz requisições JSON à API, lançando erro em respostas não OK.
 * @param {string} url URL absoluta ou relativa.
 * @param {RequestInit} [options] Opções de fetch.
 * @returns {Promise<any>} Corpo JSON já parseado.
 */
window.fetchJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Erro ao comunicar com o servidor.");
  }
  return data;
};

/**
 * Alias global para `React.createElement`, usado como `e(tipo, props, ...children)`.
 * Evita uso de JSX nos componentes.
 * @type {typeof React.createElement}
 */
window.e = React.createElement;
