# Web Firebase App

Este proyecto es una aplicación web que utiliza Firebase para la autenticación de usuarios y Firestore para almacenar y mostrar datos en tiempo real. La aplicación incluye funcionalidades de inicio de sesión, registro de usuarios, verificación de correo electrónico y un panel de control con gráficos interactivos.

## Estructura del Proyecto

```
smart-sense
├── public
│   ├── index.html           # Página principal de la aplicación
│   ├── login.html           # Interfaz de inicio de sesión
│   ├── register.html        # Formulario de registro de nuevos usuarios
│   ├── reset_password.html     # Mensaje de restablecer la contraseña
│   ├── dashboard.html       # Panel de control con gráficos
│   └── js
│       ├── firebase-config.js # Configuración de Firebase
│       ├── register.js # Logica de registro de usuarios
│       ├── login.js          # Lógica de autenticación y cambio de contraseña
│       ├── dashboard.js      # Lógica del dashboard
│       └── utils.js         # Funciones utilitarias
└── README.md                # Documentación del proyecto
```

## Requisitos

- Crear un proyecto en Firebase y configurar la autenticación y Firestore.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto:
   ```
   cd smart-sense
   ```

## Uso

1. Abre el archivo `public/index.html` en tu navegador para acceder a la aplicación.
2. Regístrate como nuevo usuario o inicia sesión si ya tienes una cuenta.
3. Después del registro, verifica tu correo electrónico para activar tu cuenta.
4. Una vez verificado, podrás iniciar sesión y acceder al dashboard.

## Licencia

Este proyecto está bajo la Licencia MIT.

## Documentacion de oficial de firebase

https://modularfirebase.web.app/common-use-cases/authentication/
