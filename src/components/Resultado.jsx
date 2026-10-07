export function Resultado({ p, fase, quente, setQuente, onConfirmar, enviado, reanalisar }) {
  const [melhor, melhorPct] = p.setores[0];
  const C = 2 * Math.PI * 32;
  if (fase === "lendo") return <aside className="card res"><div className="empty">Lendo o processo e procurando sinais…</div></aside>;
  const achados = p.palavras.map(([k,w]) => [k,w]);
  return (
    <aside className="card res" aria-live="polite">
      <p className="lbl">Setor sugerido</p>
      <div className="best">
        <div className="ring" aria-label={"Confiança de "+melhorPct+"%"}>
          <svg width="76" height="76" viewBox="0 0 76 76"><circle className="bg" cx="38" cy="38" r="32"/><circle className="fg" cx="38" cy="38" r="32" strokeDasharray={C} strokeDashoffset={C*(1-melhorPct/100)}/></svg>
          <b>{melhorPct}%</b>
        </div>
        <div><h3>{melhor}</h3><p>{melhorPct>=85?"Confiança alta":melhorPct>=50?"Confiança média, vale conferir":"Poucos sinais, revise manualmente"}</p></div>
      </div>

      <p className="lbl">Outras possibilidades</p>
      <ul className="alt">
        {p.setores.map(([n,v],i)=>(
          <li key={n}><span>{n}</span><em>{v}%</em><div className="bar"><i style={{width:v+"%"}}/></div></li>
        ))}
      </ul>

      <p className="lbl">Palavras que pesaram na decisão (passe o mouse para ver no texto)</p>
      <div className="sig">
        {achados.map(([k,w])=>(
          <button key={k} className={"chip"+(quente===k?" on":"")} onMouseEnter={()=>setQuente(k)} onMouseLeave={()=>setQuente(null)} onFocus={()=>setQuente(k)} onBlur={()=>setQuente(null)}>
            {k}<small>{"●".repeat(w)}</small>
          </button>
        ))}
      </div>

      <div className="why">{p.motivo}</div>

      <div className="act">
        <button className="btn" onClick={reanalisar}>Refazer análise</button>
        <button className="btn p" onClick={onConfirmar} disabled={enviado}>{enviado?"Encaminhado":"Encaminhar para "+melhor.split(" ")[0]}</button>
      </div>
      {enviado && <div className="toast">Encaminhado para {melhor}. Registro salvo no histórico.</div>}
    </aside>
  );
}
