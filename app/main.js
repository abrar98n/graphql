import { renderLogin } from "./login.js";
import { renderProfile } from "./profile.js";

const app = document.getElementById("app");

function renderApp() {
  const token = localStorage.getItem("token");

  if (token) {
    renderProfile(app, renderApp);
  } else {
    renderLogin(app, renderApp);
  }
}

renderApp();