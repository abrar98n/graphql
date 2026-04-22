function generateBarChart(data) {
  if (!data.length) {
    return `<p class="empty-chart-text">No chart data available.</p>`;
  }

  const width = 700;
  const height = 260;
  const padding = 30;
  const barGap = 20;
  const maxValue = Math.max(...data.map((item) => item.amount), 1);
  const barWidth = (width - padding * 2 - barGap * (data.length - 1)) / data.length;

  const bars = data
    .map((item, index) => {
      const barHeight = (item.amount / maxValue) * 150;
      const x = padding + index * (barWidth + barGap);
      const y = height - padding - barHeight;

      return `
        <g>
          <rect
            x="${x}"
            y="${y}"
            width="${barWidth}"
            height="${barHeight}"
            rx="10"
            fill="url(#barGradient)"
          />
          <text
            x="${x + barWidth / 2}"
            y="${height - 10}"
            text-anchor="middle"
            font-size="11"
            fill="#98a2c3"
          >
            ${item.name}
          </text>
          <text
            x="${x + barWidth / 2}"
            y="${y - 8}"
            text-anchor="middle"
            font-size="11"
            fill="#f5f7ff"
          >
            ${item.amount}
          </text>
        </g>
      `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="XP by project bar chart">
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#4f8cff" />
        </linearGradient>
      </defs>

      <line
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
        stroke="rgba(255,255,255,0.12)"
      />

      ${bars}
    </svg>
  `;
}


function generateLineChart(data) {
  if (!data.length) {
    return `<p class="empty-chart-text">No timeline data.</p>`;
  }

  const width = 700;
  const height = 260;
  const padding = 40;
  const chartHeight = 150;
  const chartBottom = height - padding;
  const chartTop = chartBottom - chartHeight;

  const maxValue = Math.max(...data.map((d) => d.amount), 1);
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  // Create line points
  const points = data.map((item, i) => {
    const x = padding + i * stepX;
    const y = chartBottom - (item.amount / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  // Draw dots only
  const circles = data.map((item, i) => {
    const x = padding + i * stepX;
    const y = chartBottom - (item.amount / maxValue) * chartHeight;

    return `
      <circle cx="${x}" cy="${y}" r="4" fill="#a5b4fc" />
    `;
  }).join("");

  // X labels
  const labels = data.map((item, i) => {
    const x = padding + i * stepX;
    return `
      <text
        x="${x}"
        y="${height - 10}"
        text-anchor="middle"
        font-size="10"
        fill="#98a2c3"
      >
        ${item.label}
      </text>
    `;
  }).join("");

  // Horizontal grid lines
  const gridLines = 4;
  let grid = "";

  for (let i = 0; i <= gridLines; i++) {
    const y = chartTop + (chartHeight / gridLines) * i;

    grid += `
      <line
        x1="${padding}"
        y1="${y}"
        x2="${width - padding}"
        y2="${y}"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1"
      />
    `;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="XP over time line chart">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#4f8cff" />
        </linearGradient>
      </defs>

      ${grid}

      <line
        x1="${padding}"
        y1="${chartTop}"
        x2="${padding}"
        y2="${chartBottom}"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="1"
      />

      <line
        x1="${padding}"
        y1="${chartBottom}"
        x2="${width - padding}"
        y2="${chartBottom}"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="1"
      />

      <polyline
        fill="none"
        stroke="url(#lineGradient)"
        stroke-width="3"
        points="${points.join(" ")}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      ${circles}
      ${labels}
    </svg>
  `;
}


export async function renderProfile(app, renderApp) {

    const token = localStorage.getItem("token");

    const query = `
    {
    user {
        id
        login
    }

    transaction_aggregate(where: { type: { _eq: "xp" } }) {
        aggregate {
        sum {
            amount
        }
        }
    }

level: transaction(
  where: { type: { _eq: "level" } }
  order_by: { amount: desc }
  limit: 1
) {
  amount
}

    auditRatio: transaction_aggregate(where: { type: { _eq: "up" } }) {
        aggregate {
        sum {
            amount
        }
        }
    }

    auditDown: transaction_aggregate(where: { type: { _eq: "down" } }) {
        aggregate {
        sum {
            amount
           }
          }
        }

    xpTransactions: transaction(
    where: { type: { _eq: "xp" } }
    order_by: { amount: desc }
    limit: 6
    ) {
    amount
    path
    }

    xpTimeline: transaction(
    where: { type: { _eq: "xp" } }
    order_by: { createdAt: asc }
    ) {
    amount
    createdAt
    }

    skills: transaction(
    where: { type: { _like: "skill_%" } }
    order_by: { amount: desc }
    ) {
    type
    amount
    }
    
  }
`;

    let user = null;
    let totalXP= null;
    let level = null;
    let auditUp = null;
    let auditDown = null;
    let auditRatio = null;
    let chartData = [];
    let timelineData = [];
    let topSkills = [];


    try {
    const res = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
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

      const xpTransactions = data?.xpTransactions || [];

      chartData = xpTransactions.map((item) => {
      const parts = item.path.split("/");
      const projectName = parts[parts.length - 1] || "project";

        return {
            name: projectName,
            amount: item.amount,
        };
        });
        
        console.log("CHART DATA:", chartData);   


      const xpTimeline = data?.xpTimeline || [];
      const monthlyXP = {};

        xpTimeline.forEach((item) => {
        const date = new Date(item.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;


        if (!monthlyXP[key]) {
            monthlyXP[key] = 0;
        }
        monthlyXP[key] += item.amount;
        });

      
        const dates = xpTimeline.map(item => new Date(item.createdAt));

        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

    
        const filledMonths = [];

        let current = new Date(minDate.getFullYear(), 5, 1);

        while (current <= maxDate) {
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;

        filledMonths.push({
            label: key,
            amount: monthlyXP[key] || 0 
        });

     
        current.setMonth(current.getMonth() + 1);
        }


        timelineData = filledMonths.map((item, index) => ({
        ...item,
        index
        }));

        console.log("TIMELINE DATA:", timelineData);

      const skillsData = data?.skills || [];

      const skillMap = {};

      skillsData.forEach(skill => {
        const name = skill.type.replace("skill_", "");

        if (!skillMap[name] || skill.amount > skillMap[name]) {
          skillMap[name] = skill.amount;
        }
      });


      const finalSkills = Object.entries(skillMap).map(([name, amount]) => ({
        name,
        amount
      }));


      finalSkills.sort((a, b) => b.amount - a.amount);


      topSkills = finalSkills.slice(0, 6);

      console.log("FINAL SKILLS:", topSkills);



    } catch (err) {
    console.log("GraphQL error:", err);
    }

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

        <section class="profile-dashboard">

          <div class="profile-user-info">
            <p><strong>User ID:</strong> ${user?.id ?? "N/A"}</p>
            <p><strong>Login:</strong> ${user?.login ?? "N/A"}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <p class="stat-label">XP</p>
              <h3 class="stat-value">${totalXP}</h3>
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
  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    renderApp();
  });
}