import { app } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth(app);

const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        alert("Sesión cerrada exitosamente");
        sessionStorage.removeItem("uid");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
