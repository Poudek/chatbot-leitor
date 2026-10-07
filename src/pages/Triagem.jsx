import { useState } from "react";
import "./Triagem.css";

export function Triagem({
  lista = [],
  ativoIndex = 0,
  enviados = {},
  onSelecionarIndex,
  onEncaminhar,
  onNovaTriagem
}) {
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // Garante que pega um processo válido mesmo se o índice oscilar
  const processo = lista[ativoIndex] || lista[0];

  if (!processo) {
    return (
      <div className="card vazio-card">
        <h3>Nenhum processo na fila</h3>
        <p>Cadastre uma nova peça jurídica para iniciar a triagem.</p>
        <button className="btn p" onClick={onNovaTriagem}>
          + Nova triagem
        </button>
      </div>
    );
  }

  // Compatibilidade com diferentes formatos de setores/sugestões no mock
  const setores = processo.setores || processo.sugestoes || [["Setor Geral", 85]];
  const principalSetor = Array.isArray(setores[0]) ? setores[0][0] : (setores[0]?.nome || "Geral");
  const principalConf = Array.isArray(setores[0]) ? setores[0][1] : (setores[0]?.confianca || 80);

  const jaEnviado = Boolean(enviados[processo.id]);

  function handleDespachar() {
    if (onEncaminhar) onEncaminhar(processo.id);
    setMensagemSucesso(true);

    setTimeout(() => {
      setMensagemSucesso(false);
      // Avança para o próximo não encaminhado
      const proximo = lista.findIndex((p, idx) => idx > ativoIndex && !enviados[p.id]);
      if (proximo !== -1 && onSelecionarIndex) {
        onSelecionarIndex(proximo);
      }
    }, 1000);
  }

  return (
    <div className="triagem-container">
      {/* 1. FILA DE PROCESSOS SUPERIOR */}
      <section className="queue" aria-label="Fila de processos">
        {lista.map((p, idx) => {
          const isAtivo = idx === ativoIndex;
          const isEnv = Boolean(enviados[p.id]);
          const conf = Array.isArray(p.setores?.[0]) ? p.setores[0][1] : 75;

          return (
            <button
              key={p.id || idx}
              type="button"
              className={`q ${isAtivo ? "on" : ""} ${isEnv ? "enviado" : ""}`}
              onClick={() => onSelecionarIndex && onSelecionarIndex(idx)}
            >
              <div className="q-topo">
                <b>{p.id}</b>
                <span className="q-tag">{conf}%</span>
              </div>
              <span className="q-titulo">{p.titulo || "Sem título"}</span>
              {isEnv && <small className="q-status">✓ Encaminhado</small>}
            </button>
          );
        })}

        <button
          type="button"
          className="q q-novo"
          onClick={onNovaTriagem}
          title="Nova Triagem"
        >
          <span>+ Adicionar</span>
        </button>
      </section>

      {/* 2. ÁREA DE TRABALHO DA TRIAGEM */}
      <div className="work">
        {/* Painel do Documento */}
        <section className="card doc">
          <div className="doc-h">
            <div>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>{processo.id}</span>
              <span style={{ margin: "0 8px" }}>•</span>
              <span>{processo.origem || "Tribunal de Justiça do Ceará"}</span>
            </div>
            <span>{processo.data || "Recebido recentemente"}</span>
          </div>

          <h2>{processo.titulo}</h2>

          <div className="doc-body" style={{ lineHeight: "1.7", fontSize: "15px" }}>
            {processo.texto ? (
              <p style={{ whiteSpace: "pre-wrap" }}>{processo.texto}</p>
            ) : processo.corpo ? (
              <p style={{ whiteSpace: "pre-wrap" }}>{processo.corpo}</p>
            ) : (
              <p>
                Trata-se de manifestação judicial referente a matéria administrativa e tributária
                distribuída para fins de análise prévia e manifestação da Procuradoria Geral do Estado.
              </p>
            )}
          </div>
        </section>

        {/* Painel da IA / Resultado da Classificação */}
        <section className="card res">
          {mensagemSucesso ? (
            <div className="sucesso-msg">
              <div className="icone-check">✓</div>
              <h4>Processo encaminhado!</h4>
              <p>Despacho registrado para <b>{principalSetor}</b> com sucesso.</p>
            </div>
          ) : (
            <div>
              <p className="lbl">SUGESTÃO DO MODELO</p>
              
              <div className="best">
                <div className="ring">
                  <svg width="76" height="76" viewBox="0 0 76 76">
                    <circle className="bg" cx="38" cy="38" r="30" />
                    <circle
                      className="fg"
                      cx="38"
                      cy="38"
                      r="30"
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * principalConf) / 100}
                    />
                  </svg>
                  <b>{principalConf}%</b>
                </div>
                <div>
                  <h3>{principalSetor}</h3>
                  <p>Probabilidade de distribuição</p>
                </div>
              </div>

              <div className="why">
                <b>Parecer do algoritmo:</b> Identificados termos de alta relevância com precedentes
                favoráveis para o encaminhamento ao núcleo setorial correspondente.
              </div>

              <p className="lbl" style={{ marginTop: "18px" }}>OUTRAS OPÇÕES</p>
              <ul className="alt">
                {setores.slice(1, 4).map((s, i) => {
                  const nomeSetor = Array.isArray(s) ? s[0] : s.nome;
                  const pct = Array.isArray(s) ? s[1] : s.confianca;
                  return (
                    <li key={i}>
                      <span>{nomeSetor}</span>
                      <em>{pct}%</em>
                      <div className="bar">
                        <i style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="act" style={{ marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn p"
                  onClick={handleDespachar}
                  disabled={jaEnviado}
                >
                  {jaEnviado ? "Já Encaminhado" : `Encaminhar para ${principalSetor.split(" ")[0]}`}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}