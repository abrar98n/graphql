export function renderLogin(app, renderApp) {


//------------------ login page -------------------
app.innerHTML = `
  <main class="login-page">
    <section class="login-card">
      <div class="login-header">
        <div class="login-avatar"></div>
        <h1 class="login-title">GraphQL Profile</h1>
        <p class="login-subtitle">Sign in with your username or email</p>
      </div>

      <form class="login-form">
        <div class="input-group">
          <label for="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            placeholder="Enter your username or email"
            autocomplete="username"
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>

     <p class="login-error" id="login-error"></p>
<button type="submit" class="login-btn">Login</button>
      </form>
    </section>
  </main>
`;
const form = document.querySelector(".login-form");
const errorMsg = document.getElementById("login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value;
  const password = document.getElementById("password").value;

errorMsg.textContent = "";
errorMsg.style.display = "none";


  try {
    //transform to base64
    const credentials = btoa(`${identifier}:${password}`);

    const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!res.ok) {
  errorMsg.textContent = "Invalid username/email or password.";
  errorMsg.style.display = "block";
  return;
}

 const token = await res.text();
const cleanToken = token.replace(/^"|"$/g, "");

console.log("JWT:", cleanToken);
localStorage.setItem("token", cleanToken);
    
    renderApp();

  } catch (err) {
    errorMsg.textContent = "Invalid username/email or password.";
    errorMsg.style.display = "block";
  }
});
}