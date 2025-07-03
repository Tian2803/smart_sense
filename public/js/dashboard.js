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
  doc,
  setDoc,
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
    if (dato[0].value === 1) {
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

var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.1.91";
var port = 9001;

function onConnect() {
  console.log("Connected to MQTT broker on port 9001");
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    setTimeout(mqttConnect, reconnectTimeout);
  }
}

function onFailure(message) {
  console.log("Connection failed: " + message.errorMessage);
  setTimeout(mqttConnect, reconnectTimeout);
}

const toggleAlarma = document.getElementById("alarma-btn");
if (toggleAlarma) {
  toggleAlarma.addEventListener("click", async (e) => {
    e.preventDefault();
    const estado = document.getElementById("alarma-estado");
    const isActive = estado.textContent.includes("ON");
    const nuevoValor = isActive ? 0 : 1;
    await addDoc(
      collection(db, "dispositivos", "esp32", "variables", "alarma", "data"),
      {
        sensor_id: "L001",
        value: nuevoValor,
        timestamp: serverTimestamp(),
      }
    );

    // 2. Actualizar ultimos_datos (con timestamp en milisegundos)
    const ultimosDatosRef = doc(
      db,
      "dispositivos",
      "esp32",
      "variables",
      "ultimos_datos"
    );
    const timestampMs = Date.now();

    await setDoc(
      ultimosDatosRef,
      {
        alarma: nuevoValor,
        timestamp: timestampMs, // ← Timestamp numérico
      },
      { merge: true }
    );

    if (!mqtt || !mqtt.isConnected()) {
      console.error("MQTT client not connected");
      return false;
    }

    const alarmData = {
      alarma: nuevoValor,
    };

    try {
      const message = new Paho.MQTT.Message(JSON.stringify(alarmData));
      message.destinationName = "data0027/alarma";
      message.qos = 1;
      mqtt.send(message);

      console.log("🚨 Alarm published:", alarmData);
      return true;
    } catch (error) {
      console.error("Error publishing alarm:", error);
      return false;
    }
  });
}

function mqttConnect() {
  console.log("Connecting to " + host + ":" + port);

  if (typeof Paho === "undefined") {
    console.error("Paho MQTT library not loaded");
    setTimeout(mqttConnect, 2000);
    return;
  }

  mqtt = new Paho.MQTT.Client(host, port, "UdeC0027");

  mqtt.onConnectionLost = onConnectionLost;

  var options = {
    timeout: 10,
    onSuccess: onConnect,
    onFailure: onFailure,
    userName: "sebastian",
    password: "2025",
    useSSL: false,
    cleanSession: true,
    keepAliveInterval: 30,
  };

  mqtt.connect(options);
}

// Inicializar conexión MQTT cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  // Esperar un poco antes de conectar para asegurar que Paho esté cargado
  setTimeout(mqttConnect, 1000);
});
