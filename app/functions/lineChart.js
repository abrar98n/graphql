import { formatXP } from "./formatXP.js";

export function generateLineChart(data) {
  if (!data.length) {
    return `<p class="empty-chart-text">No timeline data.</p>`;
  }

  const width = 700;
  const height = 260;
  const paddingLeft = 85;
  const paddingRight = 40;
  const paddingBottom = 40;
  const chartHeight = 150;

  const chartBottom = height - paddingBottom;
  const chartTop = chartBottom - chartHeight;

  const maxValue = Math.max(...data.map(d => d.amount), 1);

  const stepX =
    data.length > 1
      ? (width - paddingLeft - paddingRight) / (data.length - 1)
      : 0;

  const points = data.map((item, i) => {
    const x = paddingLeft + i * stepX;
    const y = chartBottom - (item.amount / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const circles = data.map((item, i) => {
    const x = paddingLeft + i * stepX;
    const y = chartBottom - (item.amount / maxValue) * chartHeight;

    return `<circle cx="${x}" cy="${y}" r="4" fill="#a5b4fc" />`;
  }).join("");

//   const labels = data.map((item, i) => {
//     const x = paddingLeft + i * stepX;

//     return `
//       <text
//         x="${x}"
//         y="${height - 10}"
//         text-anchor="middle"
//         font-size="10"
//         fill="#98a2c3"
//       >
//         ${item.label}
//       </text>
//     `;
//   }).join("");

const labels = data.map((item, i) => {
  const x = paddingLeft + i * stepX;
  const [year, month] = item.label.split("-");

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthName = months[parseInt(month) - 1];

  return `
    <text
      x="${x}"
      y="${height - 18}"
      text-anchor="middle"
      font-size="10"
      fill="#98a2c3"
    >
      <tspan x="${x}" dy="0">${monthName}</tspan>
      <tspan x="${x}" dy="12">${year}</tspan>
    </text>
  `;
}).join("");

  let grid = "";
  let yLabels = "";
  const gridLines = 4;

  for (let i = 0; i <= gridLines; i++) {
    const value = maxValue - (maxValue / gridLines) * i;
    const y = chartTop + (chartHeight / gridLines) * i;

    grid += `
      <line
        x1="${paddingLeft}"
        y1="${y}"
        x2="${width - paddingRight}"
        y2="${y}"
        stroke="rgba(255,255,255,0.08)"
      />
    `;

    yLabels += `
      <text
        x="${paddingLeft - 16}"
        y="${y + 4}"
        text-anchor="end"
        font-size="10"
        fill="#98a2c3"
      >
        ${formatXP(value)}
      </text>
    `;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
      ${grid}
      ${yLabels}

      <line
        x1="${paddingLeft}"
        y1="${chartTop}"
        x2="${paddingLeft}"
        y2="${chartBottom}"
        stroke="rgba(255,255,255,0.12)"
      />

      <line
        x1="${paddingLeft}"
        y1="${chartBottom}"
        x2="${width - paddingRight}"
        y2="${chartBottom}"
        stroke="rgba(255,255,255,0.12)"
      />

      <polyline
        fill="none"
        stroke="#a78bfa"
        stroke-width="3"
        points="${points.join(" ")}"
      />

      ${circles}
      ${labels}
    </svg>
  `;
}