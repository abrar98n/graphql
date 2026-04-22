import { renderRadarChart } from "./functions/radar.js";
import { PROFILE_QUERY } from "./functions/profileQuery.js";
import { mapTimelineData } from "./functions/mapTimelineData.js";
import { mapTopSkills } from "./functions/mapTopSkills.js";
import { profileTemplate } from "./functions/profileTemplate.js";
import { mapChartData } from "./functions/mapChartData.js";

const GRAPHQL_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export async function renderProfile(app, renderApp) {
  const token = localStorage.getItem("token");
  const query = PROFILE_QUERY;

  let user = null;
  let totalXP = null;
  let level = null;
  let auditUp = null;
  let auditDown = null;
  let auditRatio = null;
  let chartData = [];
  let timelineData = [];
  let topSkills = [];

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await res.json();
    const data = result.data;

    console.log("GRAPHQL DATA:", data);

    user = data?.user?.[0];
    totalXP = data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
    level = data?.level?.[0]?.amount || 0;
    auditUp = data?.auditRatio?.aggregate?.sum?.amount ?? 0;
    auditDown = data?.auditDown?.aggregate?.sum?.amount ?? 0;
    auditRatio = auditDown > 0 ? (auditUp / auditDown).toFixed(2) : "0.00";

    chartData = mapChartData(data?.xpTransactions || []);
    console.log("CHART DATA:", chartData);

    timelineData = mapTimelineData(data?.xpTimeline || []);
    console.log("TIMELINE DATA:", timelineData);

    topSkills = mapTopSkills(data?.skills || []);
    console.log("FINAL SKILLS:", topSkills);
  } catch (err) {
    console.log("GraphQL error:", err);
  }

  app.innerHTML = profileTemplate({
    user,
    totalXP,
    level,
    auditRatio,
    chartData,
    timelineData,
    topSkills,
  });

  const radarChart = document.getElementById("radar-chart");
  renderRadarChart(radarChart, topSkills);

  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    renderApp();
  });
}