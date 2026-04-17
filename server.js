require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/analyze', async (req, res) => {
  try {
    const { symptom } = req.body;

    // 👉 簡單科別判斷
    let department = "一般內科";
    if (symptom.includes("心") || symptom.includes("胸")) {
      department = "心臟內科";
    } else if (symptom.includes("咳") || symptom.includes("呼吸")) {
      department = "胸腔科";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: '你是醫療輔助AI，只能提供建議'
          },
          {
            role: 'user',
            content: symptom
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({ result: "AI 回應失敗" });
    }

    res.json({
      result: data.choices[0].message.content,
      department
    });

  } catch (err) {
    res.status(500).json({ result: "伺服器錯誤" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});