import "./Inicio.css";

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function situacao(p) {
  const pct = p.setores[0][1];
  if (pct < 50) return { rotulo: "Triagem manual", classe: "man", pct };
  if (pct < 85) return { rotulo: "Revisar", classe: "rev", pct };
  return { rotulo: "Pronto para encaminhar", classe: "", pct };
}

export function Inicio({ nome, lista, enviados, onNovaTriagem, onAbrir }) {
  const pendentes = lista
    .map((p, i) => ({ p, i, s: situacao(p) }))
    .filter(x => !enviados[x.p.id])
    .sort((a, b) => a.s.pct - b.s.pct);

  const encaminhados = lista
    .map((p, i) => ({ p, i }))
    .filter(x => enviados[x.p.id])
    .reverse();

  const confMedia = lista.length
    ? Math.round(lista.reduce((soma, p) => soma + p.setores[0][1], 0) / lista.length)
    : 0;

  return (
    <div className="ini">
      <section className="card ini-hero">
        <div>
          <h2>{saudacao()}, {nome ? nome.split(" ")[0] : "Analista"}</h2>
          <p>
            {pendentes.length
              ? `Você tem ${pendentes.length} processo${pendentes.length > 1 ? "s" : ""} esperando encaminhamento.`
              : "Tudo em dia. Nenhum processo esperando encaminhamento."}
          </p>
        </div>
        <button className="ini-cta" onClick={onNovaTriagem}>+ Nova triagem</button>
      </section>

      <section className="ini-stats" aria-label="Resumo de hoje">
        <div className="card ini-stat"><span>Triados hoje</span><b>{lista.length}</b></div>
        <div className="card ini-stat"><span>Encaminhados</span><b>{encaminhados.length}</b></div>
        <div className="card ini-stat"><span>Aguardando</span><b>{pendentes.length}</b></div>
        <div className="card ini-stat"><span>Confiança média</span><b>{confMedia}<small>%</small></b></div>
      </section>

      <div className="ini-cols">
        <section className="card ini-box" aria-label="Precisa da sua atenção">
          <h3>Precisa da sua atenção {pendentes.length > 0 && <span className="ini-count">{pendentes.length}</span>}</h3>
          {pendentes.length === 0 ? (
            <p className="ini-vazio">Nada pendente por aqui.</p>
          ) : (
            <ul className="ini-list">
              {pendentes.map(({ p, i, s }) => (
                <li key={p.id}>
                  <button className="ini-item" onClick={() => onAbrir(i)}>
                    <div>
                      <b>{p.titulo}</b>
                      <small>{p.id}, sugerido: {p.setores[0][0]}</small>
                    </div>
                    <span className="ini-pct">{s.pct}%</span>
                    <span className={"ini-tag " + s.classe}>{s.rotulo}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card ini-box" aria-label="Últimos encaminhamentos">
          <h3>Últimos encaminhamentos</h3>
          {encaminhados.length === 0 ? (
            <p className="ini-vazio">Nenhum processo encaminhado ainda.</p>
          ) : (
            <ul className="ini-list">
              {encaminhados.slice(0, 5).map(({ p, i }) => (
                <li key={p.id}>
                  <button className="ini-item" onClick={() => onAbrir(i)}>
                    <div>
                      <b>{p.setores[0][0]}</b>
                      <small>{p.id}, {p.titulo}</small>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}