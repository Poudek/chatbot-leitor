import { useState } from "react";
import { EXEMPLO } from "../data/regras";

export function Entrada({ onAnalisar }) {
  const [aba, setAba] = useState("pdf");
  const [arquivo, setArquivo] = useState(null);
  const [texto, setTexto] = useState("");
  const [over, setOver] = useState(false);
  const [origem, setOrigem] = useState("");
  const [lendo, setLendo] = useState(false);

  const receber = f => {
    if (!f) return;
    const ok = /\.(pdf|txt)$/i.test(f.name);
    if (!ok) { setArquivo({ erro: "Formato não aceito. Envie um PDF ou TXT." }); return; }
    setArquivo({ nome: f.name, kb: Math.max(1, Math.round(f.size/1024)), f });
  };
  const pronto = aba === "pdf" ? (arquivo && !arquivo.erro) : texto.trim().length > 20;

  const enviar = () => {
    if (aba === "texto") return onAnalisar(texto, origem, null);
    setLendo(true);
    const fim = t => { setLendo(false); onAnalisar(t, origem, arquivo.nome); };
    if (/\.txt$/i.test(arquivo.nome)) {
      const r = new FileReader(); r.onload = () => fim(String(r.result)); r.readAsText(arquivo.f);
    } else {
      // Protótipo: a extração real de PDF seria feita no back-end (texto + OCR para escaneados).
      setTimeout(() => fim(EXEMPLO), 900);
    }
  };

  return (
    <section className="entry" aria-label="Entrada do processo">
      <h2>Traga o processo</h2>
      <p className="sub">Envie o PDF ou cole o texto. O PGE Flow lê o conteúdo e sugere o setor.</p>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={aba==="pdf"} onClick={()=>setAba("pdf")}>Enviar PDF</button>
        <button role="tab" aria-selected={aba==="texto"} onClick={()=>setAba("texto")}>Colar texto</button>
      </div>
      <div className="card ebox">
        {aba === "pdf" ? (
          arquivo && !arquivo.erro ? (
            <div className="file">
              <div className="ic">{/\.pdf$/i.test(arquivo.nome)?"PDF":"TXT"}</div>
              <div><b>{arquivo.nome}</b><small>{arquivo.kb} KB, pronto para leitura</small></div>
              <button className="lnk" onClick={()=>setArquivo(null)}>Trocar arquivo</button>
            </div>
          ) : (
            <label className={"drop"+(over?" over":"")}
              onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
              onDrop={e=>{e.preventDefault();setOver(false);receber(e.dataTransfer.files[0])}}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
              <b>Arraste o PDF para cá</b>
              <p>ou <span style={{color:"var(--accent)",fontWeight:600}}>escolha um arquivo</span> do computador</p>
              <p>PDF ou TXT</p>
              {arquivo && arquivo.erro && <p style={{color:"#C0392B",fontWeight:600}}>{arquivo.erro}</p>}
              <input type="file" accept=".pdf,.txt" hidden onChange={e=>receber(e.target.files[0])}/>
            </label>
          )
        ) : (
          <>
            <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Cole aqui o texto do processo. A primeira linha vira o título." aria-label="Texto do processo"/>
            <div className="efoot" style={{marginTop:8}}>
              <small>{texto.length.toLocaleString("pt-BR")} caracteres</small>
              <button className="lnk" onClick={()=>setTexto(EXEMPLO)}>Usar processo de exemplo</button>
            </div>
          </>
        )}
        <div className="efoot">
          <small>Origem (opcional): <input value={origem} onChange={e=>setOrigem(e.target.value)} placeholder="Ex.: Secretaria da Saúde" style={{border:"1px solid var(--line)",background:"var(--panel)",color:"var(--ink)",borderRadius:8,padding:"5px 9px",font:"inherit",marginLeft:4}}/></small>
          <button className="btn p" disabled={!pronto || lendo} onClick={enviar}>{lendo ? "Lendo o PDF…" : "Analisar processo"}</button>
        </div>
      </div>
      <p className="note">Protótipo: arquivos TXT são lidos de verdade; a leitura de PDF está simulada com um texto de exemplo.</p>
    </section>
  );
}
