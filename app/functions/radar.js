export function renderRadarChart(container, topSkills) {
  if (!container || !topSkills.length) return;

  const labels = topSkills.map(skill => skill.name);
  const values = topSkills.map(skill => skill.amount);

  const size = 500;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 130;

  let axes = "";
  let labelsText = "";
  let points = "";
  let circles = "";

  for (let i = 0; i < labels.length; i++) {
    const angle = (-Math.PI / 2) + (2 * Math.PI * i / labels.length);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    axes += `
      <line
        x1="${centerX}"
        y1="${centerY}"
        x2="${x}"
        y2="${y}"
        stroke="rgba(255,255,255,0.2)"
      />
    `;

    const labelX = centerX + (radius + 25) * Math.cos(angle);
    const labelY = centerY + (radius + 25) * Math.sin(angle);

    labelsText += `
      <text
        x="${labelX}"
        y="${labelY}"
        fill="white"
        font-size="12"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${labels[i]}
      </text>
    `;

    const scaled = (values[i] / 100) * radius;

    const pointX = centerX + scaled * Math.cos(angle);
    const pointY = centerY + scaled * Math.sin(angle);

    points += `${pointX},${pointY} `;
  }

  for (let i = 1; i <= 5; i++) {
    const r = (radius / 5) * i;

    circles += `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${r}"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
      />
    `;
  }

  container.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}">
      ${circles}
      ${axes}
      <polygon
        points="${points}"
        fill="rgba(168,139,250,0.4)"
        stroke="#a78bfa"
        stroke-width="2"
      />
      ${labelsText}
      <circle cx="${centerX}" cy="${centerY}" r="4" fill="white" />
    </svg>
  `;
}