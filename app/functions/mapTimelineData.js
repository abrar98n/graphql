export function mapTimelineData(xpTimeline = []) {
  if (!xpTimeline.length) return [];

  const monthlyXP = {};

  xpTimeline.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyXP[key]) {
      monthlyXP[key] = 0;
    }

    monthlyXP[key] += item.amount;
  });

  const dates = xpTimeline.map((item) => new Date(item.createdAt));
  const maxDate = new Date(Math.max(...dates));

  const filledMonths = [];

  const startDate = new Date(maxDate.getFullYear(), maxDate.getMonth() - 11, 1);
  let current = new Date(startDate);

  while (current <= maxDate) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;

    filledMonths.push({
      label: key,
      amount: monthlyXP[key] || 0,
    });

    current.setMonth(current.getMonth() + 1);
  }

  return filledMonths.map((item, index) => ({
    ...item,
    index,
  }));
}