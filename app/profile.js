export function renderProfile(app, renderApp) {
  app.innerHTML = `
    <main class="profile-page">
      <section class="profile-shell">
        <header class="profile-header">
          <div class="profile-header-text">
            <h1 class="profile-title">GraphQL Profile</h1>
            <p class="profile-subtitle">You are logged in successfully</p>
          </div>

          <button class="logout-btn" id="logout-btn">Logout</button>
        </header>

        <section class="profile-placeholder">
          <h2>Profile Dashboard</h2>
          <p>This is a temporary placeholder.</p>
        </section>
      </section>
    </main>
  `;

  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    renderApp();
  });
}