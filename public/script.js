let step = 0;
let answers = {};

// ⚠️ 聲明
function accept() {
  document.getElementById('modal').style.display = 'none';
}

// 🧠 問診流程
function nextStep() {
  const input = document.getElementById('input').value;

  if (step === 0) {
    answers.symptom = input;
    document.getElementById('question').innerText = "症狀持續多久？";
  } 
  else if (step === 1) {
    answers.duration = input;
    document.getElementById('question').innerText = "是否有其他症狀？";
  } 
  else {
    answers.extra = input;
    analyze();
  }

  document.getElementById('input').value = '';
  step++;
}

// 🤖 呼叫後端
async function analyze() {
  addMessage("分析中...", "bot");

  const res = await fetch('/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      symptom: answers.symptom + " " + answers.extra
    })
  });

  const data = await res.json();

  addMessage(data.result, "bot");

  updateRisk(data.risk);
  loadMap(data.department);
}

// 💬 聊天
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = 'bubble ' + type;
  div.innerText = text;
  document.getElementById('chat').appendChild(div);
}

// 📊 風險
function updateRisk(risk) {
  document.getElementById('riskFill').style.width = risk + "%";
  document.getElementById('riskText').innerText = "風險：" + risk + "%";
}

// 📍 地圖（修正版🔥）
function openMap(keyword) {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const url = `https://www.google.com/maps/search/${keyword}+診所/@${lat},${lng},15z`;

    // 📱 手機會開App / 電腦開網頁
    window.open(url, "_blank");
  });
}
