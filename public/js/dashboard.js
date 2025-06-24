import { app } from "./firebase-config.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const db = getFirestore(app);

async function consultarVariable(deviceId, variable, canvasId, label, color) {
  const dataRef = collection(
    db,
    "dispositivos",
    deviceId,
    "variables",
    variable,
    "data"
  );
  const q = query(dataRef, orderBy("timestamp", "desc"), limit(25));

  onSnapshot(q, (snapshot) => {
    const datos = [];
    snapshot.forEach((doc) => {
      datos.push(doc.data());
    });

    renderChart(canvasId, label, datos, color);
  });
}

const chartInstances = {};
function renderChart(canvasId, label, data, color) {
  data.sort((a, b) => {
    const ta =
      typeof a.timestamp === "string"
        ? new Date(a.timestamp)
        : a.timestamp.toDate();
    const tb =
      typeof b.timestamp === "string"
        ? new Date(b.timestamp)
        : b.timestamp.toDate();
    return ta - tb;
  });

  const labels = data.map((d) => {
    let fecha;
    let dateObj;
    if (typeof d.timestamp === "string") {
      dateObj = new Date(d.timestamp);
    } else if (d.timestamp && d.timestamp.toDate) {
      dateObj = d.timestamp.toDate();
    }
    if (dateObj) {
      //Formato: DD-MM-YYYY HH:mm:ss
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const seconds = String(dateObj.getSeconds()).padStart(2, "0");
      fecha = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } else {
      fecha = "";
    }
    return fecha;
  });

  const valores = data.map((d) => d.value);

  const ctx = document.getElementById(canvasId).getContext("2d");
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }
  chartInstances[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: valores,
          borderColor: color,
          backgroundColor: color + "22",
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            title: function (context) {
              return `${context[0].label}`;
            },
            label: function (context) {
              return `value: ${context.parsed.y}`;
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        x: { display: true, title: { display: false } },
        y: { display: true, title: { display: false } },
      },
    },
  });
}

consultarVariable(
  "esp32",
  "temperatura",
  "sensorChart1",
  "Temperatura (°C)",
  "#4e73df"
);

consultarVariable("esp32", "humedad", "sensorChart2", "Humedad (%)", "#1cc88a");

consultarVariable(
  "esp32",
  "distancia",
  "sensorChart3",
  "Distancia (cm)",
  "#f6c23e"
);

consultarVariable("esp32", "flujo", "sensorChart4", "Flujo (L/s)", "#e74a3b");

//Consulta el ultimo dato de lluvia o alarma
async function consultarLLuvia() {
  const dataRef = collection(
    db,
    "dispositivos",
    "esp32",
    "variables",
    "lluvia",
    "data"
  );
  const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));
  onSnapshot(q, (snapshot) => {
    const dato = [];
    snapshot.forEach((doc) => {
      dato.push(doc.data());
    });
    const btn = document.getElementById("lluvia-btn");
    const icono = document.getElementById("lluvia-icono");
    const estado = document.getElementById("lluvia-estado");

    //valor es 0 si esta lloviendo y 1 si no llueve
    if (dato[0].value === 0) {
      btn.classList.remove("bg-secondary");
      btn.classList.add("bg-primary");
      icono.className = "bi bi-cloud-drizzle-fill";
      estado.textContent = "Lloviendo";
      estado.classList.remove("text-muted");
      estado.classList.add("text-primary");
    } else {
      btn.classList.remove("bg-primary");
      btn.classList.add("bg-secondary");
      icono.className = "bi bi-cloud-sun-fill";
      estado.textContent = "No llueve";
      estado.classList.remove("text-primary");
      estado.classList.add("text-muted");
    }
  });
}
consultarLLuvia();

async function consultarAlarma() {
  const dataRef = collection(
    db,
    "dispositivos",
    "esp32",
    "variables",
    "alarma",
    "data"
  );

  const q = query(dataRef, orderBy("timestamp", "desc"), limit(1));
  onSnapshot(q, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const btn = document.getElementById("alarma-btn");
    const estado = document.getElementById("alarma-estado");

    //valor es 1 si esta activa y 0 si no está activa
    if (data[0].value === 1) {
      btn.classList.remove("bg-secondary");
      btn.classList.add("bg-success");
      estado.textContent = "Alarma ON";
      estado.classList.remove("text-muted");
      estado.classList.add("text-success");
    } else {
      btn.classList.remove("bg-success");
      btn.classList.add("bg-secondary");
      estado.textContent = "Alarma OFF";
      estado.classList.remove("text-success");
      estado.classList.add("text-muted");
    }
  });
}

consultarAlarma();

const toggleAlarma = document.getElementById("alarma-btn");
if (toggleAlarma) {
  toggleAlarma.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("alarma-estado");
    const isActive = estado.textContent.includes("ON");
    await addDoc(
      collection(db, "dispositivos", "esp32", "variables", "alarma", "data"),
      {
        sensor_id: "L001",
        value: isActive ? 0 : 1,
        timestamp: serverTimestamp(),
      }
    );
  });
}
