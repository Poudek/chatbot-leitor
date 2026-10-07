import React, { useMemo } from "react";

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function Documento({ p, fase, quente }) {
  const re = useMemo(() => !p.palavras.length ? null : new RegExp("(" + p.palavras.map(x=>esc(x[0])).sort((a,b)=>b.length-a.length).join("|") + ")", "gi"), [p]);
  const renderTexto = t => !re ? t : t.split(re).map((parte,i) => {
    const hit = p.palavras.find(x => x[0].toLowerCase() === parte.toLowerCase());
    if (!hit || fase === "lendo") return <React.Fragment key={i}>{parte}</React.Fragment>;
    return <mark key={i} className={quente === hit[0] ? "hot" : ""}>{parte}</mark>;
  });
  return (
    <article className={"card doc"+(fase==="lendo"?" scan":"")}>
      <div className="doc-h"><span>Processo {p.id}</span><span>{p.origem}</span><span>Entrada {p.entrada}</span></div>
      <div className="doc-body">
        <h2>{p.titulo}</h2>
        {p.paragrafos.map((t,i)=><p key={i}>{renderTexto(t)}</p>)}
      </div>
    </article>
  );
}
