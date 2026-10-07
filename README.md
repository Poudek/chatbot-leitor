# PGE Flow

Protótipo de triagem inteligente de processos: o sistema lê o processo (PDF ou texto colado) e sugere o setor de encaminhamento.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o terminal mostrar (normalmente http://localhost:5173).

## Estrutura

```
src/
  main.jsx              ponto de entrada
  App.jsx               layout geral e navegação entre telas
  styles.css            tema (claro/escuro) e estilos
  components/
    Rail.jsx            barra lateral compacta
    Documento.jsx       texto do processo com palavras-chave destacadas
    Resultado.jsx       setor sugerido, confiança e motivos
  pages/
    Entrada.jsx         envio de PDF/TXT ou texto colado
    Triagem.jsx         mesa de triagem (fila + documento + resultado)
  data/
    processos.js        processos de exemplo
    regras.js           palavras-chave por setor + texto de exemplo
  lib/
    classificar.js      classificação por palavras-chave (protótipo)
```

## O que é simulado

- Arquivos **TXT** são lidos de verdade; **PDF** usa um texto de exemplo. A extração real deve ser feita no back-end (texto do PDF + OCR para escaneados).
- A classificação é por contagem de palavras-chave. O próximo passo natural é trocá-la por uma chamada a uma API (`src/lib/classificar.js`).
- Os módulos Histórico, Base de regras e Dashboard ainda não existem.
