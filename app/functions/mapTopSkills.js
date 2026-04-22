export function mapTopSkills(skillsData = []) {
  const skillMap = {};

  skillsData.forEach((skill) => {
    const name = skill.type.replace("skill_", "");

    if (!skillMap[name] || skill.amount > skillMap[name]) {
      skillMap[name] = skill.amount;
    }
  });

  const finalSkills = Object.entries(skillMap).map(([name, amount]) => ({
    name,
    amount,
  }));

  finalSkills.sort((a, b) => b.amount - a.amount);

  return finalSkills.slice(0, 6);
}