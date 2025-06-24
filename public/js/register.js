import { app } from "./firebase-config.js";
import { registerUser } from "./user.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      const name = e.target.name.value;
      const lastname = e.target.lastname.value;
      const organizacion = e.target.org.value;

      if (email && password && name && lastname && organizacion) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            if (user !== null) {
              await registerUser({
                name,
                lastname,
                organizacion,
                uid: user.uid,
              });
              //alert("Registro exitoso");
              sendEmailVerification(user)
                .then(() => {
                  alert(
                    "Por favor, verifica tu correo electrónico o si no lo has recibido, revisa tu carpeta de spam."
                  );
                  window.location.href = "login.html";
                })
                .catch((error) => {
                  console.error(
                    "Error al enviar el correo de verificación:",
                    error
                  );
                });
              auth.signOut();
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/email-already-in-use") {
              alert(
                "El correo electrónico ya está en uso. Por favor, inicia sesión."
              );
            }
            if (errorCode === "auth/invalid-email") {
              alert("El correo electrónico ingresado no es válido.");
            }
            if (errorCode === "auth/weak-password") {
              alert("La contraseña debe tener al menos 6 caracteres.");
            }
            if (errorCode === "auth/missing-password") {
              alert("Por favor, ingresa una contraseña.");
            }
            if (errorCode === "auth/operation-not-allowed") {
              alert(
                "El registro con correo electrónico y contraseña no está habilitado."
              );
            }
            if (errorCode === "auth/too-many-requests") {
              alert(
                "Demasiados intentos fallidos. Por favor, espera un momento antes de intentar nuevamente."
              );
            }
            console.log("Error en el registro:", errorCode, errorMessage);
          });
      } else {
        alert("Por favor, completa todos los campos.");
      }
    });
  }
});
