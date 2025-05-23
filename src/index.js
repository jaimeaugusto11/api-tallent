const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());
app.listen(3333);

const apiKey = "AIzaSyBi5bzYsbkqGmQ_lgFUq_a8VCJm77tDs1s"; // coloque sua API Key aqui
const model = "gemini-2.0-flash"; // ou outro modelo Gemini disponível
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const MAX_OUTPUT_TOKENS = 500; // constante para controle interno, só para referência
const TEMPERATURE = 0.8; // constante para controle interno, só para referência

app.get("/api/call", (req, res) => {
  res.send({ message: "Hello World" });
});

app.post("/api/call", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    // Construção do prompt para gerar descrição detalhada e longa
    const prompt = `
   Você é um assistente de recrutamento experiente. Gere uma descrição detalhada, clara e profissional para a vaga abaixo.
   A descrição deve ter pelo menos 300 palavras, incluindo responsabilidades, requisitos e benefícios quando aplicável.

    Vaga: ${userPrompt}

   Por favor, escreva uma descrição envolvente e completa.
   `;

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      // API Gemini v1beta geralmente não aceita temp e max tokens direto,
      // então só usamos no prompt para guiar o texto.
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API Gemini:", errorText);
      return res.status(response.status).send({ error: errorText });
    }

    const data = await response.json();

    const result =
      data.candidates && data.candidates[0] ? data.candidates[0].content : null;

    console.log("Resposta Gemini:", result);
    res.send({ result });
  } catch (error) {
    console.error("Erro na chamada Gemini:", error);
    res.status(500).send({ error: "Erro ao chamar Gemini" });
  }
});
app.post("/api/salario", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    // Construção do prompt para gerar descrição detalhada e longa
    const prompt = `
    Você é um assistente de recrutamento experiente no mercado de trabalho angolano.
    
    Com base na vaga abaixo, estime a **faixa salarial média mensal** em Angola, considerando todos os fatores relevantes: 
    - Nível de senioridade,
    - Setor de atuação,
    - Localização (ex: Luanda, Benguela),
    - Exigências da vaga,
    - Condições atuais do mercado angolano.
    
    A resposta deve ser **curta, direta** e seguir exatamente este formato:
    "Em média, de Kz X até Kz Y por mês."
    
    Vaga: ${userPrompt}
    
    Seja preciso e utilize conhecimento realista e atualizado do mercado de trabalho em Angola.
    `;
    

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      // API Gemini v1beta geralmente não aceita temp e max tokens direto,
      // então só usamos no prompt para guiar o texto.
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API Gemini:", errorText);
      return res.status(response.status).send({ error: errorText });
    }

    const data = await response.json();

    const result =
      data.candidates && data.candidates[0] ? data.candidates[0].content : null;

    console.log("Resposta Gemini:", result);
    res.send({ result });
  } catch (error) {
    console.error("Erro na chamada Gemini:", error);
    res.status(500).send({ error: "Erro ao chamar Gemini" });
  }
});
