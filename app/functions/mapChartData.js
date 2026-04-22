export function mapChartData(xpTransactions = []) {
  return xpTransactions.map((item) => {
    const parts = item.path.split("/");
    const projectName = parts[parts.length - 1] || "project";

    return {
      name: projectName,
      amount: item.amount,
    };
  });
}