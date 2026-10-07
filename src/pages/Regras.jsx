import { useState } from "react";
import "./Regras.css";

const REGRAS_INICIAIS = [
  {
    id: "REG-01",
    setor: "PROFIS (Fiscal / Tributário)",
    criterio: "Execução fiscal, ICMS, CDA, débitos inscritos e cobrança da dívida ativa estadual.",
    palavrasChave: ["ICMS", "dívida ativa", "certidão de dívida", "execução fiscal", "tributário"],
    peso: "Alto",
    ativo: true,
  },
  {
    id: "REG-02",
    setor: "PROASS (Ações Coletivas e Saúde)",
    criterio: "Fornecimento de medicamentos de alto custo, vagas em leitos de UTI e procedimentos SUS.",
    palavrasChave: ["leito UTI", "medicamento", "quimioterapia", "SUS", "tratamento médico"],
    peso: "Crítico",
    ativo: true,
  },
  {
    id: "REG-03",
    setor: "PROESP (Patrimônio e Meio Ambiente)",
    criterio: "Desapropriação, litígios possessórios, demarcação e licenciamento ambiental estadual.",
    palavrasChave: ["desapropriação", "faixa de domínio", "reintegração de posse", "licença ambiental"],
    peso: "Médio",
    ativo: true,
  },
  {
    id: "REG-04",
    setor: "PROPAD (Servidores e Pessoal)",
    criterio: "Concursos públicos, vencimentos, aposentadoria de servidores e processos disciplinares.",
    palavrasChave: ["concurso público", "aposentadoria", "PAD", "adicional de insalubridade", "servidor"],
    peso: "Alto",
    ativo: true,
  },
];

export function Regras() {
  const [regras, setRegras] = useState(REGRAS_INICIAIS);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Formulário de nova regra
  const [novoSetor, setNovoSetor] = useState("");
  const [novoCriterio, setNovoCriterio] = useState("");
  const [novasTags, setNovasTags] = useState("");
  const [novoPeso, setNovoPeso] = useState("Alto");

  function handleToggleRegra(id) {
    setRegras((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ativo: !r.ativo } : r))
    );
  }

  function handleSalvarRegra(e) {
    e.preventDefault();
    if (!novoSetor || !novoCriterio) return;

    const nova = {
      id: `REG-0${regras.length + 1}`,
      setor: novoSetor,
      criterio: novoCriterio,
      palavrasChave: novasTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      peso: novoPeso,
      ativo: true,
    };

    setRegras([nova, ...regras]);
    setNovoSetor("");
    setNovoCriterio("");
    setNovasTags("");
    setNovoPeso("Alto");
    setModalAberto(false);
  }

  const regrasFiltradas = regras.filter(
    (r) =>
      r.setor.toLowerCase().includes(filtro.toLowerCase()) ||
      r.criterio.toLowerCase().includes(filtro.toLowerCase()) ||
      r.palavrasChave.some((p) => p.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="regras-container">
      {/* Cabeçalho da seção */}
      <section className="card regras-hero">
        <div>
          <h2>Critérios e Regras de Triagem</h2>
          <p>
            Configure os parâmetros lógicos, pesos e palavras-chave que guiam o motor de classificação inteligente do PGE Flow.
          </p>
        </div>
        <button
          type="button"
          className="btn p btn-nova-regra"
          onClick={() => setModalAberto(true)}
        >
          + Nova Regra
        </button>
      </section>

      {/* Barra de Busca e Filtro */}
      <div className="regras-toolbar">
        <input
          type="text"
          placeholder="Buscar por setor, palavra-chave ou critério jurídico..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <span className="regras-total">
          {regrasFiltradas.length} regra{regrasFiltradas.length !== 1 ? "s" : ""} ativa{regrasFiltradas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grade de Regras */}
      <div className="regras-grid">
        {regrasFiltradas.map((r) => (
          <div key={r.id} className={`card regra-card ${!r.ativo ? "inativa" : ""}`}>
            <div className="regra-top">
              <div>
                <span className="regra-id">{r.id}</span>
                <span className={`regra-peso ${r.peso.toLowerCase()}`}>{r.peso}</span>
              </div>
              <button
                type="button"
                className={`switch-btn ${r.ativo ? "ativo" : ""}`}
                onClick={() => handleToggleRegra(r.id)}
                title={r.ativo ? "Desativar regra" : "Ativar regra"}
              >
                {r.ativo ? "Ativa" : "Pausada"}
              </button>
            </div>

            <h3 className="regra-setor">{r.setor}</h3>
            <p className="regra-desc">{r.criterio}</p>

            <div className="regra-tags">
              {r.palavrasChave.map((tag, i) => (
                <span key={i} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Formulário de Cadastro de Nova Regra */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <div className="modal-header">
              <h3>Cadastrar Novo Critério de Distribuição</h3>
              <button
                type="button"
                className="btn-fechar"
                onClick={() => setModalAberto(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarRegra} className="modal-form">
              <label>
                Setor / Procuradoria Especializada
                <input
                  type="text"
                  required
                  placeholder="Ex: PROFIS, PROASS, PROPAD..."
                  value={novoSetor}
                  onChange={(e) => setNovoSetor(e.target.value)}
                />
              </label>

              <label>
                Critério de Enquadramento
                <textarea
                  rows="3"
                  required
                  placeholder="Descreva a matéria, fundamentos legais ou objetivo da ação..."
                  value={novoCriterio}
                  onChange={(e) => setNovoCriterio(e.target.value)}
                  style={{ minHeight: "90px" }}
                />
              </label>

              <label>
                Termos e Palavras-chave (separados por vírgula)
                <input
                  type="text"
                  placeholder="Ex: execução fiscal, certidão, débito, ICMS"
                  value={novasTags}
                  onChange={(e) => setNovasTags(e.target.value)}
                />
              </label>

              <label>
                Nível de Prioridade / Peso
                <select
                  value={novoPeso}
                  onChange={(e) => setNovoPeso(e.target.value)}
                >
                  <option value="Crítico">Crítico (Urgente / Liminar)</option>
                  <option value="Alto">Alto</option>
                  <option value="Médio">Médio</option>
                  <option value="Baixo">Baixo</option>
                </select>
              </label>

              <div className="modal-acoes">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn p">
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}