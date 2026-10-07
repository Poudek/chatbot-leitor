export function Icon({ d }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

export const ICONS = {
  home: ["M3 11l9-8 9 8", "M5 10v10h14V10"],
  tri: ["M12 5v14", "M5 12h14"],
  mesa: ["M3 3h18v18H3z", "M9 3v18"],
  hist: ["M3 12a9 9 0 1 0 3-6.7", "M3 4v5h5", "M12 8v5l3 2"],
  rules: ["M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z", "M4 19V5"],
  dash: ["M4 20V10", "M10 20V4", "M16 20v-8", "M22 20H2"],
};

// [chave_rota, rótulo, chave_icone]
export const NAV = [
  ["inicio", "Início", "home"],
  ["triagem", "Mesa de Triagem", "mesa"],
  ["entrada", "Nova triagem", "tri"],
  ["historico", "Histórico", "hist"],
  ["regras", "Base de regras", "rules"],
  ["dashboard", "Dashboard", "dash"],
];

export function Rail({ tela, onMudarTela }) {
  return (
    <aside className="rail">
      <div className="logo" title="PGE Flow">
        CE
      </div>

      {NAV.map(([chave, label, icone]) => (
        <button
          key={chave}
          type="button"
          className={`nav ${tela === chave ? "on" : ""}`}
          onClick={() => onMudarTela(chave)}
          aria-label={label}
        >
          <Icon d={ICONS[icone]} />
          <span className="tip">{label}</span>
        </button>
      ))}

      <div className="sp" />
    </aside>
  );
}