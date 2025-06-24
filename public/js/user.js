import { app } from "./firebase-config.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const db = getFirestore(app);

export async function registerUser(usuario) {
  try {
    await addDoc(collection(db, "usuarios"), usuario);
    alert("Registro exitoso");
  } catch (error) {
    console.log("Error al registrar usuario: " + error.message);
  }
}

async function consultarUsuario() {
  try {
    const uid = sessionStorage.getItem("uid");
    if (uid) {
      const querySnapshot = await getDocs(
        query(collection(db, "usuarios"), where("uid", "==", uid))
      );
      if (!querySnapshot.empty) {
        const usuario = querySnapshot.docs[0].data();
        document.getElementById(
          "user"
        ).innerText = `${usuario.name} ${usuario.lastname}`;
      } else {
        console.log("Usuario no encontrado");
      }
    } else {
      console.log("No hay usuario autenticado");
    }
  } catch (error) {
    console.error("Error al consultar usuario:", error);
  }
}

consultarUsuario();
