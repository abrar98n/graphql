import { formatXP } from "./formatXP.js";

function formatLabel(text, x) {
  if (text.length > 12) {
    text = text.slice(0, 12) + "...";
  }

  const words = text.split("-");

  return `
    <tspan x="${x}" dy="0">${words[0] || ""}</tspan>
    <tspan x="${x}" dy="12">${words[1] || ""}</tspan>
  `;
}

export function generateBarChart(data) {
  if (!data.length) {
    return `<p class="empty-chart-text">No chart data available.</p>`;
  }

  const width = 700;
  const height = 260;
  const padding = 30;
  const barGap = 20;
  const maxValue = Math.max(...data.map((item) => item.amount), 1);
  const barWidth = (width - padding * 2 - barGap * (data.length - 1)) / data.length;

  const bars = data.map((item, index) => {
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
          y="${height - 18}"
          text-anchor="middle"
          font-size="10"
          fill="#98a2c3"
        >
          ${formatLabel(item.name, x + barWidth / 2)}
        </text>
        <text
          x="${x + barWidth / 2}"
          y="${y - 8}"
          text-anchor="middle"
          font-size="11"
          fill="#f5f7ff"
        >
          ${formatXP(item.amount)}
        </text>
      </g>
    `;
  }).join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
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