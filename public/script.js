function accept() {
  document.getElementById('modal').style.display = 'none';
}

async function send() {
  const input = document.getElementById('input');
  const text = input.value;

  addMessage(text, 'user');

  const res = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptom: text })
  });

  const data = await res.json();

  addMessage(data.result, 'bot');
  addMessage("建議科別：" + data.department, 'bot');

  // 👉 開 Google Map
  openMap(data.department);

  input.value = '';
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = 'bubble ' + type;
  div.innerText = text;
  document.getElementById('chat').appendChild(div);
}

function openMap(dept) {
  const url = `https://www.google.com/maps/search/${dept}`;
  window.open(url, '_blank');
}