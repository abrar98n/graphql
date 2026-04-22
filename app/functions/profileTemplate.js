import { formatXP } from "./formatXP.js";
import { generateBarChart } from "./barChart.js";
import { generateLineChart } from "./lineChart.js";

export function profileTemplate({ user, totalXP, level, auditRatio, chartData, timelineData, topSkills }) {
  return `
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

          <section class="profile-dashboard">

            <div class="profile-user-info">
              <p><strong>User ID:</strong> ${user?.id ?? "N/A"}</p>
              <p><strong>Username:</strong> ${user?.login ?? "N/A"}</p>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <p class="stat-label">XP</p>
                <h3 class="stat-value">${formatXP(totalXP)}</h3>
              </div>

              <div class="stat-card">
                <p class="stat-label">Level</p>
                <h3 class="stat-value">${level}</h3>
              </div>

              <div class="stat-card">
                <p class="stat-label">Audit Ratio</p>
                <h3 class="stat-value">${auditRatio}</h3>
              </div>
            </div>

            <section class="chart-card">
              <div class="chart-card-header">
                <h2 class="chart-title">XP by Project</h2>
                <p class="chart-subtitle">Top XP transactions</p>
              </div>

              ${generateBarChart(chartData)}
            </section>

            <section class="chart-card">
              <div class="chart-card-header">
                <h2 class="chart-title">XP Over Time</h2>
                <p class="chart-subtitle">Your progress timeline</p>
              </div>

              ${generateLineChart(timelineData)}
            </section>

            <section class="chart-card">
              <div class="chart-card-header">
                <h2 class="chart-title">Top Skills</h2>
                <p class="chart-subtitle">Highest skill values</p>
              </div>
              <div id="radar-chart"></div>
              <div class="skills-list">
                ${topSkills.map(skill => `
                  <div class="skill-item">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-value">${skill.amount}</span>
                  </div>
                `).join("")}
              </div>
            </section>

          </section>
        </section>
      </section>
    </main>
  `;
}