import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyAI5jIBs2aPgFOwXoSKtrWqXsY1EE67bS4";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const GENERATION_CONFIG = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const chats: Record<string, ChatSession> = {};

export interface Usuario {
  fullName: string;
  birthDate: string;
  knowledgeLevel: string;
  riskTolerance: string;
  objectives: {
    realEstate?: boolean;
    retirement?: boolean;
    shortTermProfit?: boolean;
    emergencyReserve?: boolean;
    other?: boolean;        
    otherText?: string;     
  };
  assetInterests: {
    crypto?: boolean;
    stocks?: boolean;
    fixedIncome?: boolean;
    realEstateFunds?: boolean;
  };
  monthlyIncome: string;
  investmentAmount: string;
  liquidityPreference: string;
  monthlyContribution: {
    amount?: string;
    hasContribution?: boolean;
  };
}

function gerarSystemInstruction(usuario: Usuario): string {
  const preferencias: string[] = [];

  if (usuario.riskTolerance) {
    preferencias.push(`Perfil de risco: ${capitalize(usuario.riskTolerance)}`);
  }

  const ativos = Object.entries(usuario.assetInterests)
    .filter(([_, v]) => v)
    .map(([k]) => k);

  if (ativos.length) {
    preferencias.push(`Interesses em ativos: ${capitalize(ativos.join(", "))}`);
  }

  const objetivos = Object.entries(usuario.objectives)
    .filter(([_, v]) => v)
    .map(([k]) => k);

  if (objetivos.length) {
    preferencias.push(`Objetivos: ${capitalize(objetivos.join(", "))}`);
  }

  return `
Você é um assistente financeiro inteligente. Seu objetivo é ajudar um único usuário com sugestões de investimentos e informações de mercado, com base em suas preferências.
Você deve sempre considerar o perfil do usuário e suas preferências ao responder.
Voce SEMPRE deve utilizar o json para formatar suas respostas.

1. Para mensagens comuns, envie um JSON assim:
{
  "tipo": "mensagem",
  "resposta": "Sugiro considerar fundos de ações voltados para energia limpa."
}

Para dados financeiros como cotação de ações:
{
  "tipo": "dado_financeiro",
  "titulo": "PETR4",
  "descricao": "Preço atual da ação PETR4.",
  "valor": "R$ 36,45",
  "variacao_dia": "+1.12%",
  "fonte": "B3",
  "data": "2025-06-11"
}

Você é um assistente financeiro inteligente e confiável, especializado em fornecer sugestões de investimentos e informações de mercado PERSONALIZADAS com base em dados fornecidos por UM ÚNICO USUÁRIO.

⚠️ SUAS RESPOSTAS DEVEM **OBRIGATORIAMENTE** ESTAR FORMATADAS EM JSON, SEM EXCEÇÃO.

⚠️ É TERMINANTEMENTE PROIBIDO responder fora do formato JSON.

Caso o usuario solicite informações que NÃO sejam de mercado, como notícias ou informações gerais, você deve responder com um JSON indicando que não possui essa informação.
Você deve sempre considerar o perfil do usuário e suas preferências ao responder.

Comportamento:
- Use linguagem clara, amigável e objetiva, com respostas preferencialmente curtas e se forem longas, divida em tópicos.
- Sempre considere as preferências do usuário.
- Evite jargões técnicos, a menos que ele peça explicitamente.

Formatação:

1. Para mensagens comuns de respostas objetivas e curtas, envie um JSON assim, usando obrigatoriamente Markdown no campo resposta tornando todas as mensagens agradáveis e bonitas:
{
  "tipo": "mensagem",
  "resposta": "Sugiro considerar **fundos de ações** voltados para _energia limpa_.\n\n- Opção 1: Fundo A\n- Opção 2: Fundo B"
}

Para dados financeiros como cotação de ações pesquise e envie um JSON assim:
no titulo eu quero symbulo internacional da ação, por exemplo PETR4.SA ou IBMB34.SA ou BBDC4.SA ou AMZN assim por diante 
se for pedido mais de uma acao envie em um array de objetos obrigatoriamente com o seguinte formato:
{
  "tipo": "dado_financeiro",
  "titulo": "Petrobras", 
  "codigo": "PETR4.SA",
  "descricao": "Preço atual da ação PETR4.",
  "valor": "R$ 36,45",
  "variacao_dia": "+1.12%",
  "fonte": "B3",
  "data": "2025-06-11"
}

Contexto do usuário:
${preferencias.join("\n")}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function startChat(usuario: Usuario, mensagemInicial?: string) {
  const userId = usuario.fullName.replace(/\s+/g, "_").toLowerCase();
  const systemInstruction = gerarSystemInstruction(usuario);

const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite", // ou "gemini-1.5-pro"
  generationConfig: GENERATION_CONFIG,
  systemInstruction,
});

  const chat = await model.startChat({ history: [] });
  chats[userId] = chat;

  let resposta: string | undefined = undefined;

  if (mensagemInicial) {
    const result = await chat.sendMessage(mensagemInicial);
    resposta = result.response.text();
  }

  return { userId, resposta };
}

// Função para buscar cotação real na Alpha Vantage
async function fetchStockQuote(symbol: string) {
  const apiKey = "K4WTACFV34B65UT9";

  // Cotação
  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const quoteResponse = await fetch(quoteUrl);
  const quoteData = await quoteResponse.json();
  const globalQuote = quoteData["Global Quote"];
  if (!globalQuote) return null;

  // Moeda
  const currencyUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;
  const currencyResponse = await fetch(currencyUrl);
  const currencyData = await currencyResponse.json();
  const bestMatch = currencyData.bestMatches?.[0];
  const currency = bestMatch ? bestMatch['8. currency'] : "BRL";

  // Formatação do valor
  let valor = Number(globalQuote["05. price"]).toFixed(2);
  if (currency === "USD") valor = `US$ ${valor}`;
  else if (currency === "BRL") valor = `R$ ${valor}`;
  else valor = `${currency} ${valor}`;

  return {
    codigo: globalQuote["01. symbol"],
    valor,
    variacao_dia: globalQuote["10. change percent"],
    data: globalQuote["07. latest trading day"]
  };
}

export async function sendMessage(userId: string, mensagem: string) {
  const chat = chats[userId];
  if (!chat) {
    throw new Error("Sessão de chat não encontrada para este usuário.");
  }

  console.log("Enviando mensagem para Gemini:", mensagem);

  if (mensagem === "TesteGrafico") {
    return [
      {
        tipo: "dado_financeiro",
        titulo: "Petrobras",
        codigo: "PETR4.SA",
        descricao: "Preço atual da ação PETR4.",
        valor: "R$ 36,45",
        variacao_dia: "+1.12%",
        fonte: "B3",
        data: "2025-06-11"
      }
    ];
  }

  const result = await chat.sendMessage(mensagem);
  const respostaTexto = result.response.text();

  console.log("Resposta recebida:", respostaTexto);

  // Função auxiliar para extrair JSON de dentro de blocos de código ou strings
  function extrairJson(texto: string): any {
    // Tenta encontrar um bloco ```json ... ```
    const regexBloco = /```json[\s\n]*([\s\S]*?)[\s\n]*```/i;
    const matchBloco = texto.match(regexBloco);
    if (matchBloco && matchBloco[1]) {
      try {
        return JSON.parse(matchBloco[1]);
      } catch {}
    }
    // Tenta encontrar o primeiro objeto JSON no texto
    const regexJson = /({[\s\S]*})/;
    const matchJson = texto.match(regexJson);
    if (matchJson && matchJson[1]) {
      try {
        return JSON.parse(matchJson[1]);
      } catch {}
    }
    // Tenta parsear diretamente
    try {
      return JSON.parse(texto);
    } catch {}
    // Se não conseguir, retorna como mensagem comum
    return { tipo: "mensagem", resposta: texto };
  }

  // Após extrair o JSON, se for dado_financeiro, busca os dados reais e o histórico
  async function enrichWithRealQuotes(respostaGemini: any): Promise<any> {
    // Função auxiliar para extrair valor, data e variação do histórico
    function getDataFromHistorico(historico: any): { valor?: string, data?: string, variacao_dia?: string } {
      let candles = null;
      if (historico && Array.isArray(historico)) {
        candles = historico;
      } else if (historico && typeof historico === 'object' && historico !== null && Array.isArray(historico.candles)) {
        candles = historico.candles;
      }
      if (candles && candles.length > 0) {
        const last = candles[candles.length - 1];
        const prev = candles.length > 1 ? candles[candles.length - 2] : null;
        const valor = last && typeof last.close === 'number' ? `R$ ${last.close.toFixed(2)}` : undefined;
        const data = last && last.date ? new Date(last.date).toLocaleDateString('pt-BR') : undefined;
        let variacao_dia;
        if (last && prev && typeof last.close === 'number' && typeof prev.close === 'number') {
          const diff = last.close - prev.close;
          const perc = (diff / prev.close) * 100;
          variacao_dia = `${diff >= 0 ? '+' : ''}${perc.toFixed(2)}%`;
        }
        return { valor, data, variacao_dia };
      }
      return {};
    }

    if (Array.isArray(respostaGemini)) {
      return await Promise.all(respostaGemini.map(async (item) => {
        if (item.tipo === "dado_financeiro" && item.codigo) {
          const real = await fetchStockQuote(item.codigo);
          let historico = await fetchDataHistoricChart(item.codigo);
          let fallback = {};
          if (!real) {
            fallback = getDataFromHistorico(historico);
          }
          return { ...item, ...(real || {}), ...fallback, historico };
        }
        return item;
      }));
    } else if (respostaGemini && respostaGemini.tipo === "dado_financeiro" && respostaGemini.codigo) {
      const real = await fetchStockQuote(respostaGemini.codigo);
      let historico = await fetchDataHistoricChart(respostaGemini.codigo);
      console.log("Dados reais obtidos:", real);
      console.log("Histórico obtido:", historico);
      let fallback = {};
      if (!real) {
        fallback = getDataFromHistorico(historico);
      }
      return { ...respostaGemini, ...(real || {}), ...fallback, historico };
    }
    return respostaGemini;
  }

  async function fetchDataHistoricChart(symbol: string) {
    const url = `https://oziwendirtmqquvqkree.supabase.co/functions/v1/fetch-stock-history?symbol=${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aXdlbmRpcnRtcXF1dnFrcmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA4MzksImV4cCI6MjA2MjY2NjgzOX0.PjysWhT8Y32PldsP3OsAefhiKfxjF8naRDhrrSddRVQ',
        'content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  console.log("Extraindo JSON da resposta...");

  const respostaGemini = extrairJson(respostaTexto);
  console.log("JSON extraído:", respostaGemini.codigo);

  // O enrichWithRealQuotes agora já inclui o histórico no retorno
  return await enrichWithRealQuotes(respostaGemini);
}
