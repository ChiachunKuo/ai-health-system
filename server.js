require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// fallback AI（保底）
function localAI(symptom) {
  let result = "建議觀察症狀";
  let risk = 30;
  let department = "一般內科";

  if (symptom.includes("發燒")) {
    result = "可能為感染，建議休息與補水";
    risk = 60;
  }

  if (symptom.includes("咳")) {
    result = "可能為呼吸道問題";
    department = "胸腔科";
    risk = 50;
  }

  if (symptom.includes("胸痛")) {
    result = "⚠️ 疑似心血管問題，請立即就醫";
    department = "心臟內科";
    risk = 90;
  }

  return { result, risk, department };
}

app.post('/analyze', async (req, res) => {
  const { symptom } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `請用醫師語氣分析：${symptom}`
        })
      }
    );

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return res.json({
        result: data[0].generated_text,
        risk: 50,
        department: "建議門診"
      });
    }

    throw new Error("HF失敗");

  } catch (err) {
    const fallback = localAI(symptom);
    res.json(fallback);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
