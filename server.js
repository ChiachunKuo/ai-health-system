app.post('/analyze', async (req, res) => {
  try {
    const { symptom } = req.body;

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

    // 🔥 印出錯誤（關鍵）
    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ result: "AI服務暫時不可用" });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "伺服器錯誤" });
  }
});
