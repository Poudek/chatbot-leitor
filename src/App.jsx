import { useState } from "react";
import { Rail } from "./components/Rail";
import { Inicio } from "./pages/Inicio";
import { Triagem } from "./pages/Triagem";
import { Entrada } from "./pages/Entrada";
import { Regras } from "./pages/Regras";
import { PROCESSOS } from "./data/processos";
import "./styles.css";

export default function App() {
  const [tela, setTela] = useState("inicio");
  const [processos, setProcessos] = useState(PROCESSOS);
  const [processoAtivoIndex, setProcessoAtivoIndex] = useState(0);
  const [enviados, setEnviados] = useState({});

  // Abre um processo específico na Mesa de Triagem
  function handleAbrirProcesso(index) {
    setProcessoAtivoIndex(index);
    setTela("triagem");
  }

  // Marca processo como encaminhado
  function handleEncaminhar(id) {
    setEnviados((prev) => ({ ...prev, [id]: true }));
  }

  // Recebe um novo processo inserido na tela de Entrada
  function handleNovoProcesso(novoProc) {
    setProcessos((prev) => [novoProc, ...prev]);
    setProcessoAtivoIndex(0);
    setTela("triagem");
  }

  return (
    <div className="app">
      <Rail tela={tela} onMudarTela={setTela} />

      <main className="main">
        <header className="top">
          <div>
            <h1>PGE Flow</h1>
            <small>Sistema de Triagem Inteligente</small>
          </div>

          <div className="user">
            <div className="av">AN</div>
            <span>Analista PGE</span>
          </div>
        </header>

        {tela === "inicio" && (
          <Inicio
            nome="Analista PGE"
            lista={processos}
            enviados={enviados}
            onNovaTriagem={() => setTela("entrada")}
            onAbrir={handleAbrirProcesso}
          />
        )}

        {tela === "triagem" && (
          <Triagem
            lista={processos}
            ativoIndex={processoAtivoIndex}
            enviados={enviados}
            onSelecionarIndex={setProcessoAtivoIndex}
            onEncaminhar={handleEncaminhar}
            onNovaTriagem={() => setTela("entrada")}
          />
        )}

        {tela === "entrada" && (
          <Entrada
            onProcessoCriado={handleNovoProcesso}
            onCancelar={() => setTela("inicio")}
          />
        )}

        {tela === "regras" && <Regras />}

        {tela === "historico" && (
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <h2>Histórico de Encaminhamentos</h2>
            <p style={{ color: "var(--mute)" }}>
              {Object.keys(enviados).length} processo(s) despachado(s) até o momento.
            </p>
          </div>
        )}

        {tela === "dashboard" && (
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <h2>Dashboard Analítico</h2>
            <p style={{ color: "var(--mute)" }}>
              Métricas consolidadas de distribuição e tempo médio de triagem.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}