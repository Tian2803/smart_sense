# Smart Sense - Sistema IoT de Monitoreo y Alerta temprana de Inundación

Este proyecto es una aplicación web que utiliza Firebase para la autenticación de usuarios y Firestore para almacenar y mostrar datos en tiempo real. La aplicación incluye funcionalidades de inicio de sesión, registro de usuarios, verificación de correo electrónico y un panel de control con gráficos interactivos.

## 👨‍💻 Desarrollador

**Sebastián Burgos Pérez**

- 🎓 Universidad de Cartagena
- 📚 Programa: Ingeniería de Sistemas

## 🚀 Características del Sistema

- 🔐 Autenticación de usuarios con Firebase Auth
- 📊 Dashboard en tiempo real con Chart.js
- 🌐 Comunicación MQTT
- 📱 Diseño responsive para móviles
- 🔄 Sincronización automática de datos
- 📈 Visualización de datos históricos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, JavaScript (ES6+), Bootstrap 5
- **Backend**: Firebase (Auth + Firestore)
- **Comunicación IoT**: MQTT (Paho)
- **Gráficos**: Chart.js
- **Hardware**: ESP32, DHT11, Buzzer activo, HC-SR04, RELÉ 3.3V, Sensor de Flujo de Agua YF-S201, Sensor de Lluvia YL-83

## Estructura del Proyecto

```
smart-sense
├── public
│   ├── index.html           # Página principal de la aplicación
│   ├── login.html           # Interfaz de inicio de sesión
│   ├── register.html        # Formulario de registro de nuevos usuarios
│   ├── reset_password.html     # Mensaje de restablecer la contraseña
│   ├── dashboard.html       # Panel de control con gráficos
│   ├── alertas.html       # Panel de control con graficos (Valores criticos de las variables de interes)
│   ├── assets
│   │   ├── logo.png
│   │   └── onboard.png
│   └── js
│       ├── firebase-config.js # Configuración de Firebase
│       ├── register.js # Logica de registro de usuarios
│       ├── login.js          # Lógica de autenticación y cambio de contraseña
│       ├── dashboard.js      # Lógica del dashboard
│       ├── alertas.js      # Lógica de los valores critcos de las variables de interes
│       ├── signOut.js      # Lógica de cerrar sesion
│       └── user.js         # Logica consultar nombre del usuario
└── README.md                # Documentación del proyecto
```

## Estructura de la base de datos (Firestore)

```
/dispositivos (colección)
│
├── esp32 (documento) — [ID del dispositivo]
│   │
│   ├── variables (colección)
│   │   │
│   │   ├── temperatura (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: double
│   │   │           ├── timestamp: timestamp
│   │   │           └── sensor_id: string
│   │   │
│   │   ├── humedad (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: double
│   │   │           ├── timestamp: timestamp
│   │   │           └── sensor_id: string
│   │   │
│   │   ├── distancia (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: integer
│   │   │           └── sensor_id: string
│   │   │
│   │   ├── flujo (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: double
│   │   │           ├── timestamp: timestamp
│   │   │           └── sensor_id: string
│   │   │
│   │   ├── lluvia (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: integer
│   │   │           ├── timestamp: timestamp
│   │   │           └── sensor_id: string
│   │   │
│   │   ├── alarma (documento)
│   │   │   └── data (colección)
│   │   │       └── [autoID] (documento)
│   │   │           ├── value: integer
│   │   │           ├── timestamp: timestamp
│   │   │           └── sensor_id: string
│   │   │
│   │   └── ultimos_datos (documento)
│   │       ├── temperatura: double
│   │       ├── humedad: double
│   │       ├── distancia: integer
│   │       ├── flujo: double
│   │       ├── lluvia: integer
│   │       ├── alarma: integer
│   │       └── timestamp: timestamp
│   │
│   └── alertas (colección)
│        │   ├── distancia (documento)
│        │   │   └── data (colección)
│        │   │       └── [autoID] (documento)
│        │   │           ├── value: integer
│        │   │           ├── timestamp: timestamp
│        │   │           └── sensor_id: string
│        │   │
│        │   ├── lluvia (documento)
│        │   │   └── data (colección)
│        │   │       └── [autoID] (documento)
│        │   │           ├── value: integer
│        │   │           ├── timestamp: timestamp
│        │   │           └── sensor_id: string
│        │   │
│        │   └── flujo (documento)
│        │       └── data (colección)
│        │           └── [autoID] (documento)
│        │               ├── value: double
│        │               ├── timestamp: timestamp
│        │               └── sensor_id: string

```

### Explicación de la estructura:

- **dispositivos**: Colección principal que contiene todos los dispositivos IoT
- **esp32**: Documento específico para el dispositivo ESP32
- **variables**: Colección que agrupa todas las variables/sensores del dispositivo
- **[sensor]**: Cada documento representa un tipo de sensor (temperatura, humedad, etc.)
- **data**: Colección que almacena los valores históricos de cada sensor
- **[autoID]**: Documentos con ID automático que contienen las lecturas individuales
- **ultimos_datos**: Documento especial que mantiene los valores más recientes de todos los sensores
- **alertas**: Colección que agrupa todas las variables/sensores de interes al alcanzar valores criticos

## Requisitos

- Crear un proyecto en Firebase y configurar la autenticación y Firestore.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto:
   ```
   cd smart-sense
   ```
3. Agrega al archivo mosquito.config el puerto y protocolo para websockets
   ```
   listener 9001
   protocol websockets
   ```

## Uso

1. Abre el archivo `public/index.html` en tu navegador para acceder a la aplicación.
2. Regístrate como nuevo usuario o inicia sesión si ya tienes una cuenta.
3. Después del registro, verifica tu correo electrónico para activar tu cuenta.
4. Una vez verificado, podrás iniciar sesión y acceder al dashboard.

## 📚 Referencias

- [Documentación oficial de Firebase](https://modularfirebase.web.app/common-use-cases/authentication/)
- [Conexión con Paho-mqtt en JavaScript](https://stackoverflow.com/questions/70128563/mosquitto-and-simple-paho-js-client)
- [Bootstrap 5 documentation](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [Chart.js documentation](https://www.chartjs.org/docs/latest/)

## Licencia

Este proyecto está bajo la Licencia MIT.
