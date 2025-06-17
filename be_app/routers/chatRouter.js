const axios = require('axios');
const express = require('express');
const router = express.Router();
const connection = require("../data/db");
const { marked } = require('marked');

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
    const [wines] = await connection.promise().query(
      'SELECT name, category, price, vintage, grape_type, region, winemaker, description, denomination FROM wines WHERE stock > 0 ORDER BY price DESC'
    );

    if (wines.length === 0) {
      return res.json({ reply: "We're currently out of stock" });
    }

    const wineDetails = wines.map(w => {

      const fullName = `${w.winemaker} ${w.vintage} ${w.name} ${w.denomination}`;

      return (
        `${fullName}: 
        wine category: ${w.category}, 
        wine region: ${w.region},
        wine denomination: ${w.denomination},
        price: €${w.price}. 
        Producer: ${w.winemaker}. 
        Description: ${w.description}`
      )
    }).join('\n');
    console.log(wineDetails)
    const prompt = `You are a professional wine assistant. Follow these rules STRICTLY:
    
    1. NEVER mention you're an AI or assistant.
    2. If asked for recommendations, suggest 1-2 wines maximum.
    3. ALWAYS include: fullName, price, and why it matches the request.

    Available wines (sorted by price descending):
    ${wineDetails}

    Customer request: "${message}"`;

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