import { REGRAS } from "../data/regras";

export function classificar(texto, id, origem) {
  const linhas = texto.trim().split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const titulo = (linhas[0] || "Processo sem título").slice(0, 70);
  const paragrafos = linhas.length > 1 ? linhas.slice(1) : linhas;
  const baixo = texto.toLowerCase();
  const achadas = []; const pontos = {};
  Object.entries(REGRAS).forEach(([setor, palavras]) => {
    palavras.forEach(k => {
      const n = baixo.split(k.toLowerCase()).length - 1;
      if (n > 0) { const w = Math.min(3, 1 + Math.floor(k.length/9)); achadas.push([k, w, setor]); pontos[setor] = (pontos[setor]||0) + w*Math.min(n,3); }
    });
  });
  const rank = Object.entries(pontos).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const base = { id, titulo, origem: origem || "Origem não informada", entrada: "agora", paragrafos, palavras: achadas.map(a=>[a[0],a[1]]) };
  if (!rank.length) return { ...base, setores: [["Triagem manual",25]], motivo: "Não encontrei palavras que a base de regras reconheça. Leia o processo e encaminhe manualmente; depois vale cadastrar as palavras novas na Base de regras." };
  const total = rank.reduce((a,r)=>a+r[1],0);
  const topo = Math.max(55, Math.min(96, Math.round(50 + 50*rank[0][1]/total)));
  const setores = rank.map(([n,v]) => [n, Math.max(4, Math.round(v/rank[0][1]*topo))]);
  const qtd = achadas.filter(a=>a[2]===rank[0][0]).length;
  return { ...base, setores, motivo: "Encontrei " + qtd + " termo" + (qtd>1?"s":"") + " da regra de " + rank[0][0] + (rank.length>1 ? ", contra poucos sinais dos demais setores." : ", e nenhum sinal dos outros setores.") };
}
