const axios = require('axios');
const express = require('express');
const router = express.Router();
const connection = require("../data/db");
const { marked } = require('marked');

const wineFormat = require("../functions/wineFormat");

const sqlBase = `
  SELECT
    W.*,
    D.name AS denomination_name,
    C.name AS category_name,
    R.name AS region_name,
    WN.name AS winemaker_name,
    LC.name AS label_condition_name,
    LC.rating AS label_condition_rating,
    BC.name AS bottle_condition_name,
    BC.rating AS bottle_condition_rating
  FROM wines W
  LEFT JOIN denominations D ON W.denomination = D.id
  LEFT JOIN categories C ON W.category = C.id
  LEFT JOIN regions R ON W.region = R.id
  LEFT JOIN winemakers WN ON W.winemaker = WN.id
  LEFT JOIN label_conditions LC ON W.label_condition = LC.id
  LEFT JOIN bottle_conditions BC ON W.bottle_condition = BC.id
`;

// Config
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "gemma3:1b";

// Model verification middleware
router.use(async (req, res, next) => {
  try {
    const models = await axios.get('http://localhost:11434/api/tags');
    const exists = models.data.models.some(m => m.name === MODEL_NAME);
    if (!exists) {
      return res.status(400).json({
        error: `Model ${MODEL_NAME} not loaded`,
        solution: `Run: ollama pull ${MODEL_NAME}`
      });
    }
    next();
  } catch (err) {
    res.status(503).json({
      error: "Ollama connection failed",
      details: err.message,
      solution: "Ensure Ollama is running on port 11434"
    });
  }
});

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Empty message" });
    }

    // // 1. Get ALL available wines from database
    const [winesResult] = await connection.promise().query(sqlBase);
    // format data with wineFormat
    const wines = winesResult.map(wine => wineFormat(wine, req));

    const wineDetails = wines.map(w => {
      const fullName = `${w.winemaker.name} ${w.vintage} ${w.name} ${w.denomination.name}`;
      return (
        `Wine: ${fullName}
        Category: ${w.category.name}
        Region: ${w.region.name}
        Denomination: ${w.denomination.name}
        Price: €${w.price}
        Producer: ${w.winemaker.name}
        Description: ${w.description}`
      );
    }).join("\n\n");

    const prompt = `
    ROLE:
    You are a professional wine assistant and a digital sommelier.

    RULES:
    1. ONLY recommend or describe wines from the AVAILABLE WINES list below. Do NOT invent wines or details.
    2. NEVER mention wine IDs.
    3. KEEP ANSWERS SHORT, focused, and directly related to the customer's request. Do NOT add background, history, or extra commentary unless specifically asked.
    4. If the customer asks for a specific region, category, producer, denomination, price, or vintage, ONLY suggest wines from the AVAILABLE WINES list that match the requested region (Region), category (Category), producer (Producer), denomination (Denomination), price (Price), or vintage (as part of the wine's full name). If no wines match, say so and do not recommend anything else.

    AVAILABLE WINES:
    ${wineDetails}

    CUSTOMER REQUEST:
    "${message}"
    `;

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0,
        num_predict: 256,
        stop: []
      }
    });

    let reply = response.data.response?.trim()

    // html parser
    // const htmlReply = marked.parse(reply);
    // res.json({ htmlReply });

    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;