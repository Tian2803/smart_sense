import { app } from "./firebase-config.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
              //window.location.href = "dashboard.html";
              sessionStorage.setItem("uid", user.uid);
              alert("Iniciando sesión...");
            } else {
              sendEmailVerification(user)
                .then(() => {
                  alert(
                    "Por favor, verifica tu correo electrónico o si no lo has recibido, revisa tu carpeta de spam. Luego podrás iniciar sesión."
                  );
                })
                .catch((error) => {
                  console.error(
                    "Error al enviar el correo de verificación:",
                    error
                  );
                });
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === "auth/user-not-found") {
              alert("Usuario no encontrado. Por favor, regístrate primero.");
            }
            if (errorCode === "auth/invalid-credential") {
              alert(
                "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña."
              );
            }
            if (errorCode === "auth/invalid-email") {
              alert("El correo electrónico ingresado no es válido.");
            }
            if (errorCode === "auth/missing-password") {
              alert("Por favor, ingresa una contraseña.");
            }
            if (errorCode === "auth/wrong-password") {
              alert("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
            }
            if (errorCode === "auth/weak-password") {
              alert("La contraseña debe tener al menos 6 caracteres.");
            }
            if (errorCode === "auth/too-many-requests") {
              alert(
                "Demasiados intentos fallidos. Por favor, espera un momento antes de intentar nuevamente."
              );
            }
            console.log(
              "Error en el inicio de sesión:",
              errorCode,
              errorMessage
            );
          });
      } else {
        alert("Por favor, completa todos los campos.");
      }
    });
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await user.reload();
    console.log("Usuario autenticado:", user.email);
    if (user.emailVerified) {
      console.log("El correo electrónico está verificado.");
      location.href = "dashboard.html";
    }
  } else {
    console.log("No hay usuario autenticado");
  }
});

const resetPassword = document.getElementById("reset-password-form");
if (resetPassword) {
  resetPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert(
            "Se ha enviado un correo electrónico para restablecer la contraseña. Por favor, revisa tu bandeja de entrada, si no lo encuentras, revisa tu carpeta de spam."
          );
          resetPassword.reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(
            "Error al enviar el correo de restablecimiento:",
            errorCode,
            errorMessage
          );
        });
    } else {
      alert("Por favor, ingresa tu correo electrónico.");
    }
  });
}
