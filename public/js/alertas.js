import { app } from "./firebase-config.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const db = getFirestore(app);

async function consultarVariable(deviceId, variable, canvasId, label, color) {
  const dataRef = collection(
    db,
    "dispositivos",
    deviceId,
    "alertas",
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

  // Crear dos arrays: uno para etiquetas cortas (eje X) y otro para fechas completas (tooltip)
  const labels = [];
  const fullDates = [];

  data.forEach((d) => {
    let dateObj;
    if (typeof d.timestamp === "string") {
      dateObj = new Date(d.timestamp);
    } else if (d.timestamp && d.timestamp.toDate) {
      dateObj = d.timestamp.toDate();
    }

    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const seconds = String(dateObj.getSeconds()).padStart(2, "0");
      // Eje X - hora, minutos y segundos
      const shortLabel = `${hours}:${minutes}:${seconds}`;
      // Tooltip - Fecha completa
      const fullDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

      labels.push(shortLabel);
      fullDates.push(fullDate);
    } else {
      labels.push("");
      fullDates.push("");
    }
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
              const index = context[0].dataIndex;
              return fullDates[index];
            },
            label: function (context) {
              return `${label}: ${context.parsed.y}`;
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: { display: false },
          ticks: {
            maxTicksLimit: 8,
            maxRotation: 45,
            minRotation: 0,
            font: {
              size: 10,
            },
          },
          grid: {
            display: true,
            drawOnChartArea: false,
            drawTicks: true,
            tickLength: 5,
            color: "#858796", //#f8f9fc
            lineWidth: 1,
          },
          border: {
            display: true,
            color: "#858796",
            width: 1,
          },
        },
        y: {
          display: true,
          title: { display: false },
          grid: {
            display: true,
            drawOnChartArea: false,
            drawTicks: true,
            tickLength: 5,
            color: "#858796", //#f8f9fc
            lineWidth: 1,
          },
          border: {
            display: true,
            color: "#858796",
            width: 1,
          },
        },
      },
    },
  });
}

consultarVariable(
  "esp32",
  "distancia",
  "sensorChart1",
  "Distancia (cm)",
  "#f6c23e"
);

consultarVariable("esp32", "flujo", "sensorChart2", "Flujo (L/s)", "#e74a3b");

consultarVariable("esp32", "lluvia", "sensorChart3", "Lluvia", "#1cc88a");
