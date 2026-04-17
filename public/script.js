function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = 'bubble ' + type;
  div.innerText = text;
  document.getElementById('chat').appendChild(div);
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

  updateRisk(data.risk);
  loadMap(data.department);

  input.value = '';
}

// 📊 儀表板
function updateRisk(risk) {
  document.getElementById('riskFill').style.width = risk + "%";
  document.getElementById('riskText').innerText = "風險：" + risk + "%";
}

// 📍 地圖
function loadMap(keyword) {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 14,
    });

    const service = new google.maps.places.PlacesService(map);

    service.textSearch({
      location: { lat, lng },
      radius: 2000,
      query: keyword + " 診所"
    }, (results, status) => {
      if (status === "OK") {
        results.forEach(place => {
          new google.maps.Marker({
            map,
            position: place.geometry.location
          });
        });
      }
    });
  });
}
